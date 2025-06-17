import { supabase } from "@/lib/supabase";
import { Event, Category, Achievement } from "@/types";

export interface AnalyticsData {
  totalEvents: number;
  publishedEvents: number;
  draftEvents: number;
  cancelledEvents: number;
  completedEvents: number;
  totalCategories: number;
  activeCategories: number;
  // Achievement metrics
  totalAchievements: number;
  publishedAchievements: number;
  draftAchievements: number;
  featuredAchievements: number;
  studentAchievements: number;
  facultyAchievements: number;
  institutionalAchievements: number;
  achievementsByCategory: Array<{
    category: string;
    count: number;
    categoryData?: Category;
  }>;
  achievementsByType: Array<{
    type: string;
    count: number;
  }>;
  recentAchievements: Array<{
    id: string;
    title: string;
    achiever_name: string;
    achiever_type: string;
    date_achieved: string;
    status: string;
    category?: Category;
  }>;
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
    achievements: number;
    publishedAchievements: number;
  }>;
}

export class AnalyticsService {
  /**
   * Get comprehensive analytics data
   */ static async getAnalyticsData(): Promise<AnalyticsData> {
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

      // Fetch all achievements with categories
      const { data: achievements, error: achievementsError } = await supabase.from("achievements")
        .select(`
          *,
          category:categories(*)
        `);

      if (achievementsError) {
        console.error("Error fetching achievements:", achievementsError);
        throw achievementsError;
      }

      // Fetch all categories
      const { data: categories, error: categoriesError } = await supabase
        .from("categories")
        .select("*");

      if (categoriesError) {
        console.error("Error fetching categories:", categoriesError);
        throw categoriesError;
      }

      // Calculate basic event stats
      const totalEvents = events?.length || 0;
      const publishedEvents = events?.filter(e => e.status === "published").length || 0;
      const draftEvents = events?.filter(e => e.status === "draft").length || 0;
      const cancelledEvents = events?.filter(e => e.status === "cancelled").length || 0;
      const completedEvents = events?.filter(e => e.status === "completed").length || 0;
      const featuredEventsCount = events?.filter(e => e.featured).length || 0;

      // Calculate achievement stats
      const totalAchievements = achievements?.length || 0;
      const publishedAchievements = achievements?.filter(a => a.status === "published").length || 0;
      const draftAchievements = achievements?.filter(a => a.status === "draft").length || 0;
      const featuredAchievements = achievements?.filter(a => a.is_featured).length || 0;
      const studentAchievements =
        achievements?.filter(a => a.achiever_type === "student").length || 0;
      const facultyAchievements =
        achievements?.filter(a => a.achiever_type === "faculty").length || 0;
      const institutionalAchievements =
        achievements?.filter(
          a => a.achiever_type === "institution" || a.achiever_type === "department"
        ).length || 0;

      // Category stats
      const totalCategories = categories?.length || 0;
      const activeCategories = categories?.filter(c => c.is_active).length || 0;

      // Events by category
      const eventsByCategory = this.calculateEventsByCategory(events || [], categories || []);

      // Achievements by category
      const achievementsByCategory = this.calculateAchievementsByCategory(
        achievements || [],
        categories || []
      );

      // Achievements by type
      const achievementsByType = this.calculateAchievementsByType(achievements || []);

      // Events by status
      const eventsByStatus = this.calculateEventsByStatus(events || []);

      // Recent events (last 10, sorted by creation date)
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

      // Recent achievements (last 10, sorted by date achieved)
      const recentAchievements = (achievements || [])
        .sort((a, b) => new Date(b.date_achieved).getTime() - new Date(a.date_achieved).getTime())
        .slice(0, 10)
        .map(achievement => ({
          id: achievement.id,
          title: achievement.title,
          achiever_name: achievement.achiever_name,
          achiever_type: achievement.achiever_type,
          date_achieved: achievement.date_achieved,
          status: achievement.status || "draft",
          category: achievement.category,
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
      const monthlyStats = this.calculateMonthlyStats(events || [], achievements || []);

      return {
        totalEvents,
        publishedEvents,
        draftEvents,
        cancelledEvents,
        completedEvents,
        totalCategories,
        activeCategories,
        totalAchievements,
        publishedAchievements,
        draftAchievements,
        featuredAchievements,
        studentAchievements,
        facultyAchievements,
        institutionalAchievements,
        achievementsByCategory,
        achievementsByType,
        recentAchievements,
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
   * Calculate achievements by category
   */
  private static calculateAchievementsByCategory(
    achievements: Achievement[],
    categories: Category[]
  ) {
    const categoryMap = new Map<string, Category>();
    categories.forEach(cat => categoryMap.set(cat.id, cat));

    const categoryStats = new Map<string, number>();

    achievements.forEach(achievement => {
      const categoryId = achievement.category_id;
      if (categoryId) {
        const count = categoryStats.get(categoryId) || 0;
        categoryStats.set(categoryId, count + 1);
      } else {
        // Count uncategorized achievements
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
   * Calculate achievements by type
   */
  private static calculateAchievementsByType(achievements: Achievement[]) {
    const typeStats = new Map<string, number>();

    achievements.forEach(achievement => {
      const type = achievement.achiever_type || "unknown";
      const count = typeStats.get(type) || 0;
      typeStats.set(type, count + 1);
    });

    return Array.from(typeStats.entries())
      .map(([type, count]) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Calculate monthly statistics for the last 6 months
   */
  private static calculateMonthlyStats(events: Event[], achievements: Achievement[]) {
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

      const monthAchievements = achievements.filter(achievement => {
        const achievementDate = new Date(achievement.created_at);
        return achievementDate >= date && achievementDate < nextMonth;
      });

      const publishedEvents = monthEvents.filter(e => e.status === "published");
      const publishedAchievements = monthAchievements.filter(a => a.status === "published");

      monthlyStats.push({
        month: `${monthName} ${year}`,
        events: monthEvents.length,
        publishedEvents: publishedEvents.length,
        achievements: monthAchievements.length,
        publishedAchievements: publishedAchievements.length,
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

  /**
   * Get achievement statistics by date range
   */
  static async getAchievementStatsByDateRange(startDate: Date, endDate: Date) {
    try {
      const { data: achievements, error } = await supabase
        .from("achievements")
        .select("*")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());

      if (error) throw error;

      return {
        totalAchievements: achievements?.length || 0,
        publishedAchievements: achievements?.filter(a => a.status === "published").length || 0,
        draftAchievements: achievements?.filter(a => a.status === "draft").length || 0,
        featuredAchievements: achievements?.filter(a => a.is_featured).length || 0,
        studentAchievements: achievements?.filter(a => a.achiever_type === "student").length || 0,
        facultyAchievements: achievements?.filter(a => a.achiever_type === "faculty").length || 0,
        institutionalAchievements:
          achievements?.filter(
            a => a.achiever_type === "institution" || a.achiever_type === "department"
          ).length || 0,
      };
    } catch (error) {
      console.error("Error fetching achievement date range stats:", error);
      throw error;
    }
  }
}
