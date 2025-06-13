import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EventService } from "@/services/database";
import { Event } from "@/types";

// Hook for all events
export const useEvents = (filters?: {
  status?: string;
  type?: string;
  featured?: boolean;
  upcoming?: boolean;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["events", filters],
    queryFn: () => EventService.getEvents(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent updates)
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for single event
export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => EventService.getEvent(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook for events by type
export const useEventsByType = (type: Event["type"], limit?: number) => {
  return useQuery({
    queryKey: ["events", "type", type, limit],
    queryFn: () => EventService.getEventsByType(type, limit),
    enabled: !!type,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook for upcoming events
export const useUpcomingEvents = (limit?: number) => {
  return useQuery({
    queryKey: ["events", "upcoming", limit],
    queryFn: () => EventService.getUpcomingEvents(limit),
    staleTime: 2 * 60 * 1000,
  });
};

// Hook for featured events
export const useFeaturedEvents = (limit?: number) => {
  return useQuery({
    queryKey: ["events", "featured", limit],
    queryFn: () => EventService.getFeaturedEvents(limit),
    staleTime: 5 * 60 * 1000,
  });
};

// Hook for events by date range
export const useEventsByDateRange = (startDate: Date, endDate: Date) => {
  return useQuery({
    queryKey: ["events", "dateRange", startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      const allEvents = await EventService.getEvents({ status: "published" });
      return allEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= startDate && eventDate <= endDate;
      });
    },
    enabled: !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  });
};

// Admin mutation hooks
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (event: Partial<Event> & { createdBy: string }) => EventService.createEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Event> }) =>
      EventService.updateEvent(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => EventService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
