// ============================================
// FACULTY SERVICE - Dynamic Faculty Management
// Backend service for admin-controlled faculty CRUD
// ============================================

import { supabase } from "@/lib/supabase";
import { Faculty, CreateFacultyData, UpdateFacultyData } from "@/types";

// ============================================
// PUBLIC FACULTY QUERIES
// ============================================

/**
 * Get all active faculty for public display
 */
export async function getActiveFaculty(): Promise<Faculty[]> {
  try {
    const { data, error } = await supabase
      .from("faculty")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching active faculty:", error);
      throw new Error(`Failed to fetch faculty: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error("Error in getActiveFaculty:", error);
    throw error;
  }
}

/**
 * Get featured faculty for homepage display
 */
export async function getFeaturedFaculty(): Promise<Faculty[]> {
  try {
    const { data, error } = await supabase
      .from("faculty")
      .select("*")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching featured faculty:", error);
      throw new Error(`Failed to fetch featured faculty: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error("Error in getFeaturedFaculty:", error);
    throw error;
  }
}

/**
 * Get single faculty member by ID
 */
export async function getFacultyById(id: string): Promise<Faculty | null> {
  try {
    const { data, error } = await supabase
      .from("faculty")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // No rows returned
      }
      console.error("Error fetching faculty by ID:", error);
      throw new Error(`Failed to fetch faculty: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error in getFacultyById:", error);
    throw error;
  }
}

// ============================================
// ADMIN FACULTY QUERIES
// ============================================

/**
 * Get all faculty for admin management (including inactive)
 */
export async function getAllFacultyAdmin(): Promise<Faculty[]> {
  try {
    const { data, error } = await supabase
      .from("faculty")
      .select(
        `
        *
      `
      )
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching all faculty for admin:", error);
      throw new Error(`Failed to fetch faculty: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAllFacultyAdmin:", error);
    throw error;
  }
}

// ============================================
// FACULTY MUTATIONS
// ============================================

/**
 * Create new faculty member
 */
export async function createFaculty(facultyData: CreateFacultyData): Promise<Faculty> {
  try {
    const { data, error } = await supabase.from("faculty").insert([facultyData]).select().single();

    if (error) {
      console.error("Error creating faculty:", error);
      throw new Error(`Failed to create faculty: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error in createFaculty:", error);
    throw error;
  }
}

/**
 * Update existing faculty member
 */
export async function updateFaculty(id: string, facultyData: UpdateFacultyData): Promise<Faculty> {
  try {
    const { data, error } = await supabase
      .from("faculty")
      .update({ ...facultyData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating faculty:", error);
      throw new Error(`Failed to update faculty: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error in updateFaculty:", error);
    throw error;
  }
}

/**
 * Delete faculty member
 */
export async function deleteFaculty(id: string): Promise<void> {
  try {
    const { error } = await supabase.from("faculty").delete().eq("id", id);

    if (error) {
      console.error("Error deleting faculty:", error);
      throw new Error(`Failed to delete faculty: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in deleteFaculty:", error);
    throw error;
  }
}

/**
 * Toggle faculty active status
 */
export async function toggleFacultyStatus(id: string, isActive: boolean): Promise<Faculty> {
  try {
    const { data, error } = await supabase
      .from("faculty")
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error toggling faculty status:", error);
      throw new Error(`Failed to update faculty status: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error in toggleFacultyStatus:", error);
    throw error;
  }
}

/**
 * Toggle faculty featured status
 */
export async function toggleFacultyFeatured(id: string, isFeatured: boolean): Promise<Faculty> {
  try {
    const { data, error } = await supabase
      .from("faculty")
      .update({ is_featured: isFeatured, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error toggling faculty featured status:", error);
      throw new Error(`Failed to update faculty featured status: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error in toggleFacultyFeatured:", error);
    throw error;
  }
}

/**
 * Update faculty sort order
 */
export async function updateFacultySortOrder(id: string, sortOrder: number): Promise<Faculty> {
  try {
    const { data, error } = await supabase
      .from("faculty")
      .update({ sort_order: sortOrder, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating faculty sort order:", error);
      throw new Error(`Failed to update faculty sort order: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error in updateFacultySortOrder:", error);
    throw error;
  }
}

/**
 * Bulk update faculty sort orders
 */
export async function bulkUpdateFacultySortOrders(
  updates: { id: string; sort_order: number }[]
): Promise<void> {
  try {
    const promises = updates.map(({ id, sort_order }) => updateFacultySortOrder(id, sort_order));

    await Promise.all(promises);
  } catch (error) {
    console.error("Error in bulkUpdateFacultySortOrders:", error);
    throw error;
  }
}

// ============================================
// PHOTO UPLOAD HELPERS
// ============================================

/**
 * Get public URL for faculty photo
 */
export function getPublicPhotoUrl(photoPath: string): string {
  if (!photoPath) return "";

  // If it's already a full URL, return as is
  if (photoPath.startsWith("http")) {
    return photoPath;
  }

  // Get public URL from Supabase storage
  const { data } = supabase.storage.from("faculty-images").getPublicUrl(photoPath);

  return data.publicUrl;
}

/**
 * Upload faculty photo to Supabase storage
 */
export async function uploadFacultyPhoto(file: File, facultyId: string): Promise<string> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${facultyId}-${Date.now()}.${fileExt}`;
    const filePath = `faculty-images/${fileName}`;

    const { data, error } = await supabase.storage.from("faculty-images").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      console.error("Error uploading faculty photo:", error);
      throw new Error(`Failed to upload photo: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("faculty-images").getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Error in uploadFacultyPhoto:", error);
    throw error;
  }
}

/**
 * Delete faculty photo from storage
 */
export async function deleteFacultyPhoto(photoUrl: string): Promise<void> {
  try {
    // Extract path from URL
    const url = new URL(photoUrl);
    const pathParts = url.pathname.split("/");
    const fileName = pathParts[pathParts.length - 1];
    const filePath = `faculty-images/${fileName}`;

    const { error } = await supabase.storage.from("faculty-images").remove([filePath]);

    if (error) {
      console.error("Error deleting faculty photo:", error);
      throw new Error(`Failed to delete photo: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in deleteFacultyPhoto:", error);
    throw error;
  }
}

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Validate faculty data before submission
 */
export function validateFacultyData(data: CreateFacultyData | UpdateFacultyData): string[] {
  const errors: string[] = [];

  // Required fields for creation
  if ("name" in data && !data.name?.trim()) {
    errors.push("Faculty name is required");
  }
  if ("designation" in data && !data.designation?.trim()) {
    errors.push("Designation is required");
  }
  if ("specialization" in data && (!data.specialization || data.specialization.length === 0)) {
    errors.push("At least one specialization is required");
  }
  if ("experience" in data && (data.experience === undefined || data.experience < 0)) {
    errors.push("Experience must be a non-negative number");
  }

  // Email validation
  if (data.email && data.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push("Please enter a valid email address");
    }
  }

  // URL validations
  const urlFields = [
    { field: "linkedin_url", name: "LinkedIn URL" },
    { field: "research_gate_url", name: "ResearchGate URL" },
    { field: "google_scholar_url", name: "Google Scholar URL" },
    { field: "personal_website", name: "Personal Website" },
  ];

  urlFields.forEach(({ field, name }) => {
    const url = data[field as keyof typeof data] as string;
    if (url && url.trim()) {
      try {
        new URL(url);
      } catch {
        errors.push(`${name} must be a valid URL`);
      }
    }
  });

  return errors;
}
