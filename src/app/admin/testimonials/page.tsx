"use client";

import React from "react";
import { TestimonialsManagement } from "@/components/admin/testimonials/TestimonialsManagement";

export default function TestimonialsAdminPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Testimonials Management</h1>
        <p className="mt-2 text-gray-600">Review, approve, and manage student success stories</p>
      </div>

      <TestimonialsManagement />
    </div>
  );
}
