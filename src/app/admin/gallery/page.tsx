"use client";

import React from "react";
import { GalleryManagement } from "@/components/admin/gallery/GalleryManagement";

export default function GalleryAdminPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
        <p className="mt-2 text-gray-600">
          Manage homepage gallery slides with images, content, and display settings.
        </p>
      </div>

      <GalleryManagement />
    </div>
  );
}
