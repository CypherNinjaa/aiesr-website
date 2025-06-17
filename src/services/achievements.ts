import { supabase } from "@/lib/supabase";
import { Achievement, AchievementFormData, AchievementStats } from "@/types";

export class AchievementsService {
  // Get all achievements with filtering options
  static async getAchievements(
    options: {
      status?: "draft" | "published" | "archived";
      category_id?: string;
      achiever_type?: string;
      is_featured?: boolean;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<{ data: Achievement[]; count: number }> {
    try {
      let query = supabase
        .from("achievements")
        .select(
          `
          *,
          category:categories(
            id,
            name,
            slug,
            description,
            color_class,
            icon_emoji,
            is_active
          )
        `,
          { count: "exact" }
        )
        .order("sort_order", { ascending: true })
        .order("date_achieved", { ascending: false });

      // Apply filters
      if (options.status) {
        query = query.eq("status", options.status);
      }
      if (options.category_id) {
        query = query.eq("category_id", options.category_id);
      }
      if (options.achiever_type) {
        query = query.eq("achiever_type", options.achiever_type);
      }
      if (options.is_featured !== undefined) {
        query = query.eq("is_featured", options.is_featured);
      }
      if (options.limit) {
        query = query.limit(options.limit);
      }
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching achievements:", error);
        throw new Error(error.message);
      }

      // Transform the data to match our Achievement interface
      const achievements =
        data?.map(item => ({
          ...item,
          date_achieved: new Date(item.date_achieved),
          created_at: new Date(item.created_at),
          updated_at: new Date(item.updated_at),
        })) || [];

      return { data: achievements, count: count || 0 };
    } catch (error) {
      console.error("Error in getAchievements:", error);
      throw error;
    }
  }

  // Get featured achievements for public display
  static async getFeaturedAchievements(limit: number = 6): Promise<Achievement[]> {
    try {
      const { data } = await this.getAchievements({
        status: "published",
        is_featured: true,
        limit,
      });
      return data;
    } catch (error) {
      console.error("Error fetching featured achievements:", error);
      return [];
    }
  }
  // Get achievement by ID
  static async getAchievementById(id: string): Promise<Achievement | null> {
    try {
      const { data, error } = await supabase
        .from("achievements")
        .select(
          `
          *,
          category:categories(
            id,
            name,
            slug,
            description,
            color_class,
            icon_emoji,
            is_active
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching achievement:", error);
        return null;
      }

      return {
        ...data,
        date_achieved: new Date(data.date_achieved),
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
      };
    } catch (error) {
      console.error("Error in getAchievementById:", error);
      return null;
    }
  } // Create new achievement (admin only)
  static async createAchievement(
    achievementData: AchievementFormData,
    _userId: string = "admin-user"
  ): Promise<Achievement> {
    try {
      const response = await fetch("/api/admin/achievements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(achievementData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create achievement");
      }

      const { data } = await response.json();

      return {
        ...data,
        date_achieved: new Date(data.date_achieved),
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
      };
    } catch (error) {
      console.error("Error in createAchievement:", error);
      throw error;
    }
  }
  // Update achievement (admin only)
  static async updateAchievement(
    id: string,
    achievementData: Partial<AchievementFormData>
  ): Promise<Achievement> {
    try {
      const response = await fetch(`/api/admin/achievements/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(achievementData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update achievement");
      }

      const { data } = await response.json();

      return {
        ...data,
        date_achieved: new Date(data.date_achieved),
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
      };
    } catch (error) {
      console.error("Error in updateAchievement:", error);
      throw error;
    }
  }
  // Delete achievement (admin only)
  static async deleteAchievement(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/admin/achievements/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete achievement");
      }
    } catch (error) {
      console.error("Error in deleteAchievement:", error);
      throw error;
    }
  }

  // Get achievement statistics
  static async getAchievementStats(): Promise<AchievementStats> {
    try {
      const [totalResult, studentResult, facultyResult, recentResult, featuredResult] =
        await Promise.all([
          supabase.from("achievements").select("*", { count: "exact" }).eq("status", "published"),
          supabase
            .from("achievements")
            .select("*", { count: "exact" })
            .eq("status", "published")
            .eq("achiever_type", "student"),
          supabase
            .from("achievements")
            .select("*", { count: "exact" })
            .eq("status", "published")
            .eq("achiever_type", "faculty"),
          supabase
            .from("achievements")
            .select("*", { count: "exact" })
            .eq("status", "published")
            .gte("date_achieved", new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()),
          supabase
            .from("achievements")
            .select("*", { count: "exact" })
            .eq("status", "published")
            .eq("is_featured", true),
        ]);

      return {
        total: totalResult.count || 0,
        student_achievements: studentResult.count || 0,
        faculty_achievements: facultyResult.count || 0,
        recent_achievements: recentResult.count || 0,
        featured_achievements: featuredResult.count || 0,
      };
    } catch (error) {
      console.error("Error fetching achievement stats:", error);
      return {
        total: 0,
        student_achievements: 0,
        faculty_achievements: 0,
        recent_achievements: 0,
        featured_achievements: 0,
      };
    }
  }
  // Bulk update sort order
  static async updateSortOrder(achievements: { id: string; sort_order: number }[]): Promise<void> {
    try {
      // For bulk operations, we'll make individual API calls
      // In a production app, you might want to create a dedicated bulk update endpoint
      const updates = achievements.map(({ id, sort_order }) =>
        fetch(`/api/admin/achievements/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sort_order }),
        })
      );

      const responses = await Promise.all(updates);

      for (const response of responses) {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update sort order");
        }
      }
    } catch (error) {
      console.error("Error updating sort order:", error);
      throw error;
    }
  }
  // Get categories with achievement counts (only categories that have achievements)
  static async getCategoriesWithAchievements(): Promise<
    Array<{
      id: string;
      name: string;
      slug: string;
      icon_emoji: string;
      color_class: string;
      achievement_count: number;
    }>
  > {
    try {
      // First get all active categories
      const { data: categories, error: categoriesError } = await supabase
        .from("categories")
        .select("id, name, slug, icon_emoji, color_class")
        .eq("is_active", true)
        .order("name");

      if (categoriesError) {
        console.error("Error fetching categories:", categoriesError);
        return [];
      }

      // Then get achievement counts for each category
      const categoriesWithCounts = await Promise.all(
        (categories || []).map(async category => {
          const { count } = await supabase
            .from("achievements")
            .select("*", { count: "exact", head: true })
            .eq("category_id", category.id)
            .eq("status", "published");

          return {
            ...category,
            achievement_count: count || 0,
          };
        })
      );

      // Filter out categories with no achievements
      return categoriesWithCounts.filter(category => category.achievement_count > 0);
    } catch (error) {
      console.error("Error in getCategoriesWithAchievements:", error);
      return [];
    }
  }
}
