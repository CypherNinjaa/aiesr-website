"use client";

import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function AnalyticsPage() {
  // Mock analytics data - in a real implementation, this would come from your analytics service
  const analytics = {
    totalEvents: 14,
    publishedEvents: 10,
    draftEvents: 4,
    totalViews: 1250,
    registrations: 89,
    popularEvents: [
      { name: "Literary Festival 2025", views: 245, registrations: 32 },
      { name: "Research Symposium", views: 198, registrations: 28 },
      { name: "Cultural Evening", views: 156, registrations: 19 },
    ],
    monthlyStats: [
      { month: "Jan", events: 2, views: 420 },
      { month: "Feb", events: 3, views: 580 },
      { month: "Mar", events: 4, views: 720 },
      { month: "Apr", events: 3, views: 650 },
      { month: "May", events: 2, views: 480 },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="mt-2 text-gray-600">View event statistics and performance metrics</p>
          </div>
          <Link href="/admin">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>

        {/* Key Metrics */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                  <span className="text-2xl">👁️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.totalViews.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-purple-100 p-3">
                  <span className="text-2xl">📝</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Registrations</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.registrations}</p>
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
                  <p className="text-sm text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.publishedEvents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Popular Events */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Popular Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.popularEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
                  >
                    <div>
                      <h4 className="font-semibold text-gray-900">{event.name}</h4>
                      <p className="text-sm text-gray-600">
                        {event.views} views • {event.registrations} registrations
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{event.views}</div>
                      <div className="text-xs text-gray-500">views</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Statistics */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.monthlyStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">{stat.month} 2025</div>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>{stat.events} events</span>
                      <span>{stat.views} views</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Notice */}
        <Card className="mt-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Analytics Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-blue-50 p-4">
              <h4 className="mb-2 flex items-center gap-2 font-semibold text-blue-900">
                <span>📊</span>
                Current Status
              </h4>
              <p className="mb-4 text-sm text-blue-700">
                This analytics dashboard currently displays mock data for demonstration purposes. To
                implement real analytics, you would need to integrate with services like:
              </p>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>
                  • <strong>Google Analytics</strong> - for website traffic and user behavior
                </li>
                <li>
                  • <strong>Event Registration System</strong> - for registration tracking
                </li>
                <li>
                  • <strong>Database Queries</strong> - for event statistics
                </li>
                <li>
                  • <strong>Supabase Analytics</strong> - for database usage metrics
                </li>
              </ul>
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
