import React from "react";
import { AchievementForm } from "@/components/admin/achievements/AchievementForm";

export default function NewAchievementPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Achievement</h1>
          <p className="mt-2 text-gray-600">Create a new achievement record</p>
        </div>
        <AchievementForm />
      </div>
    </div>
  );
}
