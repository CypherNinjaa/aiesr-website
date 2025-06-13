import { useQuery } from "@tanstack/react-query";
import { Event, EventRaw } from "@/types";

// Transform raw event data to Event objects
const transformEvents = (rawEvents: EventRaw[]): Event[] => {
  return rawEvents.map(event => ({
    ...event,
    date: new Date(event.date),
    endDate: event.endDate ? new Date(event.endDate) : undefined,
  }));
};

// Simulate API call - replace with actual API endpoint
const fetchEvents = async (): Promise<Event[]> => {
  // In a real app, this would be an API call
  const response = await import("@/data/events.json");
  return transformEvents(response.default as EventRaw[]);
};

export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Hook for events by type
export const useEventsByType = (type: Event["type"]) => {
  return useQuery({
    queryKey: ["events", "type", type],
    queryFn: async () => {
      const allEvents = await fetchEvents();
      return allEvents.filter(event => event.type === type);
    },
    enabled: !!type,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook for upcoming events
export const useUpcomingEvents = (limit?: number) => {
  return useQuery({
    queryKey: ["events", "upcoming", limit],
    queryFn: async () => {
      const allEvents = await fetchEvents();
      const now = new Date();
      return allEvents
        .filter(event => new Date(event.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, limit);
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Hook for featured events
export const useFeaturedEvents = () => {
  return useQuery({
    queryKey: ["events", "featured"],
    queryFn: async () => {
      const allEvents = await fetchEvents();
      return allEvents.filter(event => event.featured);
    },
    staleTime: 10 * 60 * 1000,
  });
};

// Hook for events by date range
export const useEventsByDateRange = (startDate: Date, endDate: Date) => {
  return useQuery({
    queryKey: ["events", "dateRange", startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      const allEvents = await fetchEvents();
      return allEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= startDate && eventDate <= endDate;
      });
    },
    enabled: !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook for single event by ID
export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ["events", id],
    queryFn: async () => {
      const allEvents = await fetchEvents();
      const event = allEvents.find(event => event.id === id);
      if (!event) {
        throw new Error("Event not found");
      }
      return event;
    },
    enabled: !!id,
    staleTime: 15 * 60 * 1000,
  });
};
