// ============================================
// FACULTY HOOKS - React Query Hooks for Faculty
// Client-side state management for faculty
// ============================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  getActiveFaculty,
  getFeaturedFaculty,
  getFacultyById,
  getAllFacultyAdmin,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  toggleFacultyStatus,
  toggleFacultyFeatured,
  updateFacultySortOrder,
  bulkUpdateFacultySortOrders,
  uploadFacultyPhoto,
  deleteFacultyPhoto,
} from "@/services/faculty";
import { UpdateFacultyData } from "@/types";

// ============================================
// QUERY KEYS
// ============================================

export const FACULTY_QUERY_KEYS = {
  all: ["faculty"] as const,
  active: ["faculty", "active"] as const,
  featured: ["faculty", "featured"] as const,
  admin: ["faculty", "admin"] as const,
  byId: (id: string) => ["faculty", "id", id] as const,
};

// ============================================
// PUBLIC HOOKS
// ============================================

/**
 * Hook to get all active faculty for public display
 */
export function useActiveFaculty() {
  return useQuery({
    queryKey: FACULTY_QUERY_KEYS.active,
    queryFn: getActiveFaculty,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to get featured faculty for homepage
 */
export function useFeaturedFaculty() {
  return useQuery({
    queryKey: FACULTY_QUERY_KEYS.featured,
    queryFn: getFeaturedFaculty,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to get a single faculty member by ID
 */
export function useFacultyById(id: string) {
  return useQuery({
    queryKey: FACULTY_QUERY_KEYS.byId(id),
    queryFn: () => getFacultyById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

// ============================================
// ADMIN HOOKS
// ============================================

/**
 * Hook to get all faculty for admin management
 */
export function useAllFacultyAdmin() {
  return useQuery({
    queryKey: FACULTY_QUERY_KEYS.admin,
    queryFn: getAllFacultyAdmin,
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter for admin)
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// ============================================
// MUTATION HOOKS
// ============================================

/**
 * Hook to create new faculty member
 */
export function useCreateFaculty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFaculty,
    onSuccess: newFaculty => {
      // Invalidate and refetch faculty queries
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.admin });
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.active });
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.featured });

      toast.success(`Faculty member "${newFaculty.name}" created successfully!`);
    },
    onError: (error: Error) => {
      console.error("Error creating faculty:", error);
      toast.error(error.message || "Failed to create faculty member");
    },
  });
}

/**
 * Hook to update existing faculty member
 */
export function useUpdateFaculty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFacultyData }) => updateFaculty(id, data),
    onSuccess: updatedFaculty => {
      // Invalidate and refetch faculty queries
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.admin });
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.active });
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.featured });
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.byId(updatedFaculty.id) });

      toast.success(`Faculty member "${updatedFaculty.name}" updated successfully!`);
    },
    onError: (error: Error) => {
      console.error("Error updating faculty:", error);
      toast.error(error.message || "Failed to update faculty member");
    },
  });
}

/**
 * Hook to delete faculty member
 */
export function useDeleteFaculty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFaculty,
    onSuccess: () => {
      // Invalidate and refetch faculty queries
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.admin });
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.active });
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.featured });

      toast.success("Faculty member deleted successfully!");
    },
    onError: (error: Error) => {
      console.error("Error deleting faculty:", error);
      toast.error(error.message || "Failed to delete faculty member");
    },
  });
}

/**
 * Hook to toggle faculty active status
 */
export function useToggleFacultyStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleFacultyStatus(id, isActive),
    onSuccess: updatedFaculty => {
      // Invalidate and refetch faculty queries
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.admin });
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.active });
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.featured });

      toast.success(
        `Faculty member "${updatedFaculty.name}" ${
          updatedFaculty.is_active ? "activated" : "deactivated"
        } successfully!`
      );
    },
    onError: (error: Error) => {
      console.error("Error toggling faculty status:", error);
      toast.error(error.message || "Failed to update faculty status");
    },
  });
}

/**
 * Hook to toggle faculty featured status
 */
export function useToggleFacultyFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      toggleFacultyFeatured(id, isFeatured),
    onSuccess: updatedFaculty => {
      // Invalidate and refetch faculty queries
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.admin });
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.featured });

      toast.success(
        `Faculty member "${updatedFaculty.name}" ${
          updatedFaculty.is_featured ? "featured" : "unfeatured"
        } successfully!`
      );
    },
    onError: (error: Error) => {
      console.error("Error toggling faculty featured status:", error);
      toast.error(error.message || "Failed to update faculty featured status");
    },
  });
}

/**
 * Hook to update faculty sort order
 */
export function useUpdateFacultySortOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, sortOrder }: { id: string; sortOrder: number }) =>
      updateFacultySortOrder(id, sortOrder),
    onSuccess: () => {
      // Invalidate and refetch faculty queries
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.admin });
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.active });
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.featured });
    },
    onError: (error: Error) => {
      console.error("Error updating faculty sort order:", error);
      toast.error(error.message || "Failed to update faculty sort order");
    },
  });
}

/**
 * Hook to bulk update faculty sort orders
 */
export function useBulkUpdateFacultySortOrders() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkUpdateFacultySortOrders,
    onSuccess: () => {
      // Invalidate and refetch faculty queries
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.admin });
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.active });
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.featured });

      toast.success("Faculty order updated successfully!");
    },
    onError: (error: Error) => {
      console.error("Error updating faculty sort orders:", error);
      toast.error(error.message || "Failed to update faculty order");
    },
  });
}

// ============================================
// PHOTO UPLOAD HOOKS
// ============================================

/**
 * Hook to upload faculty photo
 */
export function useUploadFacultyPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, facultyId }: { file: File; facultyId: string }) =>
      uploadFacultyPhoto(file, facultyId),
    onSuccess: (photoUrl, { facultyId }) => {
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.byId(facultyId) });
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.admin });

      toast.success("Faculty photo uploaded successfully!");
    },
    onError: (error: Error) => {
      console.error("Error uploading faculty photo:", error);
      toast.error(error.message || "Failed to upload photo");
    },
  });
}

/**
 * Hook to delete faculty photo
 */
export function useDeleteFacultyPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFacultyPhoto,
    onSuccess: () => {
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.all });

      toast.success("Faculty photo deleted successfully!");
    },
    onError: (error: Error) => {
      console.error("Error deleting faculty photo:", error);
      toast.error(error.message || "Failed to delete photo");
    },
  });
}

// ============================================
// LEGACY COMPATIBILITY
// ============================================

/**
 * Legacy hook for backward compatibility
 * @deprecated Use useActiveFaculty instead
 */
export const useFaculty = useActiveFaculty;
