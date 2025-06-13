import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = "md", className }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };
  return (
    <div
      className={cn(
        "border-t-burgundy animate-spin rounded-full border-2 border-gray-300",
        sizeClasses[size],
        className
      )}
    />
  );
};

interface LoadingCardProps {
  className?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({ className }) => {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="space-y-4 rounded-lg bg-gray-200 p-6">
        <div className="h-4 w-3/4 rounded bg-gray-300"></div>
        <div className="space-y-2">
          <div className="h-3 rounded bg-gray-300"></div>
          <div className="h-3 w-5/6 rounded bg-gray-300"></div>
        </div>
        <div className="h-8 w-1/3 rounded bg-gray-300"></div>
      </div>
    </div>
  );
};

interface LoadingStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = "Loading...",
  description = "Please wait while we fetch the data.",
  className,
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <LoadingSpinner size="lg" className="mb-4" />
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="max-w-md text-center text-gray-600">{description}</p>
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, lines = 1 }) => {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className={cn("h-4 rounded bg-gray-200", className)} />
      ))}
    </div>
  );
};
