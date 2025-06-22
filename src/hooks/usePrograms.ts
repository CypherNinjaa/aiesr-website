// ============================================
// PROGRAMS HOOKS - React Query Hooks for Programs
// Client-side state management for programs
// ============================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  getActivePrograms,
  getFeaturedPrograms,
  getProgramBySlug,
  getAllProgramsAdmin,
  createProgram,
  updateProgram,
  deleteProgram,
  toggleProgramStatus,
  toggleProgramFeatured,
  updateProgramSortOrder,
  bulkUpdateSortOrders,
} from "@/services/programs";
import { Program, UpdateProgramData } from "@/types";

// ============================================
// QUERY KEYS
// ============================================

export const PROGRAMS_QUERY_KEYS = {
  all: ["programs"] as const,
  active: ["programs", "active"] as const,
  featured: ["programs", "featured"] as const,
  admin: ["programs", "admin"] as const,
  bySlug: (slug: string) => ["programs", "slug", slug] as const,
};

// ============================================
// PUBLIC HOOKS
// ============================================

/**
 * Hook to get all active programs for public display
 */
export function useActivePrograms() {
  return useQuery({
    queryKey: PROGRAMS_QUERY_KEYS.active,
    queryFn: getActivePrograms,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to get featured programs for homepage
 */
export function useFeaturedPrograms() {
  return useQuery({
    queryKey: PROGRAMS_QUERY_KEYS.featured,
    queryFn: getFeaturedPrograms,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to get a single program by slug
 */
export function useProgramBySlug(slug: string) {
  return useQuery({
    queryKey: PROGRAMS_QUERY_KEYS.bySlug(slug),
    queryFn: () => getProgramBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

// ============================================
// ADMIN HOOKS
// ============================================

/**
 * Hook to get all programs for admin management
 */
export function useAllProgramsAdmin() {
  return useQuery({
    queryKey: PROGRAMS_QUERY_KEYS.admin,
    queryFn: getAllProgramsAdmin,
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter for admin)
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// ============================================
// MUTATION HOOKS
// ============================================

/**
 * Hook to create a new program
 */
export function useCreateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProgram,
    onSuccess: newProgram => {
      // Invalidate and refetch programs
      queryClient.invalidateQueries({ queryKey: PROGRAMS_QUERY_KEYS.all });

      // Optimistically add to cache
      queryClient.setQueryData(PROGRAMS_QUERY_KEYS.admin, (oldData: Program[] | undefined) => {
        if (!oldData) return [newProgram];
        return [...oldData, newProgram].sort((a, b) => a.sort_order - b.sort_order);
      });

      toast.success("Program created successfully!");
    },
    onError: (error: Error) => {
      console.error("Error creating program:", error);
      toast.error(error.message || "Failed to create program");
    },
  });
}

/**
 * Hook to update an existing program
 */
export function useUpdateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProgramData }) => updateProgram(id, data),
    onSuccess: updatedProgram => {
      // Invalidate and refetch programs
      queryClient.invalidateQueries({ queryKey: PROGRAMS_QUERY_KEYS.all });

      // Update specific program in cache
      queryClient.setQueryData(PROGRAMS_QUERY_KEYS.admin, (oldData: Program[] | undefined) => {
        if (!oldData) return [updatedProgram];
        return oldData.map(program =>
          program.id === updatedProgram.id ? updatedProgram : program
        );
      });

      toast.success("Program updated successfully!");
    },
    onError: (error: Error) => {
      console.error("Error updating program:", error);
      toast.error(error.message || "Failed to update program");
    },
  });
}

/**
 * Hook to delete a program
 */
export function useDeleteProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProgram,
    onSuccess: (_, deletedId) => {
      // Invalidate and refetch programs
      queryClient.invalidateQueries({ queryKey: PROGRAMS_QUERY_KEYS.all });

      // Remove from cache
      queryClient.setQueryData(PROGRAMS_QUERY_KEYS.admin, (oldData: Program[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(program => program.id !== deletedId);
      });

      toast.success("Program deleted successfully!");
    },
    onError: (error: Error) => {
      console.error("Error deleting program:", error);
      toast.error(error.message || "Failed to delete program");
    },
  });
}

/**
 * Hook to toggle program active status
 */
export function useToggleProgramStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleProgramStatus(id, isActive),
    onSuccess: updatedProgram => {
      // Invalidate and refetch programs
      queryClient.invalidateQueries({ queryKey: PROGRAMS_QUERY_KEYS.all });

      // Update in cache
      queryClient.setQueryData(PROGRAMS_QUERY_KEYS.admin, (oldData: Program[] | undefined) => {
        if (!oldData) return [updatedProgram];
        return oldData.map(program =>
          program.id === updatedProgram.id ? updatedProgram : program
        );
      });

      toast.success(
        `Program ${updatedProgram.is_active ? "activated" : "deactivated"} successfully!`
      );
    },
    onError: (error: Error) => {
      console.error("Error toggling program status:", error);
      toast.error(error.message || "Failed to toggle program status");
    },
  });
}

