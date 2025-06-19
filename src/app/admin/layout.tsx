"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { useAdminAuth, useAdminSignOut } from "@/hooks/useAdminAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { adminUser, isLoading } = useAdminAuth();
  const signOut = useAdminSignOut();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!adminUser) {
    return <AdminLoginForm />;
  }
  const navigation = [
    { name: "Dashboard", href: "/admin", icon: "🏠" },
    { name: "Events", href: "/admin/events", icon: "📅" },
    { name: "Achievements", href: "/admin/achievements", icon: "🏆" },
    { name: "Testimonials", href: "/admin/testimonials", icon: "💬" },
    { name: "Categories", href: "/admin/categories", icon: "🏷️" },
    { name: "Analytics", href: "/admin/analytics", icon: "📊" },
    { name: "Activity", href: "/admin/activity", icon: "📋" },
    { name: "Settings", href: "/admin/settings", icon: "⚙️" },
    { name: "System Status", href: "/admin/system-status", icon: "🔧" },
  ];

  const handleSignOut = () => {
    signOut.mutate();
  };
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5">
          <div className="flex flex-shrink-0 items-center px-4">
            <Link href="/admin" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">AIESR</span>
              <span className="ml-2 text-sm text-gray-500">Admin</span>
            </Link>
          </div>
          <div className="mt-8 flex flex-grow flex-col">
            <nav className="flex-1 space-y-1 px-2">
              {navigation.map(item => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>{" "}
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex w-full flex-col space-y-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <span className="font-semibold text-blue-600">
                      {adminUser?.admin?.name?.charAt(0) || "A"}
                    </span>
                  </div>
                </div>{" "}
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    {adminUser?.admin?.name || "Admin User"}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {adminUser?.admin?.role || "admin"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center justify-center rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 hover:text-red-800 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
                disabled={signOut.isPending}
              >
                {signOut.isPending ? (
                  <>
                    <span className="mr-2">⏳</span>
                    Signing out...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🚪</span>
                    Logout
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Mobile menu button - you can expand this later */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button className="rounded-md bg-white p-2 shadow-md">☰</button>
      </div>
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden md:ml-64">
        <main className="relative flex-1 overflow-x-auto overflow-y-auto p-4 focus:outline-none md:p-6">
          <div className="w-full min-w-0">{children}</div>
        </main>
      </div>
    </div>
  );
}
