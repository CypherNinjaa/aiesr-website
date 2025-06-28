import { supabase } from "@/lib/supabase";
import {
  Sponsor,
  EventSponsor,
  CreateSponsorData,
  UpdateSponsorData,
  CreateEventSponsorData,
} from "@/types";

export class SponsorService {
  // ==========================================
  // SPONSOR MANAGEMENT
  // ==========================================

  /**
   * Get all sponsors with optional filtering
   */
  static async getSponsors(options?: {
    status?: "active" | "inactive";
    tier?: string;
    limit?: number;
    offset?: number;
  }): Promise<Sponsor[]> {
    try {
      let query = supabase
        .from("sponsors")
        .select("*")
        .order("tier", { ascending: true })
        .order("name", { ascending: true });

      if (options?.status) {
        query = query.eq("status", options.status);
      }

      if (options?.tier) {
        query = query.eq("tier", options.tier);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching sponsors:", error);
        throw new Error(`Failed to fetch sponsors: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error("SponsorService.getSponsors error:", error);
      throw error;
    }
  }

  /**
   * Get a specific sponsor by ID
   */
  static async getSponsor(id: string): Promise<Sponsor | null> {
    try {
      const { data, error } = await supabase.from("sponsors").select("*").eq("id", id).single();

      if (error) {
        if (error.code === "PGRST116") {
          return null; // Not found
        }
        console.error("Error fetching sponsor:", error);
        throw new Error(`Failed to fetch sponsor: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("SponsorService.getSponsor error:", error);
      throw error;
    }
  }

  /**
   * Create a new sponsor
   */
  static async createSponsor(sponsorData: CreateSponsorData): Promise<Sponsor> {
    try {
      const { data, error } = await supabase
        .from("sponsors")
        .insert([
          {
            ...sponsorData,
            status: sponsorData.status || "active",
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating sponsor:", error);
        throw new Error(`Failed to create sponsor: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("SponsorService.createSponsor error:", error);
      throw error;
    }
  }

  /**
   * Update an existing sponsor
   */
  static async updateSponsor(id: string, updates: UpdateSponsorData): Promise<Sponsor> {
    try {
      const { data, error } = await supabase
        .from("sponsors")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating sponsor:", error);
        throw new Error(`Failed to update sponsor: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("SponsorService.updateSponsor error:", error);
      throw error;
    }
  }

  /**
   * Delete a sponsor
   */
  static async deleteSponsor(id: string): Promise<void> {
    try {
      const { error } = await supabase.from("sponsors").delete().eq("id", id);

      if (error) {
        console.error("Error deleting sponsor:", error);
        throw new Error(`Failed to delete sponsor: ${error.message}`);
      }
    } catch (error) {
      console.error("SponsorService.deleteSponsor error:", error);
      throw error;
    }
  }

  // ==========================================
  // EVENT SPONSOR MANAGEMENT
  // ==========================================

  /**
   * Get sponsors for a specific event
   */
  static async getEventSponsors(eventId: string): Promise<EventSponsor[]> {
    try {
      const { data, error } = await supabase
        .from("event_sponsors")
        .select(
          `
          *,
          sponsor:sponsors(*)
        `
        )
        .eq("event_id", eventId)
        .order("display_order", { ascending: true })
        .order("is_featured", { ascending: false });

      if (error) {
        console.error("Error fetching event sponsors:", error);
        throw new Error(`Failed to fetch event sponsors: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error("SponsorService.getEventSponsors error:", error);
      throw error;
    }
  }

  /**
   * Add a sponsor to an event
   */
  static async addEventSponsor(eventSponsorData: CreateEventSponsorData): Promise<EventSponsor> {
    try {
      // Get the highest display order for this event
      const { data: existingSponsors } = await supabase
        .from("event_sponsors")
        .select("display_order")
        .eq("event_id", eventSponsorData.event_id)
        .order("display_order", { ascending: false })
        .limit(1);

      const nextOrder =
        existingSponsors && existingSponsors.length > 0 ? existingSponsors[0].display_order + 1 : 0;

      const { data, error } = await supabase
        .from("event_sponsors")
        .insert([
          {
            ...eventSponsorData,
            display_order: eventSponsorData.display_order ?? nextOrder,
            sponsor_tier: eventSponsorData.sponsor_tier || "bronze",
            is_featured: eventSponsorData.is_featured || false,
          },
        ])
        .select(
          `
          *,
          sponsor:sponsors(*)
        `
        )
        .single();

      if (error) {
        console.error("Error adding event sponsor:", error);
        throw new Error(`Failed to add event sponsor: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("SponsorService.addEventSponsor error:", error);
      throw error;
    }
  }

  /**
   * Update an event sponsor
   */
  static async updateEventSponsor(
    id: string,
    updates: Partial<CreateEventSponsorData>
  ): Promise<EventSponsor> {
    try {
      const { data, error } = await supabase
        .from("event_sponsors")
        .update(updates)
        .eq("id", id)
        .select(
          `
          *,
          sponsor:sponsors(*)
        `
        )
        .single();

      if (error) {
        console.error("Error updating event sponsor:", error);
        throw new Error(`Failed to update event sponsor: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("SponsorService.updateEventSponsor error:", error);
      throw error;
    }
  }

  /**
   * Remove a sponsor from an event
   */
  static async removeEventSponsor(id: string): Promise<void> {
    try {
      const { error } = await supabase.from("event_sponsors").delete().eq("id", id);

      if (error) {
        console.error("Error removing event sponsor:", error);
        throw new Error(`Failed to remove event sponsor: ${error.message}`);
      }
    } catch (error) {
      console.error("SponsorService.removeEventSponsor error:", error);
      throw error;
    }
  }

  /**
   * Reorder event sponsors
   */
  static async reorderEventSponsors(eventId: string, sponsorIds: string[]): Promise<void> {
    try {
      const updates = sponsorIds.map((id, index) =>
        supabase.from("event_sponsors").update({ display_order: index }).eq("id", id)
      );

      const results = await Promise.all(updates);

      for (const result of results) {
        if (result.error) {
          console.error("Error reordering sponsors:", result.error);
          throw new Error(`Failed to reorder sponsors: ${result.error.message}`);
        }
      }
    } catch (error) {
      console.error("SponsorService.reorderEventSponsors error:", error);
      throw error;
    }
  }

  // ==========================================
  // SEARCH AND FILTER
  // ==========================================

  /**
   * Search sponsors by name
   */
  static async searchSponsors(query: string): Promise<Sponsor[]> {
    try {
      const { data, error } = await supabase
        .from("sponsors")
        .select("*")
        .ilike("name", `%${query}%`)
        .eq("status", "active")
        .order("name", { ascending: true })
        .limit(10);

      if (error) {
        console.error("Error searching sponsors:", error);
        throw new Error(`Failed to search sponsors: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error("SponsorService.searchSponsors error:", error);
      throw error;
    }
  }

  /**
   * Get sponsors grouped by tier
   */
  static async getSponsorsByTier(): Promise<Record<string, Sponsor[]>> {
    try {
      const sponsors = await this.getSponsors({ status: "active" });

      const grouped = sponsors.reduce(
        (acc, sponsor) => {
          if (!acc[sponsor.tier]) {
            acc[sponsor.tier] = [];
          }
          acc[sponsor.tier].push(sponsor);
          return acc;
        },
        {} as Record<string, Sponsor[]>
      );

      return grouped;
    } catch (error) {
      console.error("SponsorService.getSponsorsByTier error:", error);
      throw error;
    }
  }
}
