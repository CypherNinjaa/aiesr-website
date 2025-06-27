// ============================================
// GALLERY LIST - Display and manage gallery slides in admin
// ============================================

"use client";

import {
  Edit2,
  Eye,
  EyeOff,
  Trash2,
  GripVertical,
  ExternalLink,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/Button";
import { useNotifications } from "@/contexts/NotificationContext";
import { useDeleteGallerySlide, useToggleSlideStatus, useReorderSlides } from "@/hooks/useGallery";
import type { GallerySlide } from "@/types";

interface GalleryListProps {
  slides: GallerySlide[];
  onEdit: (slide: GallerySlide) => void;
}

export function GalleryList({ slides, onEdit }: GalleryListProps) {
  const { showSuccess, showError, addNotification } = useNotifications();
  const deleteSlide = useDeleteGallerySlide();
  const toggleStatus = useToggleSlideStatus();
  const reorderSlides = useReorderSlides();

  // Sort slides by sort_order for consistent display
  const sortedSlides = [...slides].sort((a, b) => a.sort_order - b.sort_order);

  const handleDelete = (slide: GallerySlide) => {
    addNotification({
      type: "warning",
      title: "Confirm Deletion",
      message: `Are you sure you want to delete "${slide.title}"? This action cannot be undone.`,
      duration: 0,
      actions: [
        {
          label: "Cancel",
          onClick: () => {},
          variant: "secondary",
        },
        {
          label: "Delete",
          onClick: async () => {
            try {
              await deleteSlide.mutateAsync(slide.id);
              showSuccess("Slide Deleted", `"${slide.title}" has been deleted successfully!`);
            } catch (error) {
              showError(
                "Delete Failed",
                error instanceof Error ? error.message : "Failed to delete slide."
              );
            }
          },
          variant: "primary",
        },
      ],
    });
  };

  const handleToggleStatus = async (slide: GallerySlide) => {
    try {
      await toggleStatus.mutateAsync({
        id: slide.id,
        isActive: !slide.is_active,
      });
      showSuccess(
        "Status Updated",
        `Slide "${slide.title}" is now ${!slide.is_active ? "active" : "inactive"}.`
      );
    } catch (error) {
      showError(
        "Update Failed",
        error instanceof Error ? error.message : "Failed to update slide status."
      );
    }
  };

  const handleMoveUp = async (slideIndex: number) => {
    if (slideIndex === 0) return;

    const currentSlide = sortedSlides[slideIndex];
    const previousSlide = sortedSlides[slideIndex - 1];

    try {
      await reorderSlides.mutateAsync([
        { id: currentSlide.id, sort_order: previousSlide.sort_order },
        { id: previousSlide.id, sort_order: currentSlide.sort_order },
      ]);
      showSuccess("Order Updated", `"${currentSlide.title}" moved up.`);
    } catch (error) {
      showError(
        "Reorder Failed",
        error instanceof Error ? error.message : "Failed to reorder slides."
      );
    }
  };

  const handleMoveDown = async (slideIndex: number) => {
    if (slideIndex === sortedSlides.length - 1) return;

    const currentSlide = sortedSlides[slideIndex];
    const nextSlide = sortedSlides[slideIndex + 1];

    try {
      await reorderSlides.mutateAsync([
        { id: currentSlide.id, sort_order: nextSlide.sort_order },
        { id: nextSlide.id, sort_order: currentSlide.sort_order },
      ]);
      showSuccess("Order Updated", `"${currentSlide.title}" moved down.`);
    } catch (error) {
      showError(
        "Reorder Failed",
        error instanceof Error ? error.message : "Failed to reorder slides."
      );
    }
  };

  if (slides.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-6xl">🖼️</div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">No Gallery Slides</h3>
        <p className="mb-6 text-gray-600">
          Get started by creating your first gallery slide for the homepage.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Slide
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Content
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {sortedSlides.map((slide, index) => (
              <tr key={slide.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  <div className="flex items-center">
                    <div className="mr-2 flex flex-col">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0 || reorderSlides.isPending}
                        className="mb-1 h-6 w-6 p-1"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === sortedSlides.length - 1 || reorderSlides.isPending}
                        className="h-6 w-6 p-1"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </div>
                    <GripVertical className="mr-2 h-4 w-4 text-gray-400" />#{slide.sort_order}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-16 w-24 flex-shrink-0">
                      <Image
                        className="h-16 w-24 rounded object-cover"
                        src={slide.image_url}
                        alt={slide.image_alt || slide.title}
                        width={96}
                        height={64}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{slide.title}</div>
                      {slide.subtitle && (
                        <div className="text-sm text-gray-500">{slide.subtitle}</div>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {slide.description ? (
                      <p className="line-clamp-2">{slide.description}</p>
                    ) : (
                      <span className="text-gray-400 italic">No description</span>
                    )}
                  </div>
                  {slide.link_url && (
                    <div className="mt-1 flex items-center text-xs text-blue-600">
                      <ExternalLink className="mr-1 h-3 w-3" />
                      {slide.link_text || "Link"}
                    </div>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      slide.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {slide.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(slide)}
                      disabled={toggleStatus.isPending}
                      className="flex items-center gap-1"
                    >
                      {slide.is_active ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                      {slide.is_active ? "Hide" : "Show"}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(slide)}
                      className="flex items-center gap-1"
                    >
                      <Edit2 className="h-3 w-3" />
                      Edit
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(slide)}
                      disabled={deleteSlide.isPending}
                      className="flex items-center gap-1 text-red-600 hover:border-red-300 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
