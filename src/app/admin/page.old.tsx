import Link from "next/link";
import React from "react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage AIESR events and content</p>
        </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Events Management */}
            <Link href="/admin/events" className="group">
              <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                <div className="mb-4 flex items-center">
                  <div className="rounded-lg bg-blue-100 p-3">
                    <span className="text-2xl">📅</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                      Events Management
                    </h3>
                    <p className="text-gray-500">Create, edit and manage events</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  • Add new events
                  <br />
                  • Edit existing events
                  <br />
                  • Manage event status
                  <br />• Upload event images
                </div>
              </div>
            </Link>

            {/* Categories Management */}
            <Link href="/admin/categories" className="group">
              <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                <div className="mb-4 flex items-center">
                  <div className="rounded-lg bg-purple-100 p-3">
                    <span className="text-2xl">🏷️</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600">
                      Categories
                    </h3>
                    <p className="text-gray-500">Manage event categories</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  • Create categories
                  <br />
                  • Edit category details
                  <br />
                  • Set category colors
                  <br />• Manage category icons
                </div>
              </div>
            </Link>

            {/* Analytics */}
            <Link href="/admin/analytics" className="group">
              <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                <div className="mb-4 flex items-center">
                  <div className="rounded-lg bg-green-100 p-3">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600">
                      Analytics
                    </h3>
                    <p className="text-gray-500">View event statistics</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  • Event views
                  <br />
                  • Registration clicks
                  <br />
                  • Popular events
                  <br />• Monthly reports
                </div>
              </div>
            </Link>

            {/* Quick Actions */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/admin/events/new"
                  className="block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-white transition-colors hover:bg-blue-700"
                >
                  Add New Event
                </Link>
                <Link
                  href="/admin/events?status=draft"
                  className="block w-full rounded-md bg-gray-600 px-4 py-2 text-center text-white transition-colors hover:bg-gray-700"
                >
                  View Draft Events
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  className="block w-full rounded-md bg-green-600 px-4 py-2 text-center text-white transition-colors hover:bg-green-700"
                >
                  View Website
                </Link>
              </div>
            </div>

            {/* Settings */}
            <Link href="/admin/settings" className="group">
              <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                <div className="mb-4 flex items-center">
                  <div className="rounded-lg bg-gray-100 p-3">
                    <span className="text-2xl">⚙️</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-600">
                      Settings
                    </h3>
                    <p className="text-gray-500">System configuration</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  • Registration URL
                  <br />
                  • Email settings
                  <br />
                  • Admin users
                  <br />• System preferences
                </div>
              </div>
            </Link>

            {/* Recent Activity */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• New event created: Literary Festival</div>
                <div>• Event updated: Research Symposium</div>
                <div>• Category created: Academic</div>
                <div>• System backup completed</div>
              </div>
              <Link
                href="/admin/activity"
                className="mt-3 inline-block text-sm text-blue-600 hover:text-blue-800"
              >
                View all activity →
              </Link>
            </div>
          </div>        </div>
      </div>
    </div>
  );
}
