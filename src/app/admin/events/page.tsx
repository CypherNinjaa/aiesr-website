"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { RefreshButton } from "@/components/ui/RefreshButton";
import { useNotifications } from "@/contexts/NotificationContext";
import { useEvents, useDeleteEvent } from "@/hooks/useEvents";
import { formatDate } from "@/lib/utils";
import { CategoryService } from "@/services/category";
import { Event, Category } from "@/types";

export default function AdminEventsPage() {
  const { showSuccess, showError, showInfo } = useNotifications();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [categories, setCategories] = useState<Category[]>([]);

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const activeCategories = await CategoryService.getActiveCategories();
        setCategories(activeCategories);
      } catch (error) {
        console.error("Failed to load categories:", error);
        showError("Loading Failed", "Failed to load event categories", 5000);
      }
    };

    loadCategories();
  }, [showError]);

  const {
    data: events,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useEvents({
    ...(statusFilter !== "all" && { status: statusFilter }),
    ...(categoryFilter !== "all" && { category_id: categoryFilter }),
  });

  const deleteEvent = useDeleteEvent();

  const handleRefresh = () => {
    refetch();
    showInfo("Refreshing Data", "Loading latest events...", 2000);
  };

  const handleDelete = async (id: string, title: string) => {
    // eslint-disable-next-line no-alert
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteEvent.mutateAsync(id);
        showSuccess("Event Deleted", `"${title}" has been deleted successfully.`, 3000);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to delete event";
        showError("Delete Failed", errorMessage, 5000);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      published: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
    };

    return (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${colors[status as keyof typeof colors] || colors.draft}`}
      >
        {status}
      </span>
    );
  };
  const getTypeBadge = (event: Event) => {
    // Use category if available, fallback to deprecated type field
    const displayText = event.category?.name || event.type || "Uncategorized";
    const colorClass = event.category?.color_class || "bg-gray-50 text-gray-700";

    return (
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${colorClass}`}>
        {event.category?.icon_emoji && `${event.category.icon_emoji} `}
        {displayText}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <div className="text-red-800">
            <strong>Error loading events:</strong> {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
          <p className="mt-2 text-gray-600">
            Create and manage all events ({events?.length || 0} total)
            {isFetching && <span className="ml-2 text-blue-600">Refreshing...</span>}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <RefreshButton
            onRefresh={handleRefresh}
            isLoading={isLoading}
            isFetching={isFetching}
            variant="outline"
            size="md"
            label="Refresh"
          />
          <Link
            href="/admin/events/new"
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Add New Event
          </Link>
        </div>
      </div>
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label htmlFor="status-filter" className="mb-1 block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option> <option value="published">Published</option>
            <option value="cancelled">Cancelled</option>{" "}
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label htmlFor="category-filter" className="mb-1 block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.icon_emoji} {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Events Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        {" "}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Featured
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {events?.map(event => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {event.image && (
                        <Image
                          className="mr-4 h-10 w-10 rounded-lg object-cover"
                          src={event.image}
                          alt={event.title}
                          width={40}
                          height={40}
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-500">{event.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                    {formatDate(event.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getTypeBadge(event)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(event.status || "draft")}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                    {event.featured ? "⭐" : ""}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/admin/events/${event.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/events/${event.id}`}
                        target="_blank"
                        className="text-green-600 hover:text-green-900"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id, event.title)}
                        className="text-red-600 hover:text-red-900"
                        disabled={deleteEvent.isPending}
                      >
                        Delete{" "}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!events || events.length === 0) && (
          <div className="py-12 text-center">
            <div className="mb-4 text-lg text-gray-500">📅</div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">No events found</h3>
            <p className="mb-4 text-gray-500">
              {statusFilter !== "all" || categoryFilter !== "all"
                ? "Try adjusting your filters or create a new event."
                : "Get started by creating your first event."}
            </p>
            <Link
              href="/admin/events/new"
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add New Event
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
