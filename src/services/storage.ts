import { supabase } from "@/lib/supabase";

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  path?: string;
}

export class StorageService {
  /**
   * Upload an image file to Supabase Storage
   * @param file - The file to upload
   * @param bucket - The storage bucket name (default: 'event-images')
   * @param folder - Optional folder within the bucket
   * @returns Promise with upload result
   */
  static async uploadImage(
    file: File,
    bucket: string = "event-images",
    folder?: string
  ): Promise<UploadResult> {
    try {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        return {
          success: false,
          error: "Please select a valid image file (JPG, PNG, GIF, WebP)",
        };
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        return {
          success: false,
          error: "Image size must be less than 10MB",
        };
      }

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName; // Upload file to Supabase Storage
      console.log("Attempting to upload to bucket:", bucket, "path:", filePath);
      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (error) {
        console.error("Storage upload error:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        console.error(
          "Bucket:",
          bucket,
          "Path:",
          filePath,
          "File size:",
          file.size,
          "File type:",
          file.type
        );
        return {
          success: false,
          error: `Upload failed: ${error.message}`,
        };
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);

      return {
        success: true,
        url: urlData.publicUrl,
        path: data.path,
      };
    } catch (error) {
      console.error("Upload error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      };
    }
  }

  /**
   * Delete an image from Supabase Storage
   * @param path - The file path in storage
   * @param bucket - The storage bucket name
   * @returns Promise with deletion result
   */
  static async deleteImage(
    path: string,
    bucket: string = "event-images"
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage.from(bucket).remove([path]);

      if (error) {
        console.error("Storage delete error:", error);
        return {
          success: false,
          error: `Delete failed: ${error.message}`,
        };
      }

      return { success: true };
    } catch (error) {
      console.error("Delete error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Delete failed",
      };
    }
  }

  /**
   * Get the public URL for a storage file
   * @param path - The file path in storage
   * @param bucket - The storage bucket name
   * @returns The public URL
   */
  static getPublicUrl(path: string, bucket: string = "event-images"): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    return data.publicUrl;
  }

  /**
   * Validate image URL (for URL input method)
   * @param url - The image URL to validate
   * @returns Promise with validation result
   */
  static async validateImageUrl(url: string): Promise<{
    valid: boolean;
    error?: string;
  }> {
    try {
      const response = await fetch(url, { method: "HEAD" });

      if (!response.ok) {
        return {
          valid: false,
          error: "Image URL is not accessible",
        };
      }

      const contentType = response.headers.get("content-type");
      if (!contentType?.startsWith("image/")) {
        return {
          valid: false,
          error: "URL does not point to a valid image",
        };
      }

      return { valid: true };
    } catch (_error) {
      return {
        valid: false,
        error: "Invalid image URL",
      };
    }
  }

  /**
   * Generate optimized image URL with transformations
   * @param url - The base image URL
   * @param options - Transformation options
   * @returns Optimized image URL
   */
  static getOptimizedImageUrl(
    url: string,
    options?: {
      width?: number;
      height?: number;
      quality?: number;
      format?: "webp" | "jpg" | "png";
    }
  ): string {
    // If it's a Supabase storage URL, we can add transformations
    if (url.includes("supabase")) {
      const params = new URLSearchParams();

      if (options?.width) params.append("width", options.width.toString());
      if (options?.height) params.append("height", options.height.toString());
      if (options?.quality) params.append("quality", options.quality.toString());
      if (options?.format) params.append("format", options.format);

      const queryString = params.toString();
      return queryString ? `${url}?${queryString}` : url;
    }

    // Return original URL for external images
    return url;
  }

  /**
   * Upload a testimonial photo with validation and optimized settings
   * @param file - The photo file to upload
   * @param testimonialId - Optional testimonial ID for organizing files
   * @returns Promise with upload result including optimized URLs
   */
  static async uploadTestimonialPhoto(
    file: File,
    testimonialId?: string
  ): Promise<UploadResult & { thumbnailUrl?: string }> {
    try {
      // Validate file specifically for testimonials
      const validationError = this.validateTestimonialPhoto(file);
      if (validationError) {
        return { success: false, error: validationError };
      }

      // Generate filename for testimonial photo
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const timestamp = Date.now();
      const fileName = testimonialId
        ? `${testimonialId}_${timestamp}.${fileExt}`
        : `temp_${timestamp}.${fileExt}`;

      // Organize into folders
      const folder = testimonialId ? "approved" : "pending";
      const filePath = `${folder}/${fileName}`;

      console.log("Uploading testimonial photo:", { fileName, filePath, size: file.size });

      // Upload to testimonial-photos bucket
      const { data, error } = await supabase.storage
        .from("testimonial-photos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (error) {
        console.error("Testimonial photo upload error:", error);
        return {
          success: false,
          error: `Upload failed: ${error.message}`,
        };
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("testimonial-photos")
        .getPublicUrl(filePath);

      if (!publicUrlData.publicUrl) {
        return {
          success: false,
          error: "Failed to get public URL for uploaded photo",
        };
      }

      console.log("Testimonial photo uploaded successfully:", {
        path: data.path,
        url: publicUrlData.publicUrl,
      });

      // Generate thumbnail URL (optimized for profile display)
      const thumbnailUrl = this.getOptimizedImageUrl(publicUrlData.publicUrl, {
        width: 150,
        height: 150,
        quality: 80,
        format: "webp",
      });

      return {
        success: true,
        url: publicUrlData.publicUrl,
        path: data.path,
        thumbnailUrl,
      };
    } catch (error) {
      console.error("Error uploading testimonial photo:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      };
    }
  }

  /**
   * Move testimonial photo from pending to approved folder
   * @param currentPath - Current file path in storage
   * @param testimonialId - Testimonial ID for the new filename
   * @returns Promise with new URL
   */
  static async approveTestimonialPhoto(
    currentPath: string,
    testimonialId: string
  ): Promise<UploadResult> {
    try {
      // Extract filename and extension
      const filename = currentPath.split("/").pop();
      if (!filename) {
        return { success: false, error: "Invalid file path" };
      }

      const fileExt = filename.split(".").pop();
      const newFileName = `${testimonialId}_approved.${fileExt}`;
      const newPath = `approved/${newFileName}`; // Move file from pending to approved
      const { error } = await supabase.storage
        .from("testimonial-photos")
        .move(currentPath, newPath);

      if (error) {
        console.error("Error moving testimonial photo:", error);
        return {
          success: false,
          error: `Failed to approve photo: ${error.message}`,
        };
      }

      // Get new public URL
      const { data: publicUrlData } = supabase.storage
        .from("testimonial-photos")
        .getPublicUrl(newPath);

      return {
        success: true,
        url: publicUrlData.publicUrl,
        path: newPath,
      };
    } catch (error) {
      console.error("Error approving testimonial photo:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Approval failed",
      };
    }
  }

  /**
   * Delete testimonial photo from storage
   * @param filePath - Path to the file in storage
   * @returns Promise with result
   */
  static async deleteTestimonialPhoto(filePath: string): Promise<UploadResult> {
    try {
      const { error } = await supabase.storage.from("testimonial-photos").remove([filePath]);

      if (error) {
        console.error("Error deleting testimonial photo:", error);
        return {
          success: false,
          error: `Failed to delete photo: ${error.message}`,
        };
      }

      console.log("Testimonial photo deleted successfully:", filePath);
      return { success: true };
    } catch (error) {
      console.error("Error deleting testimonial photo:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Deletion failed",
      };
    }
  }
  /**
   * Validate testimonial photo file
   * @param file - File to validate
   * @returns Error message if invalid, null if valid
   */
  private static validateTestimonialPhoto(file: File): string | null {
    // Check file type - be more restrictive for testimonials
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return "Please upload a JPG, PNG, or WebP image for your photo";
    }

    // Check file size - 5MB limit for testimonials
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return "Photo size must be less than 5MB";
    }

    // For testimonials, we'll do basic validation only
    // Advanced dimension checking can be added later if needed
    return null;
  }

  /**
   * Extract file path from testimonial photo URL
   * @param publicUrl - Public URL from Supabase storage
   * @returns File path within the bucket
   */
  static extractTestimonialPhotoPath(publicUrl: string): string | null {
    try {
      const url = new URL(publicUrl);
      const pathParts = url.pathname.split("/");
      const bucketIndex = pathParts.indexOf("testimonial-photos");

      if (bucketIndex === -1) {
        return null;
      }

      return pathParts.slice(bucketIndex + 1).join("/");
    } catch (error) {
      console.error("Error extracting file path from URL:", error);
      return null;
    }
  }
}
