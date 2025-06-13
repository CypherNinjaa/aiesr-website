"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function ActivityPage() {
  const [filter, setFilter] = useState<"all" | "events" | "system" | "users">("all");

  // Mock activity data - in a real implementation, this would come from your database
  const activities = [
    {
      id: 1,
      type: "event",
      action: "created",
      description: "New event created: Literary Festival 2025",
      user: "Admin",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      icon: "📅",
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: 2,
      type: "event",
      action: "updated",
      description: "Event updated: Research Symposium",
      user: "Admin",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      icon: "✏️",
      color: "bg-green-100 text-green-800",
    },
    {
      id: 3,
      type: "event",
      action: "published",
      description: "Event published: Cultural Evening",
      user: "Admin",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      icon: "🚀",
      color: "bg-purple-100 text-purple-800",
    },
    {
      id: 4,
      type: "system",
      action: "backup",
      description: "System backup completed successfully",
      user: "System",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      icon: "💾",
      color: "bg-gray-100 text-gray-800",
    },
    {
      id: 5,
      type: "event",
      action: "created",
      description: "New event created: Workshop on Creative Writing",
      user: "Admin",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      icon: "📅",
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: 6,
      type: "system",
      action: "login",
      description: "Admin user logged in",
      user: "Admin",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      icon: "🔐",
      color: "bg-indigo-100 text-indigo-800",
    },
    {
      id: 7,
      type: "event",
      action: "deleted",
      description: "Event deleted: Outdated Seminar",
      user: "Admin",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      icon: "🗑️",
      color: "bg-red-100 text-red-800",
    },
    {
      id: 8,
      type: "system",
      action: "update",
      description: "System updated to latest version",
      user: "System",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      icon: "🔄",
      color: "bg-orange-100 text-orange-800",
    },
  ];

  const filteredActivities = activities.filter(
    activity => filter === "all" || activity.type === filter
  );

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else {
      return "Less than an hour ago";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
            <p className="mt-2 text-gray-600">View recent system and user activities</p>
          </div>
          <Link href="/admin">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>

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
        </Card>

        {/* Activity List */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Recent Activities ({filteredActivities.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredActivities.length > 0 ? (
                filteredActivities.map(activity => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 rounded-lg border border-gray-100 bg-white p-4 transition-shadow hover:shadow-md"
                  >
                    <div className={`rounded-full p-2 ${activity.color}`}>
                      <span className="text-lg">{activity.icon}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{activity.description}</p>
                        <time className="text-sm text-gray-500">
                          {formatTimeAgo(activity.timestamp)}
                        </time>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                        <span>by {activity.user}</span>
                        <span>•</span>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${activity.color}`}
                        >
                          {activity.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center">
                  <div className="mb-4 text-4xl">📋</div>
                  <p className="text-gray-600">No activities found for the selected filter.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Activity Statistics */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-blue-100 p-3">
                  <span className="text-2xl">📅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Event Activities</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activities.filter(a => a.type === "event").length}
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
                    {activities.filter(a => a.type === "system").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-purple-100 p-3">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Activities</p>
                  <p className="text-2xl font-bold text-gray-900">{activities.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Implementation Note */}
        <Card className="mt-8 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="rounded-lg bg-blue-50 p-4">
              <h4 className="mb-2 flex items-center gap-2 font-semibold text-blue-900">
                <span>📝</span>
                Activity Logging Implementation
              </h4>
              <p className="mb-4 text-sm text-blue-700">
                This activity log currently displays mock data for demonstration. To implement real
                activity logging:
              </p>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• Create an activity_logs table in Supabase</li>
                <li>• Add logging to event creation, updates, and deletions</li>
                <li>• Track user authentication and system events</li>
                <li>• Implement real-time activity updates</li>
                <li>• Add pagination for large activity logs</li>
              </ul>
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
