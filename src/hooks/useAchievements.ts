import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AchievementsService } from "@/services/achievements";
import { AchievementFormData } from "@/types";

// Hook for getting all achievements with filtering
export function useAchievements(
  options: {
    status?: "draft" | "published" | "archived";
    category_id?: string;
    achiever_type?: string;
    is_featured?: boolean;
    limit?: number;
    offset?: number;
  } = {}
) {
  return useQuery({
    queryKey: ["achievements", options],
    queryFn: () => AchievementsService.getAchievements(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for getting featured achievements
export function useFeaturedAchievements(limit: number = 6) {
  return useQuery({
    queryKey: ["achievements", "featured", limit],
    queryFn: () => AchievementsService.getFeaturedAchievements(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for getting single achievement
export function useAchievement(id: string) {
  return useQuery({
    queryKey: ["achievements", id],
    queryFn: () => AchievementsService.getAchievementById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook for getting achievement stats
export function useAchievementStats() {
  return useQuery({
    queryKey: ["achievements", "stats"],
    queryFn: () => AchievementsService.getAchievementStats(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Hook for creating achievements (admin only)
export function useCreateAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, userId }: { data: AchievementFormData; userId: string }) =>
      AchievementsService.createAchievement(data, userId),
    onSuccess: () => {
      // Invalidate and refetch achievements
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
    },
  });
}

// Hook for updating achievements (admin only)
export function useUpdateAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AchievementFormData> }) =>
      AchievementsService.updateAchievement(id, data),
    onSuccess: updatedAchievement => {
      // Update the specific achievement in cache
      queryClient.setQueryData(["achievements", updatedAchievement.id], updatedAchievement);
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ["achievements"], exact: false });
    },
  });
}

// Hook for deleting achievements (admin only)
export function useDeleteAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AchievementsService.deleteAchievement(id),
    onSuccess: () => {
      // Invalidate and refetch achievements
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
    },
  });
}

// Hook for updating sort order
export function useUpdateAchievementSortOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (achievements: { id: string; sort_order: number }[]) =>
      AchievementsService.updateSortOrder(achievements),
    onSuccess: () => {
      // Invalidate and refetch achievements
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
    },
  });
}

// Hook for getting categories with achievements
export function useCategoriesWithAchievements() {
  return useQuery({
    queryKey: ["categories", "with-achievements"],
    queryFn: () => AchievementsService.getCategoriesWithAchievements(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
