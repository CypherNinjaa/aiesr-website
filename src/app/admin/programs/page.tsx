// ============================================
// ADMIN PROGRAMS PAGE - Programs Management Interface
// Admin can view, create, edit, delete and control programs
// ============================================

"use client";

import React from "react";
import { AdminProtectedRoute } from "@/components/admin/AdminProtectedRoute";
import { ProgramsManagement } from "@/components/admin/programs";

export default function AdminProgramsPage() {
  return (
    <AdminProtectedRoute>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Programs Management</h1>
          <p className="mt-2 text-gray-600">
            Manage academic programs, create new offerings, and control what's displayed on the
            website.
          </p>
        </div>

        {/* Programs Management Component */}
        <ProgramsManagement />
      </div>
    </AdminProtectedRoute>
  );
}
