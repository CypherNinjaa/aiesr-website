// ============================================
// PROGRAMS SERVICE - Dynamic Programs Management
// Backend service for admin-controlled programs CRUD
// ============================================

import { supabase } from "@/lib/supabase";
import { Program, CreateProgramData, UpdateProgramData } from "@/types";

// ============================================
// PUBLIC PROGRAM QUERIES
// ============================================

/**
 * Get all active programs for public display
 */
export async function getActivePrograms(): Promise<Program[]> {
  try {
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching active programs:", error);
      throw new Error(`Failed to fetch programs: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error("Error in getActivePrograms:", error);
    throw error;
  }
}

/**
 * Get featured programs for homepage display
 */
export async function getFeaturedPrograms(): Promise<Program[]> {
  try {
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching featured programs:", error);
      throw new Error(`Failed to fetch featured programs: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error("Error in getFeaturedPrograms:", error);
    throw error;
  }
}

/**
 * Get a single program by slug for detailed view
 */
export async function getProgramBySlug(slug: string): Promise<Program | null> {
  try {
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return null;
      }
      console.error("Error fetching program by slug:", error);
      throw new Error(`Failed to fetch program: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error in getProgramBySlug:", error);
    throw error;
  }
}

// ============================================
// ADMIN PROGRAM MANAGEMENT
// ============================================

/**
 * Get all programs for admin management (including inactive)
 */
export async function getAllProgramsAdmin(): Promise<Program[]> {
  try {
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching all programs:", error);
      throw new Error(`Failed to fetch programs: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAllProgramsAdmin:", error);
    throw error;
  }
}

/**
 * Create a new program
 */
export async function createProgram(programData: CreateProgramData): Promise<Program> {
  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("programs")
      .insert({
        ...programData,
        created_by: user?.id,
        updated_by: user?.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating program:", error);
      throw new Error(`Failed to create program: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error in createProgram:", error);
    throw error;
  }
}

/**
 * Update an existing program
 */
export async function updateProgram(id: string, programData: UpdateProgramData): Promise<Program> {
  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("programs")
      .update({
        ...programData,
        updated_by: user?.id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating program:", error);
      throw new Error(`Failed to update program: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error in updateProgram:", error);
    throw error;
  }
}

/**
 * Delete a program
 */
export async function deleteProgram(id: string): Promise<void> {
  try {
    const { error } = await supabase.from("programs").delete().eq("id", id);

    if (error) {
      console.error("Error deleting program:", error);
      throw new Error(`Failed to delete program: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in deleteProgram:", error);
    throw error;
  }
}

/**
 * Toggle program active status
 */
export async function toggleProgramStatus(id: string, isActive: boolean): Promise<Program> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("programs")
      .update({
        is_active: isActive,
        updated_by: user?.id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error toggling program status:", error);
      throw new Error(`Failed to toggle program status: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error in toggleProgramStatus:", error);
    throw error;
  }
}

/**
 * Toggle program featured status
 */
export async function toggleProgramFeatured(id: string, isFeatured: boolean): Promise<Program> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("programs")
      .update({
        is_featured: isFeatured,
        updated_by: user?.id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error toggling program featured status:", error);
      throw new Error(`Failed to toggle featured status: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error in toggleProgramFeatured:", error);
    throw error;
  }
}

/**
 * Update program sort order
 */
export async function updateProgramSortOrder(id: string, sortOrder: number): Promise<Program> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("programs")
      .update({
        sort_order: sortOrder,
        updated_by: user?.id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating program sort order:", error);
      throw new Error(`Failed to update sort order: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error in updateProgramSortOrder:", error);
    throw error;
  }
}

/**
 * Bulk update program sort orders
 */
export async function bulkUpdateSortOrders(
  updates: { id: string; sort_order: number }[]
): Promise<void> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Update each program's sort order
    const promises = updates.map(update =>
      supabase
        .from("programs")
        .update({
          sort_order: update.sort_order,
          updated_by: user?.id,
        })
        .eq("id", update.id)
    );

    const results = await Promise.all(promises);

    // Check for any errors
    const errors = results.filter(result => result.error);
    if (errors.length > 0) {
      console.error("Error updating sort orders:", errors);
      throw new Error("Failed to update some sort orders");
    }
  } catch (error) {
    console.error("Error in bulkUpdateSortOrders:", error);
    throw error;
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Generate a unique slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Validate program data
 */
export function validateProgramData(data: Partial<CreateProgramData>): string[] {
  const errors: string[] = [];

  if (!data.title?.trim()) {
    errors.push("Title is required");
  }

  if (!data.description?.trim()) {
    errors.push("Description is required");
  }

  if (!data.short_description?.trim()) {
    errors.push("Short description is required");
  }

  if (!data.duration?.trim()) {
    errors.push("Duration is required");
  }

  if (!data.level?.trim()) {
    errors.push("Level is required");
  }

  if (!["undergraduate", "postgraduate", "doctoral", "certificate"].includes(data.level || "")) {
    errors.push("Invalid level selected");
  }

  if (!data.slug?.trim()) {
    errors.push("Slug is required");
  }

  return errors;
}

/**
 * Check if slug is unique
 */
export async function isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
  try {
    let query = supabase.from("programs").select("id").eq("slug", slug);

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error checking slug uniqueness:", error);
      return false;
    }

    return !data || data.length === 0;
  } catch (error) {
    console.error("Error in isSlugUnique:", error);
    return false;
  }
}
