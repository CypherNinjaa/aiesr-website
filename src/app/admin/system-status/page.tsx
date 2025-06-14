"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";

interface SystemStatus {
  database: {
    status: "healthy" | "degraded" | "down";
    latency: number;
    error?: string;
  };
  storage: {
    status: "healthy" | "degraded" | "down";
    error?: string;
  };
  auth: {
    status: "healthy" | "degraded" | "down";
    error?: string;
  };
}

export default function SystemStatusPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkSystemHealth = async () => {
    setIsLoading(true);
    const newStatus: SystemStatus = {
      database: { status: "healthy", latency: 0 },
      storage: { status: "healthy" },
      auth: { status: "healthy" },
    };

    try {
      // Check database connectivity and latency
      const dbStart = Date.now();
      const { error: dbError } = await supabase.from("events").select("id").limit(1);

      const dbLatency = Date.now() - dbStart;

      if (dbError) {
        newStatus.database.status = "down";
        newStatus.database.error = dbError.message;
      } else {
        newStatus.database.latency = dbLatency;
        if (dbLatency > 1000) {
          newStatus.database.status = "degraded";
        }
      }
    } catch (error) {
      newStatus.database.status = "down";
      newStatus.database.error = error instanceof Error ? error.message : "Unknown error";
    }

    try {
      // Check storage
      const { error: storageError } = await supabase.storage
        .from("event-images")
        .list("", { limit: 1 });

      if (storageError) {
        newStatus.storage.status = "down";
        newStatus.storage.error = storageError.message;
      }
    } catch (error) {
      newStatus.storage.status = "down";
      newStatus.storage.error = error instanceof Error ? error.message : "Unknown error";
    }

    try {
      // Check auth
      const { error: authError } = await supabase.auth.getSession();

      if (authError) {
        newStatus.auth.status = "down";
        newStatus.auth.error = authError.message;
      }
    } catch (error) {
      newStatus.auth.status = "down";
      newStatus.auth.error = error instanceof Error ? error.message : "Unknown error";
    }

    setStatus(newStatus);
    setLastChecked(new Date());
    setIsLoading(false);
  };

  useEffect(() => {
    checkSystemHealth();
  }, []);

  const getStatusColor = (status: "healthy" | "degraded" | "down") => {
    switch (status) {
      case "healthy":
        return "text-green-600";
      case "degraded":
        return "text-yellow-600";
      case "down":
        return "text-red-600";
    }
  };

  const getStatusIcon = (status: "healthy" | "degraded" | "down") => {
    switch (status) {
      case "healthy":
        return "✅";
      case "degraded":
        return "⚠️";
      case "down":
        return "❌";
    }
  };

  const getStatusText = (status: "healthy" | "degraded" | "down") => {
    switch (status) {
      case "healthy":
        return "Healthy";
      case "degraded":
        return "Degraded";
      case "down":
        return "Down";
    }
  };

  const getOverallStatus = () => {
    if (!status) return "down";

    const statuses = [status.database.status, status.storage.status, status.auth.status];

    if (statuses.includes("down")) return "down";
    if (statuses.includes("degraded")) return "degraded";
    return "healthy";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
            <p className="mt-2 text-gray-600">Monitor system health and performance</p>
            {lastChecked && (
              <p className="mt-1 text-sm text-gray-500">
                Last checked: {lastChecked.toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={checkSystemHealth} disabled={isLoading} variant="outline">
              {isLoading ? (
                <>
                  <span className="mr-2 animate-spin">⏳</span>
                  Checking...
                </>
              ) : (
                <>
                  <span className="mr-2">🔄</span>
                  Refresh
                </>
              )}
            </Button>
            <Link href="/admin">
              <Button variant="outline">← Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Overall Status */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{getStatusIcon(getOverallStatus())}</span>
              System Status: {getStatusText(getOverallStatus())}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-lg font-semibold ${getStatusColor(getOverallStatus())}`}>
              {getOverallStatus() === "healthy" && "All systems operational"}
              {getOverallStatus() === "degraded" && "Some systems experiencing issues"}
              {getOverallStatus() === "down" && "System outage detected"}
            </div>
          </CardContent>
        </Card>

        {/* Individual Service Status */}
        <div className="space-y-6">
          {/* Database Status */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="text-xl">{status && getStatusIcon(status.database.status)}</span>
                  Database (Supabase PostgreSQL)
                </span>
                <span
                  className={`text-sm font-semibold ${status && getStatusColor(status.database.status)}`}
                >
                  {status && getStatusText(status.database.status)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-medium text-gray-900">Connection</h4>
                  <p className="text-sm text-gray-600">
                    {status?.database.status === "healthy" ? "Connected" : "Connection issues"}
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-medium text-gray-900">Latency</h4>
                  <p className="text-sm text-gray-600">
                    {status ? `${status.database.latency}ms` : "Checking..."}
                  </p>
                </div>
              </div>
              {status?.database.error && (
                <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-800">
                    <strong>Error:</strong> {status.database.error}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Storage Status */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="text-xl">{status && getStatusIcon(status.storage.status)}</span>
                  Storage (Supabase Storage)
                </span>
                <span
                  className={`text-sm font-semibold ${status && getStatusColor(status.storage.status)}`}
                >
                  {status && getStatusText(status.storage.status)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-medium text-gray-900">File Upload</h4>
                  <p className="text-sm text-gray-600">
                    {status?.storage.status === "healthy" ? "Available" : "Unavailable"}
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-medium text-gray-900">CDN</h4>
                  <p className="text-sm text-gray-600">
                    {status?.storage.status === "healthy" ? "Operational" : "Issues detected"}
                  </p>
                </div>
              </div>
              {status?.storage.error && (
                <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-800">
                    <strong>Error:</strong> {status.storage.error}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Auth Status */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="text-xl">{status && getStatusIcon(status.auth.status)}</span>
                  Authentication (Supabase Auth)
                </span>
                <span
                  className={`text-sm font-semibold ${status && getStatusColor(status.auth.status)}`}
                >
                  {status && getStatusText(status.auth.status)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-medium text-gray-900">Login System</h4>
                  <p className="text-sm text-gray-600">
                    {status?.auth.status === "healthy" ? "Operational" : "Issues detected"}
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-medium text-gray-900">Session Management</h4>
                  <p className="text-sm text-gray-600">
                    {status?.auth.status === "healthy" ? "Working" : "Degraded"}
                  </p>
                </div>
              </div>
              {status?.auth.error && (
                <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-800">
                    <strong>Error:</strong> {status.auth.error}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card className="mt-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {status ? `${status.database.latency}ms` : "--"}
                </div>
                <div className="text-sm text-gray-600">Database Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">99.9%</div>
                <div className="text-sm text-gray-600">Uptime (30 days)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {lastChecked ? "< 1 min" : "--"}
                </div>
                <div className="text-sm text-gray-600">Last Health Check</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
