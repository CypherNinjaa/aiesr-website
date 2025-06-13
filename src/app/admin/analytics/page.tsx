"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { AnalyticsService, AnalyticsData } from "@/services/analytics";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const data = await AnalyticsService.getAnalyticsData();
        setAnalytics(data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError(err instanceof Error ? err.message : "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  // Function to refresh analytics data
  const refreshAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AnalyticsService.getAnalyticsData();
      setAnalytics(data);
    } catch (err) {
      console.error("Error refreshing analytics:", err);
      setError(err instanceof Error ? err.message : "Failed to refresh analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <p className="text-gray-600">Loading analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-4 text-6xl text-red-500">⚠️</div>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">Error Loading Analytics</h2>
              <p className="mb-4 text-gray-600">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-4 text-6xl text-gray-400">📊</div>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">No Analytics Data</h2>
              <p className="text-gray-600">Unable to load analytics data.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {" "}
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="mt-2 text-gray-600">View event statistics and performance metrics</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={refreshAnalytics} disabled={loading}>
              {loading ? "Refreshing..." : "🔄 Refresh"}
            </Button>
            <Link href="/admin">
              <Button variant="outline">← Back to Dashboard</Button>
            </Link>
          </div>
        </div>
        {/* Key Metrics */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-blue-100 p-3">
                  <span className="text-2xl">📅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalEvents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-green-100 p-3">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.publishedEvents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-yellow-100 p-3">
                  <span className="text-2xl">📝</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Draft</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.draftEvents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-purple-100 p-3">
                  <span className="text-2xl">🏷️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalCategories}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-orange-100 p-3">
                  <span className="text-2xl">⭐</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Featured</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.featuredEventsCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>{" "}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Events by Category */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Events by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.eventsByCategory.length > 0 ? (
                  analytics.eventsByCategory.slice(0, 5).map((categoryData, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
                    >
                      <div className="flex items-center gap-3">
                        {categoryData.categoryData?.icon_emoji && (
                          <span className="text-lg">{categoryData.categoryData.icon_emoji}</span>
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-900">{categoryData.category}</h4>
                          <p className="text-sm text-gray-600">
                            {categoryData.count} event{categoryData.count !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{categoryData.count}</div>
                        <div className="text-xs text-gray-500">events</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500">No categorized events found</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Events */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.recentEvents.length > 0 ? (
                  analytics.recentEvents.slice(0, 5).map((event, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(event.date).toLocaleDateString()} •
                          <span
                            className={`ml-2 rounded-full px-2 py-1 text-xs font-medium ${
                              event.status === "published"
                                ? "bg-green-100 text-green-800"
                                : event.status === "draft"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : event.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {event.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500">No recent events found</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>{" "}
        {/* Additional Stats */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Monthly Statistics */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.monthlyStats.length > 0 ? (
                  analytics.monthlyStats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="font-medium text-gray-900">{stat.month}</div>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>{stat.events} events</span>
                        <span>{stat.publishedEvents} published</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500">No monthly data available</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Event Status Breakdown */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Event Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.eventsByStatus.length > 0 ? (
                  analytics.eventsByStatus.map((statusData, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="font-medium text-gray-900">{statusData.status}</div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            statusData.status === "Published"
                              ? "bg-green-500"
                              : statusData.status === "Draft"
                                ? "bg-yellow-500"
                                : statusData.status === "Cancelled"
                                  ? "bg-red-500"
                                  : statusData.status === "Completed"
                                    ? "bg-blue-500"
                                    : "bg-gray-500"
                          }`}
                        ></div>
                        <span className="text-sm text-gray-600">{statusData.count}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500">No status data available</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.upcomingEvents.length > 0 ? (
                  analytics.upcomingEvents.slice(0, 5).map((event, index) => (
                    <div key={index} className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                      <div>
                        <h4 className="text-sm font-semibold text-blue-900">{event.title}</h4>
                        <p className="mt-1 text-xs text-blue-700">
                          📅 {new Date(event.date).toLocaleDateString()}
                        </p>
                        <span
                          className={`mt-2 inline-block rounded-full px-2 py-1 text-xs font-medium ${
                            event.status === "published"
                              ? "bg-green-100 text-green-800"
                              : event.status === "draft"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {event.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-blue-500">
                    <div className="mb-2 text-4xl">📅</div>
                    <p className="text-sm">No upcoming events</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Analytics Information */}
        <Card className="mt-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Analytics Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            {" "}
            <div className="rounded-lg bg-green-50 p-4">
              <h4 className="mb-2 flex items-center gap-2 font-semibold text-green-900">
                <span>✅</span>
                Live Data Analytics
              </h4>
              <p className="mb-4 text-sm text-green-700">
                This analytics dashboard displays real-time data from your AIESR events and
                categories database. All statistics are automatically updated and include:
              </p>
              <ul className="space-y-1 text-sm text-green-700">
                <li>
                  • <strong>Event Statistics</strong> - Total, published, draft, and featured events
                </li>
                <li>
                  • <strong>Category Breakdown</strong> - Events distributed across different
                  categories
                </li>
                <li>
                  • <strong>Status Tracking</strong> - Current status of all events in the system
                </li>
                <li>
                  • <strong>Monthly Overview</strong> - Historical data showing event creation
                  trends
                </li>
                <li>
                  • <strong>Recent Activity</strong> - Latest events and their current status
                </li>
              </ul>
              <div className="mt-4 rounded-lg border border-green-200 bg-white p-3">
                <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
                  <div>
                    <div className="text-lg font-bold text-green-800">{analytics.totalEvents}</div>
                    <div className="text-xs text-green-600">Total Events</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-800">
                      {analytics.totalCategories}
                    </div>
                    <div className="text-xs text-green-600">Categories</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-800">
                      {analytics.upcomingEvents.length}
                    </div>
                    <div className="text-xs text-green-600">Upcoming</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-800">
                      {analytics.activeCategories}
                    </div>
                    <div className="text-xs text-green-600">Active Categories</div>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs text-green-600">
                Last updated: {new Date().toLocaleString()} • Click "Refresh" to update data
              </p>
            </div>
          </CardContent>
        </Card>
        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link href="/admin/events">
            <Button className="w-full">Manage Events</Button>
          </Link>
          <Link href="/admin/events?status=published">
            <Button variant="outline" className="w-full">
              View Published Events
            </Button>
          </Link>
          <Link href="/admin/events?status=draft">
            <Button variant="outline" className="w-full">
              View Draft Events
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
