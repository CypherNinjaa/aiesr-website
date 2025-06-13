"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "AIESR - Amity Institute of English Studies & Research",
    siteUrl: "https://aiesr-website.vercel.app",
    defaultRegistrationUrl: process.env.NEXT_PUBLIC_REGISTRATION_URL || "",
    emailNotifications: true,
    autoPublishEvents: false,
    allowGuestRegistration: true,
    maintenanceMode: false,
  });

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  const handleSave = () => {
    // In a real implementation, this would save to the database
    console.log("Settings saved:", settings);
    // Using a more accessible notification method would be better in production
    // For now, we'll use a simple log
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
            <p className="mt-2 text-gray-600">Configure system preferences and website settings</p>
          </div>
          <Link href="/admin">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>

        <div className="space-y-8">
          {/* General Settings */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {" "}
              <div>
                <label htmlFor="site-name" className="mb-2 block text-sm font-medium text-gray-700">
                  Site Name
                </label>
                <input
                  id="site-name"
                  type="text"
                  value={settings.siteName}
                  onChange={e => handleSettingChange("siteName", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="site-url" className="mb-2 block text-sm font-medium text-gray-700">
                  Site URL
                </label>
                <input
                  id="site-url"
                  type="url"
                  value={settings.siteUrl}
                  onChange={e => handleSettingChange("siteUrl", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="default-registration-url"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Default Registration URL
                </label>
                <input
                  id="default-registration-url"
                  type="url"
                  value={settings.defaultRegistrationUrl}
                  onChange={e => handleSettingChange("defaultRegistrationUrl", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="https://example.com/register"
                />
                <p className="mt-1 text-xs text-gray-500">
                  This URL is used as a reference. Each event now requires its own registration
                  link.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Event Settings */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Event Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {" "}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Auto-publish Events</h4>
                  <p className="text-sm text-gray-600">Automatically publish events when created</p>
                </div>
                <label
                  htmlFor="auto-publish"
                  className="relative inline-flex cursor-pointer items-center"
                >
                  <input
                    id="auto-publish"
                    type="checkbox"
                    checked={settings.autoPublishEvents}
                    onChange={e => handleSettingChange("autoPublishEvents", e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  <span className="sr-only">Auto-publish Events</span>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Allow Guest Registration</h4>
                  <p className="text-sm text-gray-600">Allow users to register without account</p>
                </div>
                <label
                  htmlFor="guest-registration"
                  className="relative inline-flex cursor-pointer items-center"
                >
                  <input
                    id="guest-registration"
                    type="checkbox"
                    checked={settings.allowGuestRegistration}
                    onChange={e => handleSettingChange("allowGuestRegistration", e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  <span className="sr-only">Allow Guest Registration</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>{" "}
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-600">
                    Send email notifications for new registrations
                  </p>
                </div>
                <label
                  htmlFor="email-notifications"
                  className="relative inline-flex cursor-pointer items-center"
                >
                  <input
                    id="email-notifications"
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={e => handleSettingChange("emailNotifications", e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  <span className="sr-only">Email Notifications</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>System</CardTitle>
            </CardHeader>{" "}
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
                  <p className="text-sm text-gray-600">
                    Temporarily disable the website for maintenance
                  </p>
                </div>
                <label
                  htmlFor="maintenance-mode"
                  className="relative inline-flex cursor-pointer items-center"
                >
                  <input
                    id="maintenance-mode"
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={e => handleSettingChange("maintenanceMode", e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-red-600 peer-focus:ring-4 peer-focus:ring-red-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  <span className="sr-only">Maintenance Mode</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Environment Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Environment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-medium text-gray-900">Database</h4>
                  <p className="text-sm text-gray-600">Supabase PostgreSQL</p>
                  <p className="text-xs text-green-600">✓ Connected</p>
                </div>
                <div>
                  <h4 className="mb-2 font-medium text-gray-900">Storage</h4>
                  <p className="text-sm text-gray-600">Supabase Storage</p>
                  <p className="text-xs text-green-600">✓ Available</p>
                </div>
                <div>
                  <h4 className="mb-2 font-medium text-gray-900">Deployment</h4>
                  <p className="text-sm text-gray-600">Vercel</p>
                  <p className="text-xs text-green-600">✓ Live</p>
                </div>
                <div>
                  <h4 className="mb-2 font-medium text-gray-900">Version</h4>
                  <p className="text-sm text-gray-600">Next.js 15.3.3</p>
                  <p className="text-xs text-blue-600">ⓘ Latest</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} className="px-8">
              Save Settings
            </Button>
          </div>

          {/* Implementation Note */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="rounded-lg bg-amber-50 p-4">
                <h4 className="mb-2 flex items-center gap-2 font-semibold text-amber-900">
                  <span>⚙️</span>
                  Implementation Note
                </h4>
                <p className="text-sm text-amber-700">
                  This settings page is currently a UI demonstration. To make it functional, you
                  would need to:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-amber-700">
                  <li>• Create a settings table in Supabase</li>
                  <li>• Implement save/load functionality</li>
                  <li>• Add validation and error handling</li>
                  <li>• Apply settings throughout the application</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
