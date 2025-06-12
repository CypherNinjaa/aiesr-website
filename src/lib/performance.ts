// filepath: src/lib/performance.ts
"use client";

// Performance monitoring utilities for AIESR website

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

interface PerformanceConfig {
  apiEndpoint?: string;
  debug?: boolean;
  sampleRate?: number;
}

class PerformanceMonitor {
  private config: PerformanceConfig;
  private metrics: PerformanceMetrics = {};

  constructor(config: PerformanceConfig = {}) {
    this.config = {
      debug: false,
      sampleRate: 1, // Sample 100% by default
      ...config,
    };

    if (typeof window !== "undefined") {
      this.initializeMonitoring();
    }
  }
  private initializeMonitoring() {
    // Only monitor for a sample of users
    if (Math.random() > (this.config.sampleRate ?? 1)) return;

    this.measureWebVitals();
    this.measureResourceTiming();
    this.measureNavigationTiming();
  }

  private measureWebVitals() {
    // First Contentful Paint
    new PerformanceObserver(list => {
      const entries = list.getEntries();
      const fcp = entries.find(entry => entry.name === "first-contentful-paint");
      if (fcp) {
        this.metrics.fcp = fcp.startTime;
        this.logMetric("FCP", fcp.startTime);
      }
    }).observe({ entryTypes: ["paint"] });

    // Largest Contentful Paint
    new PerformanceObserver(list => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
      this.logMetric("LCP", lastEntry.startTime);
    }).observe({ entryTypes: ["largest-contentful-paint"] });

    // First Input Delay
    new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        this.metrics.fid = entry.processingStart - entry.startTime;
        this.logMetric("FID", this.metrics.fid);
      });
    }).observe({ entryTypes: ["first-input"] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.metrics.cls = clsValue;
      this.logMetric("CLS", clsValue);
    }).observe({ entryTypes: ["layout-shift"] });
  }

  private measureResourceTiming() {
    if ("performance" in window && "getEntriesByType" in performance) {
      const resources = performance.getEntriesByType("resource");

      // Analyze slow resources
      const slowResources = resources.filter(
        (resource: any) => resource.duration > 1000 // Resources taking more than 1 second
      );

      if (slowResources.length > 0 && this.config.debug) {
        console.warn("Slow resources detected:", slowResources);
      }
    }
  }

  private measureNavigationTiming() {
    if ("performance" in window && "getEntriesByType" in performance) {
      const navigation = performance.getEntriesByType("navigation")[0] as any;

      if (navigation) {
        this.metrics.ttfb = navigation.responseStart - navigation.requestStart;
        this.logMetric("TTFB", this.metrics.ttfb);
      }
    }
  }

  private logMetric(name: string, value: number) {
    if (this.config.debug) {
      console.log(`[Performance] ${name}: ${Math.round(value)}ms`);
    }

    // Send to analytics service if configured
    if (this.config.apiEndpoint) {
      this.sendMetric(name, value);
    }
  }

  private async sendMetric(name: string, value: number) {
    try {
      await fetch(this.config.apiEndpoint!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metric: name,
          value: Math.round(value),
          url: window.location.href,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
        }),
      });
    } catch (error) {
      if (this.config.debug) {
        console.error("Failed to send performance metric:", error);
      }
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public reportMetrics(): void {
    console.table(this.metrics);
  }
}

// Utility functions for manual performance measurement
export const measureAsync = async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();

  console.log(`[Performance] ${name}: ${Math.round(end - start)}ms`);
  return result;
};

export const measureSync = <T>(name: string, fn: () => T): T => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();

  console.log(`[Performance] ${name}: ${Math.round(end - start)}ms`);
  return result;
};

// Hook for React components
export const usePerformanceMonitor = (config?: PerformanceConfig) => {
  if (typeof window !== "undefined") {
    const monitor = new PerformanceMonitor(config);
    return {
      getMetrics: () => monitor.getMetrics(),
      reportMetrics: () => monitor.reportMetrics(),
    };
  }

  return {
    getMetrics: () => ({}),
    reportMetrics: () => {},
  };
};

// Create default instance
export const performanceMonitor = new PerformanceMonitor({
  debug: process.env.NODE_ENV === "development",
});

export default PerformanceMonitor;
