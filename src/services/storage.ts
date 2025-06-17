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
}
