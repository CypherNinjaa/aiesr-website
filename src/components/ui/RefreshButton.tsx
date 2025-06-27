import React from "react";

interface RefreshButtonProps {
  onRefresh: () => void;
  isLoading?: boolean;
  isFetching?: boolean;
  className?: string;
  label?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  showLabel?: boolean;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  onRefresh,
  isLoading = false,
  isFetching = false,
  className = "",
  label = "Refresh",
  variant = "outline",
  size = "md",
  disabled = false,
  showLabel = true,
}) => {
  const isRefreshing = isLoading || isFetching;

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  };

  const variantClasses = {
    primary: "bg-burgundy text-white hover:bg-burgundy/90 border-burgundy",
    secondary: "bg-gray-500 text-white hover:bg-gray-600 border-gray-500",
    outline: "bg-white text-gray-700 hover:bg-gray-50 border-gray-300",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <button
      onClick={onRefresh}
      disabled={disabled || isRefreshing}
      className={`inline-flex items-center justify-center ${sizeClasses[size]} ${variantClasses[variant]} focus:ring-burgundy rounded-lg border font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className} `}
      title={isRefreshing ? "Refreshing..." : `${label} data`}
    >
      <svg
        className={`${iconSizes[size]} ${isRefreshing ? "animate-spin" : ""} ${showLabel ? "mr-2" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      {showLabel && (
        <span className={isRefreshing ? "opacity-75" : ""}>
          {isRefreshing ? "Refreshing..." : label}
        </span>
      )}
    </button>
  );
};
