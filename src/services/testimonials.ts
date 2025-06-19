import { supabase } from "@/lib/supabase";
import { DatabaseTestimonial, DatabaseTestimonialFormData, TestimonialStats } from "@/types";

export class TestimonialsService {
  // Get approved testimonials for public display
  static async getApprovedTestimonials(
    options: {
      is_featured?: boolean;
      academic_program?: string;
      graduation_year?: number;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<{ data: DatabaseTestimonial[]; count: number }> {
    try {
      let query = supabase
        .from("testimonials")
        .select("*", { count: "exact" })
        .eq("status", "approved")
        .order("sort_order", { ascending: true })
        .order("approved_at", { ascending: false });

      // Apply filters
      if (options.is_featured !== undefined) {
        query = query.eq("is_featured", options.is_featured);
      }

      if (options.academic_program) {
        query = query.eq("program", options.academic_program);
      }

      if (options.graduation_year) {
        query = query.eq("graduation_year", options.graduation_year);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return { data: data || [], count: count || 0 };
    } catch (error) {
      console.error("Error fetching approved testimonials:", error);
      throw error;
    }
  }
  // Get all testimonials for admin (including pending/rejected)
  static async getAllTestimonials(
    options: {
      status?: "pending" | "approved" | "rejected";
      academic_program?: string;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<{ data: DatabaseTestimonial[]; count: number }> {
    try {
      let query = supabase
        .from("testimonials")
        .select("*", { count: "exact" })
        .order("submitted_at", { ascending: false });

      // Apply filters
      if (options.status) {
        query = query.eq("status", options.status);
      }

      if (options.academic_program) {
        query = query.eq("program", options.academic_program);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return { data: data || [], count: count || 0 };
    } catch (error) {
      console.error("Error fetching all testimonials:", error);
      throw error;
    }
  } // Submit new testimonial (public)
  static async submitTestimonial(
    testimonialData: DatabaseTestimonialFormData
  ): Promise<DatabaseTestimonial> {
    try {
      console.log("Submitting testimonial:", testimonialData);

      const { data, error } = await supabase
        .from("testimonials")
        .insert({
          ...testimonialData,
          status: "pending",
          is_featured: false,
          sort_order: 0,
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw new Error(`Failed to submit testimonial: ${error.message}`);
      }

      console.log("Testimonial submitted successfully:", data);
      return data;
    } catch (error) {
      console.error("Error submitting testimonial:", error);

      // Better error handling for different types of errors
      if (error instanceof Error) {
        throw error;
      } else if (typeof error === "object" && error !== null) {
        throw new Error(`Submission failed: ${JSON.stringify(error)}`);
      } else {
        throw new Error("An unexpected error occurred while submitting your testimonial");
      }
    }
  }
  // Get testimonial by ID
  static async getTestimonialById(id: string): Promise<DatabaseTestimonial> {
    try {
      const { data, error } = await supabase.from("testimonials").select("*").eq("id", id).single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error fetching testimonial:", error);
      throw error;
    }
  } // Update testimonial (admin only)
  static async updateTestimonial(
    id: string,
    updates: Partial<DatabaseTestimonial>
  ): Promise<DatabaseTestimonial> {
    try {
      console.log("Updating testimonial:", { id, updates });

      const { data, error } = await supabase
        .from("testimonials")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Supabase error updating testimonial:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw new Error(`Failed to update testimonial: ${error.message}`);
      }

      console.log("Testimonial updated successfully:", data);
      return data;
    } catch (error) {
      console.error("Error updating testimonial:", error);

      if (error instanceof Error) {
        throw error;
      } else if (typeof error === "object" && error !== null) {
        throw new Error(`Update failed: ${JSON.stringify(error)}`);
      } else {
        throw new Error("An unexpected error occurred while updating the testimonial");
      }
    }
  }
  // Approve testimonial
  static async approveTestimonial(id: string, adminUserId: string): Promise<DatabaseTestimonial> {
    try {
      console.log("Approving testimonial:", { id, adminUserId });

      const { data, error } = await supabase
        .from("testimonials")
        .update({
          status: "approved",
          approved_at: new Date().toISOString(),
          approved_by: adminUserId,
          rejection_reason: null,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Supabase error approving testimonial:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw new Error(`Failed to approve testimonial: ${error.message}`);
      }

      console.log("Testimonial approved successfully:", data);
      return data;
    } catch (error) {
      console.error("Error approving testimonial:", error);

      if (error instanceof Error) {
        throw error;
      } else if (typeof error === "object" && error !== null) {
        throw new Error(`Approval failed: ${JSON.stringify(error)}`);
      } else {
        throw new Error("An unexpected error occurred while approving the testimonial");
      }
    }
  } // Reject testimonial
  static async rejectTestimonial(
    id: string,
    reason: string,
    adminUserId: string
  ): Promise<DatabaseTestimonial> {
    try {
      console.log("Rejecting testimonial:", { id, reason, adminUserId });

      const { data, error } = await supabase
        .from("testimonials")
        .update({
          status: "rejected",
          rejection_reason: reason,
          approved_by: adminUserId,
          approved_at: null,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Supabase error rejecting testimonial:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw new Error(`Failed to reject testimonial: ${error.message}`);
      }

      console.log("Testimonial rejected successfully:", data);
      return data;
    } catch (error) {
      console.error("Error rejecting testimonial:", error);

      if (error instanceof Error) {
        throw error;
      } else if (typeof error === "object" && error !== null) {
        throw new Error(`Rejection failed: ${JSON.stringify(error)}`);
      } else {
        throw new Error("An unexpected error occurred while rejecting the testimonial");
      }
    }
  }
  // Delete testimonial (admin only)
  static async deleteTestimonial(id: string): Promise<void> {
    try {
      console.log("Deleting testimonial:", id);

      const { error } = await supabase.from("testimonials").delete().eq("id", id);

      if (error) {
        console.error("Supabase error deleting testimonial:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw new Error(`Failed to delete testimonial: ${error.message}`);
      }

      console.log("Testimonial deleted successfully");
    } catch (error) {
      console.error("Error deleting testimonial:", error);

      if (error instanceof Error) {
        throw error;
      } else if (typeof error === "object" && error !== null) {
        throw new Error(`Delete failed: ${JSON.stringify(error)}`);
      } else {
        throw new Error("An unexpected error occurred while deleting the testimonial");
      }
    }
  }
  // Toggle featured status
  static async toggleFeatured(id: string): Promise<DatabaseTestimonial> {
    try {
      console.log("Toggling featured status for testimonial:", id);

      // First get current status
      const { data: current, error: fetchError } = await supabase
        .from("testimonials")
        .select("is_featured")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("Supabase error fetching current featured status:", {
          message: fetchError.message,
          details: fetchError.details,
          hint: fetchError.hint,
          code: fetchError.code,
        });
        throw new Error(`Failed to fetch testimonial: ${fetchError.message}`);
      }

      console.log(
        "Current featured status:",
        current.is_featured,
        "-> toggling to:",
        !current.is_featured
      );

      // Toggle the status
      const { data, error } = await supabase
        .from("testimonials")
        .update({ is_featured: !current.is_featured })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Supabase error updating featured status:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw new Error(`Failed to update featured status: ${error.message}`);
      }

      console.log("Featured status toggled successfully:", data);
      return data;
    } catch (error) {
      console.error("Error toggling featured status:", error);

      if (error instanceof Error) {
        throw error;
      } else if (typeof error === "object" && error !== null) {
        throw new Error(`Toggle featured failed: ${JSON.stringify(error)}`);
      } else {
        throw new Error("An unexpected error occurred while toggling featured status");
      }
    }
  }

  // Get testimonial statistics
  static async getTestimonialStats(): Promise<TestimonialStats> {
    try {
      const { data, error } = await supabase.from("testimonials").select("status, is_featured");

      if (error) throw error;

      const stats = data.reduce(
        (acc, testimonial) => {
          acc.total++;

          switch (testimonial.status) {
            case "pending":
              acc.pending++;
              break;
            case "approved":
              acc.approved++;
              break;
            case "rejected":
              acc.rejected++;
              break;
          }

          if (testimonial.is_featured) {
            acc.featured++;
          }

          return acc;
        },
        { total: 0, pending: 0, approved: 0, rejected: 0, featured: 0 }
      );

      return stats;
    } catch (error) {
      console.error("Error fetching testimonial stats:", error);
      throw error;
    }
  }

  // Get featured testimonials (for homepage)
  static async getFeaturedTestimonials(limit: number = 3): Promise<DatabaseTestimonial[]> {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("status", "approved")
        .eq("is_featured", true)
        .order("sort_order", { ascending: true })
        .order("approved_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error("Error fetching featured testimonials:", error);
      throw error;
    }
  }

  // Update sort order for testimonials
  static async updateSortOrder(testimonialIds: string[]): Promise<void> {
    try {
      const updates = testimonialIds.map((id, index) =>
        supabase.from("testimonials").update({ sort_order: index }).eq("id", id)
      );

      await Promise.all(updates);
    } catch (error) {
      console.error("Error updating sort order:", error);
      throw error;
    }
  }
}
