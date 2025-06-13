"use client";

import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    // Here you can log to error reporting service
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

// Default error fallback component
const DefaultErrorFallback: React.FC<{
  error?: Error;
  resetError: () => void;
}> = ({ error, resetError }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h2 className="font-primary mt-6 text-3xl font-extrabold text-gray-900">
            Oops! Something went wrong
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We encountered an unexpected error. Please try again.
          </p>
          {process.env.NODE_ENV === "development" && error && (
            <details className="mt-4 rounded-lg bg-red-50 p-4 text-left">
              <summary className="cursor-pointer font-medium text-red-600">
                Error Details (Development Mode)
              </summary>
              <pre className="mt-2 text-xs whitespace-pre-wrap text-red-500">{error.stack}</pre>
            </details>
          )}
        </div>{" "}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button
            onClick={resetError}
            className="bg-burgundy hover:bg-burgundy/90 focus:ring-burgundy inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            Try Again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="focus:ring-burgundy inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export { ErrorBoundary, DefaultErrorFallback };
