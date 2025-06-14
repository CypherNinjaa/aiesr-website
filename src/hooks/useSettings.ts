import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService, SettingsData } from "@/services/settings";

// Hook to get all settings
export function useSettings() {
  return useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => settingsService.getAllSettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to get formatted settings for the UI
export function useFormattedSettings() {
  return useQuery({
    queryKey: ["admin-settings-formatted"],
    queryFn: () => settingsService.getFormattedSettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to get settings by category
export function useSettingsByCategory(category: string) {
  return useQuery({
    queryKey: ["admin-settings", "category", category],
    queryFn: () => settingsService.getSettingsByCategory(category),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to get a single setting
export function useSetting(key: string) {
  return useQuery({
    queryKey: ["admin-settings", "single", key],
    queryFn: () => settingsService.getSetting(key),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to get public settings (for use in public components)
export function usePublicSettings() {
  return useQuery({
    queryKey: ["public-settings"],
    queryFn: () => settingsService.getPublicSettings(),
    staleTime: 10 * 60 * 1000, // 10 minutes - longer cache for public settings
  });
}

// Hook to update settings
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SettingsData) => settingsService.saveFormattedSettings(data),
    onSuccess: () => {
      // Invalidate all settings queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-settings-formatted"] });
      queryClient.invalidateQueries({ queryKey: ["public-settings"] });
      console.log("Settings saved successfully!");
    },
    onError: (error: Error) => {
      console.error("Error saving settings:", error);
    },
  });
}

// Hook to create a new setting
export function useCreateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      key: string;
      value: string | number | boolean | string[] | Record<string, string>;
      description?: string;
      category?: string;
      isPublic?: boolean;
    }) =>
      settingsService.createSetting(
        params.key,
        params.value,
        params.description,
        params.category,
        params.isPublic
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      if (variables?.isPublic) {
        queryClient.invalidateQueries({ queryKey: ["public-settings"] });
      }
      console.log("Setting created successfully!");
    },
    onError: (error: Error) => {
      console.error("Error creating setting:", error);
    },
  });
}

// Hook to delete a setting
export function useDeleteSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (key: string) => settingsService.deleteSetting(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      queryClient.invalidateQueries({ queryKey: ["public-settings"] });
      console.log("Setting deleted successfully!");
    },
    onError: (error: Error) => {
      console.error("Error deleting setting:", error);
    },
  });
}

// Custom hook for settings form management
export function useSettingsForm() {
  const { data: settings, isLoading, error } = useFormattedSettings();
  const updateSettings = useUpdateSettings();

  return {
    settings,
    isLoading,
    error,
    save: updateSettings.mutate,
    isSaving: updateSettings.isPending,
    saveError: updateSettings.error,
  };
}
