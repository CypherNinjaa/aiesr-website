import { supabase } from "@/lib/supabase";
import { Event, Category } from "@/types";

export interface AnalyticsData {
  totalEvents: number;
  publishedEvents: number;
  draftEvents: number;
  cancelledEvents: number;
  completedEvents: number;
  totalCategories: number;
  activeCategories: number;
  eventsByCategory: Array<{
    category: string;
    count: number;
    categoryData?: Category;
  }>;
  eventsByStatus: Array<{
    status: string;
    count: number;
  }>;
  recentEvents: Array<{
    id: string;
    title: string;
    date: string;
    status: string;
    category?: Category;
  }>;
  upcomingEvents: Array<{
    id: string;
    title: string;
    date: string;
    status: string;
    category?: Category;
  }>;
  featuredEventsCount: number;
  monthlyStats: Array<{
    month: string;
    events: number;
    publishedEvents: number;
  }>;
}

export class AnalyticsService {
  /**
   * Get comprehensive analytics data
   */
  static async getAnalyticsData(): Promise<AnalyticsData> {
    try {
      // Fetch all events with categories
      const { data: events, error: eventsError } = await supabase.from("events").select(`
          *,
          category:categories(*)
        `);

      if (eventsError) {
        console.error("Error fetching events:", eventsError);
        throw eventsError;
      }

      // Fetch all categories
      const { data: categories, error: categoriesError } = await supabase
        .from("categories")
        .select("*");

      if (categoriesError) {
        console.error("Error fetching categories:", categoriesError);
        throw categoriesError;
      }

      // Calculate basic stats
      const totalEvents = events?.length || 0;
      const publishedEvents = events?.filter(e => e.status === "published").length || 0;
      const draftEvents = events?.filter(e => e.status === "draft").length || 0;
      const cancelledEvents = events?.filter(e => e.status === "cancelled").length || 0;
      const completedEvents = events?.filter(e => e.status === "completed").length || 0;
      const featuredEventsCount = events?.filter(e => e.featured).length || 0;

      // Category stats
      const totalCategories = categories?.length || 0;
      const activeCategories = categories?.filter(c => c.is_active).length || 0;

      // Events by category
      const eventsByCategory = this.calculateEventsByCategory(events || [], categories || []);

      // Events by status
      const eventsByStatus = this.calculateEventsByStatus(events || []); // Recent events (last 10, sorted by creation date)
      const recentEvents = (events || [])
        .sort(
          (a, b) =>
            new Date(b.created_at || b.date).getTime() - new Date(a.created_at || a.date).getTime()
        )
        .slice(0, 10)
        .map(event => ({
          id: event.id,
          title: event.title,
          date: event.date,
          status: event.status || "draft",
          category: event.category,
        }));

      // Upcoming events (future events, sorted by date)
      const now = new Date();
      const upcomingEvents = (events || [])
        .filter(event => new Date(event.date) > now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 10)
        .map(event => ({
          id: event.id,
          title: event.title,
          date: event.date,
          status: event.status || "draft",
          category: event.category,
        }));

      // Monthly stats (last 6 months)
      const monthlyStats = this.calculateMonthlyStats(events || []);

      return {
        totalEvents,
        publishedEvents,
        draftEvents,
        cancelledEvents,
        completedEvents,
        totalCategories,
        activeCategories,
        eventsByCategory,
        eventsByStatus,
        recentEvents,
        upcomingEvents,
        featuredEventsCount,
        monthlyStats,
      };
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      throw error;
    }
  }

  /**
   * Calculate events by category
   */
  private static calculateEventsByCategory(events: Event[], categories: Category[]) {
    const categoryMap = new Map<string, Category>();
    categories.forEach(cat => categoryMap.set(cat.id, cat));

    const categoryStats = new Map<string, number>();

    events.forEach(event => {
      const categoryId = event.category_id;
      if (categoryId) {
        const count = categoryStats.get(categoryId) || 0;
        categoryStats.set(categoryId, count + 1);
      } else {
        // Count uncategorized events
        const count = categoryStats.get("uncategorized") || 0;
        categoryStats.set("uncategorized", count + 1);
      }
    });

    return Array.from(categoryStats.entries())
      .map(([categoryId, count]) => ({
        category:
          categoryId === "uncategorized"
            ? "Uncategorized"
            : categoryMap.get(categoryId)?.name || "Unknown",
        count,
        categoryData: categoryId !== "uncategorized" ? categoryMap.get(categoryId) : undefined,
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Calculate events by status
   */
  private static calculateEventsByStatus(events: Event[]) {
    const statusStats = new Map<string, number>();

    events.forEach(event => {
      const status = event.status || "draft";
      const count = statusStats.get(status) || 0;
      statusStats.set(status, count + 1);
    });

    return Array.from(statusStats.entries())
      .map(([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Calculate monthly statistics for the last 6 months
   */
  private static calculateMonthlyStats(events: Event[]) {
    const now = new Date();
    const monthlyStats = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const monthName = date.toLocaleDateString("en-US", { month: "short" });
      const year = date.getFullYear();
      const monthEvents = events.filter(event => {
        const eventDate = new Date(event.createdAt || event.date);
        return eventDate >= date && eventDate < nextMonth;
      });

      const publishedEvents = monthEvents.filter(e => e.status === "published");

      monthlyStats.push({
        month: `${monthName} ${year}`,
        events: monthEvents.length,
        publishedEvents: publishedEvents.length,
      });
    }

    return monthlyStats;
  }

  /**
   * Get event statistics by date range
   */
  static async getEventStatsByDateRange(startDate: Date, endDate: Date) {
    try {
      const { data: events, error } = await supabase
        .from("events")
        .select("*")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());

      if (error) throw error;

      return {
        totalEvents: events?.length || 0,
        publishedEvents: events?.filter(e => e.status === "published").length || 0,
        draftEvents: events?.filter(e => e.status === "draft").length || 0,
      };
    } catch (error) {
      console.error("Error fetching date range stats:", error);
      throw error;
    }
  }
}
