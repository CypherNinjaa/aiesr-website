"use client";

import React, { Suspense } from "react";
import { LoadingState, Skeleton } from "@/components/ui/Loading";

interface SectionSuspenseProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export const SectionSuspense: React.FC<SectionSuspenseProps> = ({
  children,
  fallback,
  className = "",
}) => {
  const defaultFallback = (
    <div className={`py-20 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <Skeleton className="mx-auto mb-6 h-12 w-64" />
          <Skeleton className="mx-auto mb-6 h-1 w-24" />
          <Skeleton lines={3} className="mx-auto max-w-3xl" />
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="mb-4 h-64 rounded-lg bg-gray-200"></div>
              <Skeleton lines={2} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>;
};

interface LazyLoadSectionProps {
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}

export const LazyLoadSection: React.FC<LazyLoadSectionProps> = ({
  children,
  threshold = 0.1,
  rootMargin = "50px",
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div ref={ref}>
      {isVisible ? (
        children
      ) : (
        <div className="flex h-96 items-center justify-center">
          <LoadingState title="Loading section..." />
        </div>
      )}
    </div>
  );
};
