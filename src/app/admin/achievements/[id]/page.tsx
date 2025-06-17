"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { AchievementForm } from "@/components/admin/achievements/AchievementForm";
import { useAchievement } from "@/hooks/useAchievements";

export default function EditAchievementPage() {
  const params = useParams();
  const achievementId = params.id as string;

  const { data: achievement, isLoading, error } = useAchievement(achievementId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <div className="text-gray-600">Loading achievement...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !achievement) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {" "}
          <div className="py-12 text-center">
            <div className="mb-4 text-red-600">⚠️ Achievement not found</div>
            <Link href="/admin/achievements" className="text-burgundy hover:text-burgundy/80">
              ← Back to Achievements
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Achievement</h1>
          <p className="mt-2 text-gray-600">Update achievement details</p>
        </div>{" "}
        <AchievementForm
          initialData={{
            title: achievement.title,
            description: achievement.description,
            category_id: achievement.category_id,
            type: achievement.type,
            achiever_name: achievement.achiever_name,
            achiever_type: achievement.achiever_type,
            date_achieved: achievement.date_achieved.toISOString().split("T")[0],
            image_url: achievement.image_url,
            details: achievement.details,
            is_featured: achievement.is_featured,
            sort_order: achievement.sort_order,
            status: achievement.status,
          }}
          achievementId={achievementId}
          isEdit={true}
        />
      </div>
    </div>
  );
}
