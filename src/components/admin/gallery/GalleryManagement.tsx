// ============================================
// GALLERY MANAGEMENT - Main Admin Interface for Gallery Slides
// Complete CRUD interface for managing homepage gallery slides
// ============================================

"use client";

import { Loader2, Plus } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { RefreshButton } from "@/components/ui/RefreshButton";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAllGallerySlides } from "@/hooks/useGallery";
import type { GallerySlide } from "@/types";
import { GalleryForm } from "./GalleryForm";
import { GalleryList } from "./GalleryList";

type ViewMode = "list" | "create" | "edit";

export function GalleryManagement() {
  const { showInfo } = useNotifications();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingSlide, setEditingSlide] = useState<GallerySlide | null>(null);

  const { data: slides, isLoading, error, refetch, isFetching } = useAllGallerySlides();

  const handleRefresh = () => {
    refetch();
    showInfo("Refreshing Data", "Loading latest gallery slides...", 2000);
  };

  const handleCreateNew = () => {
    setEditingSlide(null);
    setViewMode("create");
  };

  const handleEdit = (slide: GallerySlide) => {
    setEditingSlide(slide);
    setViewMode("edit");
  };

  const handleBackToList = () => {
    setEditingSlide(null);
    setViewMode("list");
  };

  const handleFormSuccess = () => {
    setEditingSlide(null);
    setViewMode("list");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-burgundy h-8 w-8 animate-spin" />
        <span className="ml-3 text-gray-600">Loading gallery slides...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="mb-4 text-red-600">Error loading gallery slides</p>
        <RefreshButton
          onRefresh={handleRefresh}
          isLoading={isLoading}
          isFetching={isFetching}
          variant="primary"
          label="Try Again"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {viewMode !== "list" && (
            <Button variant="outline" onClick={handleBackToList}>
              ← Back to List
            </Button>
          )}
          <div className="text-sm text-gray-500">
            {slides ? `${slides.length} total slides` : ""}
            {isFetching && <span className="ml-2 text-blue-600">Refreshing...</span>}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {viewMode === "list" && (
            <>
              <RefreshButton
                onRefresh={handleRefresh}
                isLoading={isLoading}
                isFetching={isFetching}
                variant="outline"
                size="md"
                label="Refresh"
              />
              <Button onClick={handleCreateNew} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Slide
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="rounded-lg border bg-white">
        {viewMode === "list" && <GalleryList slides={slides || []} onEdit={handleEdit} />}

        {(viewMode === "create" || viewMode === "edit") && (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {viewMode === "create" ? "Create New Gallery Slide" : "Edit Gallery Slide"}
              </h2>
              <p className="mt-1 text-gray-600">
                {viewMode === "create"
                  ? "Add a new slide to the homepage gallery."
                  : "Modify the slide content and settings."}
              </p>
            </div>

            <GalleryForm
              slide={editingSlide}
              onSuccess={handleFormSuccess}
              onCancel={handleBackToList}
            />
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {viewMode === "list" && slides && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-white p-4">
            <div className="text-burgundy text-2xl font-bold">{slides.length}</div>
            <div className="text-sm text-gray-600">Total Slides</div>
          </div>

          <div className="rounded-lg border bg-white p-4">
            <div className="text-2xl font-bold text-green-600">
              {slides.filter(s => s.is_active).length}
            </div>
            <div className="text-sm text-gray-600">Active Slides</div>
          </div>

          <div className="rounded-lg border bg-white p-4">
            <div className="text-2xl font-bold text-blue-600">
              {slides.filter(s => s.link_url).length}
            </div>
            <div className="text-sm text-gray-600">With Links</div>
          </div>

          <div className="rounded-lg border bg-white p-4">
            <div className="text-2xl font-bold text-gray-600">
              {slides.filter(s => !s.is_active).length}
            </div>
            <div className="text-sm text-gray-600">Inactive Slides</div>
          </div>
        </div>
      )}
    </div>
  );
}
