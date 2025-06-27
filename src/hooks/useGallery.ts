// ============================================
// GALLERY HOOKS - React Query hooks for gallery slider management
// ============================================

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GalleryService } from "@/services/gallery";
import type { CreateGallerySlideData, UpdateGallerySlideData } from "@/types";

// Query keys for cache management
export const galleryKeys = {
  all: ["gallery"] as const,
  active: () => [...galleryKeys.all, "active"] as const,
  admin: () => [...galleryKeys.all, "admin"] as const,
  slide: (id: string) => [...galleryKeys.all, "slide", id] as const,
};

// Hook to get active gallery slides for public display
export function useActiveGallerySlides() {
  return useQuery({
    queryKey: galleryKeys.active(),
    queryFn: GalleryService.getActiveSlides,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Hook to get all gallery slides for admin
export function useAllGallerySlides() {
  return useQuery({
    queryKey: galleryKeys.admin(),
    queryFn: GalleryService.getAllSlides,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook to get a single gallery slide
export function useGallerySlide(id: string) {
  return useQuery({
    queryKey: galleryKeys.slide(id),
    queryFn: () => GalleryService.getSlideById(id),
    enabled: !!id,
  });
}

// Hook to create a gallery slide
export function useCreateGallerySlide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slideData: CreateGallerySlideData) => GalleryService.createSlide(slideData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
    },
  });
}

// Hook to update a gallery slide
export function useUpdateGallerySlide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGallerySlideData }) =>
      GalleryService.updateSlide(id, data),
    onSuccess: updatedSlide => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
      queryClient.setQueryData(galleryKeys.slide(updatedSlide.id), updatedSlide);
    },
  });
}

// Hook to delete a gallery slide
export function useDeleteGallerySlide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => GalleryService.deleteSlide(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
    },
  });
}

// Hook to toggle slide status
export function useToggleSlideStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      GalleryService.toggleSlideStatus(id, isActive),
    onSuccess: updatedSlide => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
      queryClient.setQueryData(galleryKeys.slide(updatedSlide.id), updatedSlide);
    },
  });
}

// Hook to reorder slides
export function useReorderSlides() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slideOrders: { id: string; sort_order: number }[]) =>
      GalleryService.reorderSlides(slideOrders),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
    },
  });
}

// Hook to upload image
export function useUploadGalleryImage() {
  return useMutation({
    mutationFn: ({ file, fileName }: { file: File; fileName?: string }) =>
      GalleryService.uploadImage(file, fileName),
  });
}

// Hook to delete image
export function useDeleteGalleryImage() {
  return useMutation({
    mutationFn: (imageUrl: string) => GalleryService.deleteImage(imageUrl),
  });
}

// Hook to get storage statistics
export function useGalleryStorageStats() {
  return useQuery({
    queryKey: [...galleryKeys.all, "storage-stats"],
    queryFn: GalleryService.getStorageStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
