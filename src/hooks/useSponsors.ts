import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SponsorService } from "@/services/sponsors";
import { CreateSponsorData, UpdateSponsorData, CreateEventSponsorData } from "@/types";

// ==========================================
// SPONSOR QUERIES
// ==========================================

/**
 * Get all sponsors with optional filtering
 */
export function useSponsors(options?: {
  status?: "active" | "inactive";
  tier?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ["sponsors", options],
    queryFn: () => SponsorService.getSponsors(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get a specific sponsor by ID
 */
export function useSponsor(id: string, enabled = true) {
  return useQuery({
    queryKey: ["sponsors", id],
    queryFn: () => SponsorService.getSponsor(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Search sponsors by name
 */
export function useSearchSponsors(query: string, enabled = true) {
  return useQuery({
    queryKey: ["sponsors", "search", query],
    queryFn: () => SponsorService.searchSponsors(query),
    enabled: enabled && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Get sponsors grouped by tier
 */
export function useSponsorsByTier() {
  return useQuery({
    queryKey: ["sponsors", "by-tier"],
    queryFn: () => SponsorService.getSponsorsByTier(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ==========================================
// EVENT SPONSOR QUERIES
// ==========================================

/**
 * Get sponsors for a specific event
 */
export function useEventSponsors(eventId: string, enabled = true) {
  return useQuery({
    queryKey: ["event-sponsors", eventId],
    queryFn: () => SponsorService.getEventSponsors(eventId),
    enabled: enabled && !!eventId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// ==========================================
// SPONSOR MUTATIONS
// ==========================================

/**
 * Create a new sponsor
 */
export function useCreateSponsor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sponsorData: CreateSponsorData) => SponsorService.createSponsor(sponsorData),
    onSuccess: () => {
      // Invalidate and refetch sponsors
      queryClient.invalidateQueries({ queryKey: ["sponsors"] });
    },
    onError: error => {
      console.error("Failed to create sponsor:", error);
    },
  });
}

/**
 * Update an existing sponsor
 */
export function useUpdateSponsor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateSponsorData }) =>
      SponsorService.updateSponsor(id, updates),
    onSuccess: updatedSponsor => {
      // Update the specific sponsor in cache
      queryClient.setQueryData(["sponsors", updatedSponsor.id], updatedSponsor);
      // Invalidate sponsors list
      queryClient.invalidateQueries({ queryKey: ["sponsors"] });
    },
    onError: error => {
      console.error("Failed to update sponsor:", error);
    },
  });
}

/**
 * Delete a sponsor
 */
export function useDeleteSponsor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => SponsorService.deleteSponsor(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ["sponsors", deletedId] });
      // Invalidate sponsors list
      queryClient.invalidateQueries({ queryKey: ["sponsors"] });
    },
    onError: error => {
      console.error("Failed to delete sponsor:", error);
    },
  });
}

// ==========================================
// EVENT SPONSOR MUTATIONS
// ==========================================

/**
 * Add a sponsor to an event
 */
export function useAddEventSponsor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventSponsorData: CreateEventSponsorData) =>
      SponsorService.addEventSponsor(eventSponsorData),
    onSuccess: (_, variables) => {
      // Invalidate event sponsors
      queryClient.invalidateQueries({
        queryKey: ["event-sponsors", variables.event_id],
      });
    },
    onError: error => {
      console.error("Failed to add event sponsor:", error);
    },
  });
}

/**
 * Update an event sponsor
 */
export function useUpdateEventSponsor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
      eventId: _eventId,
    }: {
      id: string;
      updates: Partial<CreateEventSponsorData>;
      eventId: string;
    }) => SponsorService.updateEventSponsor(id, updates),
    onSuccess: (_, variables) => {
      // Invalidate event sponsors
      queryClient.invalidateQueries({
        queryKey: ["event-sponsors", variables.eventId],
      });
    },
    onError: error => {
      console.error("Failed to update event sponsor:", error);
    },
  });
}

/**
 * Remove a sponsor from an event
 */
export function useRemoveEventSponsor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, eventId: _eventId }: { id: string; eventId: string }) =>
      SponsorService.removeEventSponsor(id),
    onSuccess: (_, variables) => {
      // Invalidate event sponsors
      queryClient.invalidateQueries({
        queryKey: ["event-sponsors", variables.eventId],
      });
    },
    onError: error => {
      console.error("Failed to remove event sponsor:", error);
    },
  });
}

/**
 * Reorder event sponsors
 */
export function useReorderEventSponsors() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, sponsorIds }: { eventId: string; sponsorIds: string[] }) =>
      SponsorService.reorderEventSponsors(eventId, sponsorIds),
    onSuccess: (_, variables) => {
      // Invalidate event sponsors to refetch in new order
      queryClient.invalidateQueries({
        queryKey: ["event-sponsors", variables.eventId],
      });
    },
    onError: error => {
      console.error("Failed to reorder event sponsors:", error);
    },
  });
}
