import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "@/services/category";
import { Category } from "@/types";

// Hook for all categories (admin view)
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.getAllCategories(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for active categories (public view)
export const useActiveCategories = () => {
  return useQuery({
    queryKey: ["categories", "active"],
    queryFn: () => CategoryService.getActiveCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes (categories change less frequently)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Hook for single category
export const useCategory = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => CategoryService.getCategoryById(id),
    enabled: options?.enabled !== false && !!id,
    staleTime: 10 * 60 * 1000,
  });
};

// Hook for category by slug
export const useCategoryBySlug = (slug: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["category", "slug", slug],
    queryFn: () => CategoryService.getCategoryBySlug(slug),
    enabled: options?.enabled !== false && !!slug,
    staleTime: 10 * 60 * 1000,
  });
};

// Hook for categories with event counts
export const useCategoriesWithEventCounts = () => {
  return useQuery({
    queryKey: ["categories", "with-counts"],
    queryFn: () => CategoryService.getCategoriesWithEventCounts(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Admin mutation hooks with activity logging
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData: Omit<Category, "id" | "created_at" | "updated_at">) =>
      CategoryService.createCategory(categoryData),
    onSuccess: data => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories", "active"] });
      queryClient.invalidateQueries({ queryKey: ["categories", "with-counts"] });

      // Optionally invalidate activity logs to show the new activity
      queryClient.invalidateQueries({ queryKey: ["activity"] });

      return data;
    },
    onError: error => {
      console.error("Failed to create category:", error);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Category> }) =>
      CategoryService.updateCategory(id, updates),
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories", "active"] });
      queryClient.invalidateQueries({ queryKey: ["categories", "with-counts"] });
      queryClient.invalidateQueries({ queryKey: ["category", variables.id] });

      // Optionally invalidate activity logs to show the new activity
      queryClient.invalidateQueries({ queryKey: ["activity"] });

      return data;
    },
    onError: error => {
      console.error("Failed to update category:", error);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => CategoryService.deleteCategory(id),
    onSuccess: (_, id) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories", "active"] });
      queryClient.invalidateQueries({ queryKey: ["categories", "with-counts"] });
      queryClient.removeQueries({ queryKey: ["category", id] });

      // Optionally invalidate activity logs to show the new activity
      queryClient.invalidateQueries({ queryKey: ["activity"] });
    },
    onError: error => {
      console.error("Failed to delete category:", error);
    },
  });
};

// Utility hook for checking slug availability
export const useCheckSlugAvailability = () => {
  return useMutation({
    mutationFn: ({ slug, excludeId }: { slug: string; excludeId?: string }) =>
      CategoryService.isSlugAvailable(slug, excludeId),
  });
};

// Hook for reordering categories
export const useReorderCategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryIds: string[]) => CategoryService.reorderCategories(categoryIds),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories", "active"] });
      queryClient.invalidateQueries({ queryKey: ["categories", "with-counts"] });

      // Optionally invalidate activity logs to show the new activity
      queryClient.invalidateQueries({ queryKey: ["activity"] });
    },
    onError: error => {
      console.error("Failed to reorder categories:", error);
    },
  });
};
