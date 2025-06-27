// ============================================
// GALLERY SLIDER SERVICE - Database operations for homepage gallery
// ============================================

import { supabase } from "@/lib/supabase";
import type { GallerySlide, CreateGallerySlideData, UpdateGallerySlideData } from "@/types";

export class GalleryService {
  // Get all active gallery slides for public display
  static async getActiveSlides(): Promise<GallerySlide[]> {
    const { data, error } = await supabase
      .from("gallery_slides")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching gallery slides:", error);
      throw new Error(`Failed to load gallery slides: ${error.message}`);
    }

    return data || [];
  }

  // Get all gallery slides for admin management
  static async getAllSlides(): Promise<GallerySlide[]> {
    const { data, error } = await supabase
      .from("gallery_slides")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching all gallery slides:", error);
      throw new Error(`Failed to load gallery slides: ${error.message}`);
    }

    return data || [];
  }

  // Get a single gallery slide by ID
  static async getSlideById(id: string): Promise<GallerySlide | null> {
    const { data, error } = await supabase.from("gallery_slides").select("*").eq("id", id).single();

    if (error) {
      if (error.code === "PGRST116") return null; // Not found
      console.error("Error fetching gallery slide:", error);
      throw new Error(`Failed to load gallery slide: ${error.message}`);
    }

    return data;
  }

  // Create a new gallery slide
  static async createSlide(slideData: CreateGallerySlideData): Promise<GallerySlide> {
    const { data, error } = await supabase
      .from("gallery_slides")
      .insert([
        {
          ...slideData,
          sort_order: slideData.sort_order ?? 0,
          is_active: slideData.is_active ?? true,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating gallery slide:", error);
      throw new Error(`Failed to create gallery slide: ${error.message}`);
    }

    return data;
  }

  // Update an existing gallery slide
  static async updateSlide(id: string, slideData: UpdateGallerySlideData): Promise<GallerySlide> {
    const { data, error } = await supabase
      .from("gallery_slides")
      .update(slideData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating gallery slide:", error);
      throw new Error(`Failed to update gallery slide: ${error.message}`);
    }

    return data;
  }

  // Delete a gallery slide
  static async deleteSlide(id: string): Promise<void> {
    const { error } = await supabase.from("gallery_slides").delete().eq("id", id);

    if (error) {
      console.error("Error deleting gallery slide:", error);
      throw new Error(`Failed to delete gallery slide: ${error.message}`);
    }
  }

  // Toggle slide active status
  static async toggleSlideStatus(id: string, isActive: boolean): Promise<GallerySlide> {
    const { data, error } = await supabase
      .from("gallery_slides")
      .update({ is_active: isActive })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error toggling slide status:", error);
      throw new Error(`Failed to toggle slide status: ${error.message}`);
    }

    return data;
  }

  // Reorder slides
  static async reorderSlides(slideOrders: { id: string; sort_order: number }[]): Promise<void> {
    const updates = slideOrders.map(({ id, sort_order }) =>
      supabase.from("gallery_slides").update({ sort_order }).eq("id", id)
    );

    const results = await Promise.allSettled(updates);
    const failed = results.filter(result => result.status === "rejected");

    if (failed.length > 0) {
      console.error("Error reordering slides:", failed);
      throw new Error("Failed to reorder some slides");
    }
  }

  // Upload image to Supabase storage (for file uploads)
  static async uploadImage(file: File, fileName?: string): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const finalFileName = fileName || `gallery-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("gallery-images")
      .upload(finalFileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading image:", error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Get public URL
    const { data: publicData } = supabase.storage.from("gallery-images").getPublicUrl(data.path);

    return publicData.publicUrl;
  }

  // Delete image from storage
  static async deleteImage(imageUrl: string): Promise<void> {
    // Extract file path from URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split("/");
    const fileName = pathParts[pathParts.length - 1];

    const { error } = await supabase.storage.from("gallery-images").remove([fileName]);

    if (error) {
      console.error("Error deleting image:", error);
      // Don't throw error for image deletion as it's not critical
    }
  }

  // Get storage usage statistics
  static async getStorageStats(): Promise<{ count: number; size: number }> {
    const { data, error } = await supabase.storage.from("gallery-images").list();

    if (error) {
      console.error("Error getting storage stats:", error);
      return { count: 0, size: 0 };
    }

    const count = data?.length || 0;
    const size = data?.reduce((total, file) => total + (file.metadata?.size || 0), 0) || 0;

    return { count, size };
  }
}
