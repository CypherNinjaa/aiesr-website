"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useAchievements, useDeleteAchievement } from "@/hooks/useAchievements";
import { useCategories } from "@/hooks/useCategories";
import { Achievement } from "@/types";

// Achievement type badges
const typeBadges = {
  award: { label: "Award", class: "bg-yellow-100 text-yellow-800" },
  publication: { label: "Publication", class: "bg-blue-100 text-blue-800" },
  recognition: { label: "Recognition", class: "bg-green-100 text-green-800" },
  milestone: { label: "Milestone", class: "bg-purple-100 text-purple-800" },
  collaboration: { label: "Collaboration", class: "bg-indigo-100 text-indigo-800" },
};

// Status badges
const statusBadges = {
  draft: { label: "Draft", class: "bg-gray-100 text-gray-800" },
  published: { label: "Published", class: "bg-green-100 text-green-800" },
  archived: { label: "Archived", class: "bg-red-100 text-red-800" },
};

interface AchievementRowProps {
  achievement: Achievement;
  onDelete: (id: string) => void;
}

const AchievementRow: React.FC<AchievementRowProps> = ({ achievement, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const typeBadge = typeBadges[achievement.type];
  const statusBadge = statusBadges[achievement.status];
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(achievement.id);
    } catch (_error) {
      setIsDeleting(false);
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      {" "}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="mr-3 text-2xl">{achievement.category?.icon_emoji || "🏆"}</div>
          <div>
            <div className="text-sm font-medium text-gray-900">{achievement.title}</div>
            <div className="text-sm text-gray-500">{achievement.achiever_name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${typeBadge.class}`}
        >
          {typeBadge.label}
        </span>
      </td>
      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 capitalize">
        {achievement.achiever_type}
      </td>
      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
        {new Date(achievement.date_achieved).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusBadge.class}`}
        >
          {statusBadge.label}
        </span>
      </td>
      <td className="px-6 py-4 text-center whitespace-nowrap">
        {achievement.is_featured ? (
          <span className="text-yellow-500">⭐</span>
        ) : (
          <span className="text-gray-300">☆</span>
        )}
      </td>
      <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
        <div className="flex justify-end space-x-2">
          <Link
            href={`/admin/achievements/${achievement.id}`}
            className="text-burgundy hover:text-burgundy/80"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-900 disabled:opacity-50"
          >
            {isDeleting ? "..." : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
};

export const AchievementsList: React.FC = () => {
  const [filters, setFilters] = useState<{
    status: "" | "draft" | "published" | "archived";
    category: string;
    achiever_type: string;
  }>({
    status: "",
    category: "",
    achiever_type: "",
  });

  const {
    data: achievementsData,
    isLoading,
    error,
  } = useAchievements({
    ...(filters.status && { status: filters.status }),
    ...(filters.category && { category_id: filters.category }),
    ...(filters.achiever_type && { achiever_type: filters.achiever_type }),
  });

  const { data: categories } = useCategories();
  const deleteMutation = useDeleteAchievement();

  const achievements = achievementsData?.data || [];
  const totalCount = achievementsData?.count || 0;

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting achievement:", error);
      // Handle error appropriately - could use a toast notification system
    }
  };

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-red-600">⚠️ Error loading achievements</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-burgundy hover:bg-burgundy/90 rounded-lg px-4 py-2 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Achievements Management</h1>
          <p className="text-gray-600">Manage student and faculty achievements</p>
        </div>
        <Link
          href="/admin/achievements/new"
          className="bg-burgundy hover:bg-burgundy/90 rounded-lg px-4 py-2 font-semibold text-white"
        >
          Add New Achievement
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Filters</h3>{" "}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="status-filter" className="mb-1 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={e => handleFilterChange("status", e.target.value)}
              className="focus:border-burgundy focus:ring-burgundy w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="category-filter"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Category
            </label>{" "}
            <select
              id="category-filter"
              value={filters.category}
              onChange={e => handleFilterChange("category", e.target.value)}
              className="focus:border-burgundy focus:ring-burgundy w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">All Categories</option>
              {categories?.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon_emoji} {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="achiever-type-filter"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Achiever Type
            </label>
            <select
              id="achiever-type-filter"
              value={filters.achiever_type}
              onChange={e => handleFilterChange("achiever_type", e.target.value)}
              className="focus:border-burgundy focus:ring-burgundy w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">All Types</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="department">Department</option>
              <option value="institution">Institution</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-white p-4 text-center shadow-md">
          <div className="text-burgundy text-2xl font-bold">{totalCount}</div>
          <div className="text-sm text-gray-600">Total Achievements</div>
        </div>
        <div className="rounded-lg bg-white p-4 text-center shadow-md">
          <div className="text-2xl font-bold text-green-600">
            {achievements.filter(a => a.status === "published").length}
          </div>
          <div className="text-sm text-gray-600">Published</div>
        </div>
        <div className="rounded-lg bg-white p-4 text-center shadow-md">
          <div className="text-2xl font-bold text-yellow-600">
            {achievements.filter(a => a.is_featured).length}
          </div>
          <div className="text-sm text-gray-600">Featured</div>
        </div>
        <div className="rounded-lg bg-white p-4 text-center shadow-md">
          <div className="text-2xl font-bold text-gray-600">
            {achievements.filter(a => a.status === "draft").length}
          </div>
          <div className="text-sm text-gray-600">Drafts</div>
        </div>
      </div>

      {/* Achievements Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="text-gray-600">Loading achievements...</div>
          </div>
        ) : achievements.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mb-4 text-6xl">🏆</div>
            <div className="mb-2 text-xl text-gray-600">No achievements found</div>
            <p className="mb-4 text-gray-500">
              {Object.values(filters).some(f => f)
                ? "Try adjusting your filters or create a new achievement."
                : "Get started by creating your first achievement."}
            </p>
            <Link
              href="/admin/achievements/new"
              className="bg-burgundy hover:bg-burgundy/90 inline-block rounded-lg px-4 py-2 font-semibold text-white"
            >
              Add New Achievement
            </Link>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Achievement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Achiever Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Featured
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {achievements.map(achievement => (
                <AchievementRow
                  key={achievement.id}
                  achievement={achievement}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
