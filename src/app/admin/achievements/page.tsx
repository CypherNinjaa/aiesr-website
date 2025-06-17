import React from "react";
import { AchievementsList } from "@/components/admin/achievements/AchievementsList";

export default function AchievementsAdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AchievementsList />
      </div>
    </div>
  );
}
