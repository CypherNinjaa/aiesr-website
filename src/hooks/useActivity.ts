import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { activityService } from "@/services/activity";
import type { ActivityLogFilters, ActivityLog } from "@/services/activity";

// Hook to get activity logs
export function useActivityLogs(filters: ActivityLogFilters = {}) {
  return useQuery({
    queryKey: ["activity-logs", filters],
    queryFn: () => activityService.getActivityLogs(filters),
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute for real-time updates
  });
}

// Hook to get activity statistics
export function useActivityStats() {
  return useQuery({
    queryKey: ["activity-stats"],
    queryFn: () => activityService.getActivityStats(),
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}

// Hook to get activities by type
export function useActivitiesByType(resourceType: string, limit = 10) {
  return useQuery({
    queryKey: ["activities-by-type", resourceType, limit],
    queryFn: () => activityService.getActivitiesByType(resourceType, limit),
    staleTime: 30000,
    enabled: !!resourceType,
  });
}

// Hook to log activity
export function useLogActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      action,
      resourceType,
      resourceId,
      details,
    }: {
      action: string;
      resourceType?: string;
      resourceId?: string;
      details?: Record<string, unknown>;
    }) => activityService.logActivity(action, resourceType, resourceId, details),
    onSuccess: () => {
      // Invalidate and refetch activity logs
      queryClient.invalidateQueries({ queryKey: ["activity-logs"] });
      queryClient.invalidateQueries({ queryKey: ["activity-stats"] });
    },
  });
}

// Hook to cleanup old logs
export function useCleanupLogs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (olderThanDays: number) => activityService.cleanupOldLogs(olderThanDays),
    onSuccess: () => {
      // Invalidate and refetch activity logs
      queryClient.invalidateQueries({ queryKey: ["activity-logs"] });
      queryClient.invalidateQueries({ queryKey: ["activity-stats"] });
    },
  });
}

// Hook for real-time activity logs with subscription
export const useActivityLogsRealtime = (filters: ActivityLogFilters = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["activity", "logs", filters],
    queryFn: () => activityService.getActivityLogs(filters),
    staleTime: 30 * 1000, // 30 seconds (shorter for real-time feel)
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("admin-activity-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "admin_activity_logs",
        },
        () => {
          // Invalidate and refetch activity logs when changes occur
          queryClient.invalidateQueries({ queryKey: ["activity"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
};

// Hook for activity logs with infinite scroll
export const useActivityLogsInfinite = (
  filters: Omit<ActivityLogFilters, "limit" | "offset"> = {}
) => {
  return useInfiniteQuery({
    queryKey: ["activity", "logs", "infinite", filters],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const result = await activityService.getActivityLogs({
        ...filters,
        limit: 20, // Items per page
        offset: pageParam * 20,
      });
      return {
        ...result,
        nextPage: result.data.length === 20 ? pageParam + 1 : undefined,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: { nextPage?: number }) => lastPage.nextPage,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Utility function to format time ago
export function formatTimeAgo(date: string | Date): string {
  const now = new Date();
  const activityDate = new Date(date);
  const diffMs = now.getTime() - activityDate.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
}

// Utility function to get activity icon and color based on action
export function getActivityDisplay(activity: ActivityLog): {
  icon: string;
  color: string;
  category: string;
} {
  const { action, resource_type } = activity;

  // Event-related activities
  if (resource_type === "event") {
    switch (action) {
      case "create":
      case "created":
        return { icon: "📅", color: "bg-blue-100 text-blue-800", category: "event" };
      case "update":
      case "updated":
        return { icon: "✏️", color: "bg-green-100 text-green-800", category: "event" };
      case "publish":
      case "published":
        return { icon: "🚀", color: "bg-purple-100 text-purple-800", category: "event" };
      case "delete":
      case "deleted":
        return { icon: "🗑️", color: "bg-red-100 text-red-800", category: "event" };
      default:
        return { icon: "📅", color: "bg-blue-100 text-blue-800", category: "event" };
    }
  }

  // Achievement-related activities
  if (resource_type === "achievement") {
    switch (action) {
      case "create":
      case "created":
        return { icon: "🏆", color: "bg-emerald-100 text-emerald-800", category: "achievement" };
      case "update":
      case "updated":
        return { icon: "✨", color: "bg-amber-100 text-amber-800", category: "achievement" };
      case "publish":
      case "published":
        return { icon: "🌟", color: "bg-yellow-100 text-yellow-800", category: "achievement" };
      case "delete":
      case "deleted":
        return { icon: "💔", color: "bg-red-100 text-red-800", category: "achievement" };
      default:
        return { icon: "🏆", color: "bg-emerald-100 text-emerald-800", category: "achievement" };
    }
  }

  // Settings-related activities
  if (resource_type === "setting") {
    return { icon: "⚙️", color: "bg-orange-100 text-orange-800", category: "system" };
  }

  // Category-related activities
  if (resource_type === "category") {
    return { icon: "🏷️", color: "bg-yellow-100 text-yellow-800", category: "system" };
  }

  // Authentication activities
  if (["login", "logout", "admin_login"].includes(action)) {
    return { icon: "🔐", color: "bg-indigo-100 text-indigo-800", category: "user" };
  }

  // System activities
  if (["backup", "update", "system_action"].includes(action)) {
    return { icon: "💾", color: "bg-gray-100 text-gray-800", category: "system" };
  }

  // Default
  return { icon: "📝", color: "bg-gray-100 text-gray-800", category: "system" };
}

// Helper to filter activities by category
export function getFilteredActivities(
  activities: ActivityLog[],
  filter: "all" | "events" | "achievements" | "system" | "users"
): ActivityLog[] {
  if (filter === "all") return activities;

  return activities.filter(activity => {
    const { category } = getActivityDisplay(activity);

    switch (filter) {
      case "events":
        return category === "event";
      case "achievements":
        return category === "achievement";
      case "system":
        return category === "system";
      case "users":
        return category === "user";
      default:
        return true;
    }
  });
}