/**
 * Hook to toggle program featured status
 */
export function useToggleProgramFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      toggleProgramFeatured(id, isFeatured),
    onSuccess: updatedProgram => {
      // Invalidate and refetch programs
      queryClient.invalidateQueries({ queryKey: PROGRAMS_QUERY_KEYS.all });

      // Update in cache
      queryClient.setQueryData(PROGRAMS_QUERY_KEYS.admin, (oldData: Program[] | undefined) => {
        if (!oldData) return [updatedProgram];
        return oldData.map(program =>
          program.id === updatedProgram.id ? updatedProgram : program
        );
      });

      toast.success(
        `Program ${updatedProgram.is_featured ? "featured" : "unfeatured"} successfully!`
      );
    },
    onError: (error: Error) => {
      console.error("Error toggling program featured status:", error);
      toast.error(error.message || "Failed to toggle featured status");
    },
  });
}

/**
 * Hook to update program sort order
 */
export function useUpdateProgramSortOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, sortOrder }: { id: string; sortOrder: number }) =>
      updateProgramSortOrder(id, sortOrder),
    onSuccess: updatedProgram => {
      // Invalidate and refetch programs
      queryClient.invalidateQueries({ queryKey: PROGRAMS_QUERY_KEYS.all });

      // Update in cache and resort
      queryClient.setQueryData(PROGRAMS_QUERY_KEYS.admin, (oldData: Program[] | undefined) => {
        if (!oldData) return [updatedProgram];
        return oldData
          .map(program => (program.id === updatedProgram.id ? updatedProgram : program))
          .sort((a, b) => a.sort_order - b.sort_order);
      });

      toast.success("Program order updated successfully!");
    },
    onError: (error: Error) => {
      console.error("Error updating program sort order:", error);
      toast.error(error.message || "Failed to update program order");
    },
  });
}

/**
 * Hook to bulk update sort orders
 */
export function useBulkUpdateSortOrders() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkUpdateSortOrders,
    onSuccess: () => {
      // Invalidate and refetch programs
      queryClient.invalidateQueries({ queryKey: PROGRAMS_QUERY_KEYS.all });
      toast.success("Program order updated successfully!");
    },
    onError: (error: Error) => {
      console.error("Error updating program sort orders:", error);
      toast.error(error.message || "Failed to update program order");
    },
  });
}

// ============================================
// LEGACY HOOKS (for backwards compatibility)
// ============================================

/**
 * @deprecated Use useActivePrograms instead
 */
export const usePrograms = useActivePrograms;

/**
 * Hook for programs by level
 */
export const useProgramsByLevel = (level: Program["level"]) => {
  const { data: programs, ...rest } = useActivePrograms();

  return {
    ...rest,
    data: programs?.filter(program => program.level === level),
  };
};
