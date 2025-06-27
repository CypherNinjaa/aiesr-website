"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/Loading";
import { RefreshButton } from "@/components/ui/RefreshButton";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  useActivityLogs,
  useActivityStats,
  useCleanupLogs,
  formatTimeAgo,
  getActivityDisplay,
  getFilteredActivities,
} from "@/hooks/useActivity";

export default function ActivityPage() {
  const [filter, setFilter] = useState<"all" | "events" | "achievements" | "system" | "users">(
    "all"
  );
  const [limit] = useState(50);
  const { showSuccess, showError, showInfo, addNotification } = useNotifications();

  // Fetch real activity data
  const { data: activityData, isLoading, error, refetch, isFetching } = useActivityLogs({ limit });
  const { data: stats, isLoading: statsLoading } = useActivityStats();
  const cleanupMutation = useCleanupLogs();

  const activities = activityData?.data || [];
  const filteredActivities = getFilteredActivities(activities, filter);

  // Handle refresh
  const handleRefresh = () => {
    refetch();
    showInfo("Refreshing Activity", "Loading latest activity logs...", 2000);
  };

  const handleCleanup = async () => {
    // Use notification system instead of browser confirm
    addNotification({
      type: "warning",
      title: "Confirm Cleanup",
      message:
        "Are you sure you want to delete logs older than 90 days? This action cannot be undone.",
      duration: 0, // Don't auto-dismiss
      actions: [
        {
          label: "Cancel",
          onClick: () => {}, // Just closes the notification
          variant: "secondary",
        },
        {
          label: "Delete Logs",
          onClick: async () => {
            try {
              const deletedCount = await cleanupMutation.mutateAsync(90);
              showSuccess(
                "Cleanup Complete",
                `Successfully deleted ${deletedCount} old activity logs.`
              );
              refetch(); // Refresh the activity logs
            } catch (error) {
              console.error("Cleanup failed:", error);
              showError("Cleanup Failed", "Failed to cleanup old logs. Please try again.");
            }
          },
          variant: "primary",
        },
      ],
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="mb-4 text-4xl">⚠️</div>
                <h3 className="mb-2 text-lg font-semibold text-red-600">
                  Failed to Load Activity Logs
                </h3>
                <p className="mb-4 text-gray-600">
                  {error instanceof Error ? error.message : "An unknown error occurred"}
                </p>
                <div className="space-x-3">
                  <RefreshButton onRefresh={handleRefresh} isLoading={isLoading} />
                  <Button onClick={() => window.location.reload()}>Reload Page</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
            <p className="mt-2 text-gray-600">View recent system and user activities</p>
          </div>
          <div className="flex items-center space-x-3">
            <RefreshButton
              onRefresh={handleRefresh}
              isLoading={isLoading}
              isFetching={isFetching}
              variant="outline"
              label="Refresh Logs"
            />
            <Link href="/admin">
              <Button variant="outline">← Back to Dashboard</Button>
            </Link>
          </div>
        </div>{" "}
        {/* Filters */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                size="sm"
              >
                All Activities
              </Button>
              <Button
                variant={filter === "events" ? "default" : "outline"}
                onClick={() => setFilter("events")}
                size="sm"
              >
                Event Activities
              </Button>
              <Button
                variant={filter === "achievements" ? "default" : "outline"}
                onClick={() => setFilter("achievements")}
                size="sm"
              >
                Achievement Activities
              </Button>
              <Button
                variant={filter === "system" ? "default" : "outline"}
                onClick={() => setFilter("system")}
                size="sm"
              >
                System Activities
              </Button>
              <Button
                variant={filter === "users" ? "default" : "outline"}
                onClick={() => setFilter("users")}
                size="sm"
              >
                User Activities
              </Button>
            </div>
          </CardContent>
        </Card>{" "}
        {/* Activity List */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Recent Activities ({filteredActivities.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredActivities.length > 0 ? (
                filteredActivities.map(activity => {
                  const { icon, color, category } = getActivityDisplay(activity);
                  const displayName =
                    activity.admin_users?.name || activity.admin_users?.email || "System";

                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 rounded-lg border border-gray-100 bg-white p-4 transition-shadow hover:shadow-md"
                    >
                      <div className={`rounded-full p-2 ${color}`}>
                        <span className="text-lg">{icon}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          {" "}
                          <p className="font-medium text-gray-900">
                            {activity.action}{" "}
                            {activity.resource_type && `${activity.resource_type}`}
                            {activity.details &&
                              typeof activity.details === "object" &&
                              "title" in activity.details &&
                              `: ${String(activity.details.title)}`}
                          </p>
                          <time className="text-sm text-gray-500">
                            {formatTimeAgo(activity.created_at)}
                          </time>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                          <span>by {displayName}</span>
                          <span>•</span>
                          <span className={`rounded-full px-2 py-1 text-xs font-medium ${color}`}>
                            {category}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center">
                  <div className="mb-4 text-4xl">📋</div>
                  <p className="text-gray-600">No activities found for the selected filter.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>{" "}
        {/* Activity Statistics */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-blue-100 p-3">
                  <span className="text-2xl">📅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Event Activities</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : stats?.eventActivities || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-green-100 p-3">
                  <span className="text-2xl">⚙️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">System Activities</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : stats?.systemActivities || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-purple-100 p-3">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">User Activities</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : stats?.userActivities || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-orange-100 p-3">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Activities</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : stats?.totalActivities || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>{" "}
        {/* Admin Actions */}
        <Card className="mt-8 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="rounded-lg bg-blue-50 p-4">
              <h4 className="mb-2 flex items-center gap-2 font-semibold text-blue-900">
                <span>⚡</span>
                Activity Management
              </h4>
              <p className="mb-4 text-sm text-blue-700">
                Manage system activity logs and maintenance tasks.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" onClick={() => refetch()} disabled={isLoading} size="sm">
                  {isLoading ? "Refreshing..." : "Refresh Activities"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCleanup}
                  disabled={cleanupMutation.isPending}
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  {cleanupMutation.isPending ? "Cleaning..." : "Cleanup Old Logs (90+ days)"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link href="/admin/events">
            <Button className="w-full">Manage Events</Button>
          </Link>
          <Link href="/admin/settings">
            <Button variant="outline" className="w-full">
              System Settings
            </Button>
          </Link>
          <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
            Refresh Activity Log
          </Button>
        </div>
      </div>
    </div>
  );
}
