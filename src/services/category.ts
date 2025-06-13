import { supabase, Database } from "@/lib/supabase";
import type { Category } from "@/types";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

export class CategoryService {
  /**
   * Get all active categories ordered by sort_order
   */
  static async getActiveCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;

      return (data || []).map(this.mapToCategory);
    } catch (error) {
      console.error("Error fetching active categories:", error);
      return [];
    }
  }

  /**
   * Get all categories (for admin use)
   */
  static async getAllCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;

      return (data || []).map(this.mapToCategory);
    } catch (error) {
      console.error("Error fetching all categories:", error);
      return [];
    }
  }

  /**
   * Get category by ID
   */
  static async getCategoryById(id: string): Promise<Category | null> {
    try {
      const { data, error } = await supabase.from("categories").select("*").eq("id", id).single();

      if (error) throw error;

      return data ? this.mapToCategory(data) : null;
    } catch (error) {
      console.error("Error fetching category by ID:", error);
      return null;
    }
  }

  /**
   * Get category by slug
   */
  static async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;

      return data ? this.mapToCategory(data) : null;
    } catch (error) {
      console.error("Error fetching category by slug:", error);
      return null;
    }
  }

  /**
   * Create new category
   */
  static async createCategory(
    categoryData: Omit<Category, "id" | "created_at" | "updated_at">
  ): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from("categories")
        .insert([
          {
            name: categoryData.name,
            slug: categoryData.slug,
            description: categoryData.description,
            color_class: categoryData.color_class,
            icon_emoji: categoryData.icon_emoji,
            is_active: categoryData.is_active,
            sort_order: categoryData.sort_order,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return data ? this.mapToCategory(data) : null;
    } catch (error) {
      console.error("Error creating category:", error);
      return null;
    }
  }

  /**
   * Update category
   */
  static async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from("categories")
        .update({
          ...(updates.name && { name: updates.name }),
          ...(updates.slug && { slug: updates.slug }),
          ...(updates.description !== undefined && { description: updates.description }),
          ...(updates.color_class && { color_class: updates.color_class }),
          ...(updates.icon_emoji && { icon_emoji: updates.icon_emoji }),
          ...(updates.is_active !== undefined && { is_active: updates.is_active }),
          ...(updates.sort_order !== undefined && { sort_order: updates.sort_order }),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return data ? this.mapToCategory(data) : null;
    } catch (error) {
      console.error("Error updating category:", error);
      return null;
    }
  }

  /**
   * Delete category
   */
  static async deleteCategory(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      return false;
    }
  }

  /**
   * Check if slug is available for new category or category update
   */
  static async isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
    try {
      let query = supabase.from("categories").select("id").eq("slug", slug);

      if (excludeId) {
        query = query.neq("id", excludeId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).length === 0;
    } catch (error) {
      console.error("Error checking slug availability:", error);
      return false;
    }
  }

  /**
   * Get events count for each category
   */
  static async getCategoriesWithEventCounts(): Promise<(Category & { eventCount: number })[]> {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select(
          `
          *,
          events!events_category_id_fkey (count)
        `
        )
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;

      return (data || []).map(category => ({
        ...this.mapToCategory(category),
        eventCount: Array.isArray(category.events) ? category.events.length : 0,
      }));
    } catch (error) {
      console.error("Error fetching categories with event counts:", error);
      return [];
    }
  }

  /**
   * Reorder categories
   */
  static async reorderCategories(categoryIds: string[]): Promise<boolean> {
    try {
      const updates = categoryIds.map((id, index) => ({
        id,
        sort_order: index,
      }));

      const { error } = await supabase.from("categories").upsert(updates, { onConflict: "id" });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error("Error reordering categories:", error);
      return false;
    }
  }

  /**
   * Generate slug from name
   */
  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  /**
   * Get available color classes for categories
   */
  static getAvailableColorClasses(): Array<{ value: string; label: string; preview: string }> {
    return [
      { value: "bg-blue-100 text-blue-800", label: "Blue", preview: "bg-blue-100" },
      { value: "bg-purple-100 text-purple-800", label: "Purple", preview: "bg-purple-100" },
      { value: "bg-green-100 text-green-800", label: "Green", preview: "bg-green-100" },
      { value: "bg-orange-100 text-orange-800", label: "Orange", preview: "bg-orange-100" },
      { value: "bg-red-100 text-red-800", label: "Red", preview: "bg-red-100" },
      { value: "bg-yellow-100 text-yellow-800", label: "Yellow", preview: "bg-yellow-100" },
      { value: "bg-pink-100 text-pink-800", label: "Pink", preview: "bg-pink-100" },
      { value: "bg-indigo-100 text-indigo-800", label: "Indigo", preview: "bg-indigo-100" },
      { value: "bg-teal-100 text-teal-800", label: "Teal", preview: "bg-teal-100" },
      { value: "bg-gray-100 text-gray-800", label: "Gray", preview: "bg-gray-100" },
    ];
  } /**
   * Map database row to Category interface
   */
  private static mapToCategory(data: CategoryRow): Category {
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description || undefined,
      color_class: data.color_class,
      icon_emoji: data.icon_emoji,
      is_active: data.is_active,
      sort_order: data.sort_order,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
      created_by: data.created_by || undefined,
    };
  }
}
