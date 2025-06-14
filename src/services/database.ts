import { supabase, supabaseAdmin, Database } from "@/lib/supabase";
import { Event } from "@/types";
import { activityService } from "./activity";
import { CategoryService } from "./category";

type EventRow = Database["public"]["Tables"]["events"]["Row"];
type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
type EventUpdate = Database["public"]["Tables"]["events"]["Update"];

// Extended types for new fields not yet in database schema
type ExtendedEventUpdate = EventUpdate & {
  registration_link?: string | null;
  custom_registration_link?: string | null;
  poster_image?: string | null;
  pdf_brochure?: string | null;
};

// Extended EventRow to include optional registration link fields for backward compatibility
type ExtendedEventRow = EventRow & {
  registration_link?: string | null;
  custom_registration_link?: string | null;
  poster_image?: string | null; // New poster image field
  pdf_brochure?: string | null; // New PDF brochure field
};

// Extended EventInsert for registration link fields
type ExtendedEventInsert = EventInsert & {
  registration_link?: string | null;
  custom_registration_link?: string | null;
  poster_image?: string | null; // New poster image field
  pdf_brochure?: string | null; // New PDF brochure field
};

// Transform database row to Event type
const transformEventFromDB = async (row: ExtendedEventRow): Promise<Event> => {
  let category = undefined;

  // Fetch category if category_id exists
  if (row.category_id) {
    category = await CategoryService.getCategoryById(row.category_id);
  }

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    shortDescription: row.short_description,
    date: new Date(row.date),
    endDate: row.end_date ? new Date(row.end_date) : undefined,
    location: row.location,
    type: row.type || undefined, // Deprecated but kept for migration    category_id: row.category_id || undefined,
    category: category || undefined,
    image: row.image_url || undefined,
    posterImage: row.poster_image || undefined, // New poster image field
    pdfBrochure: row.pdf_brochure || undefined, // New PDF brochure field
    registrationRequired: row.registration_required,
    registrationLink: row.registration_link || undefined, // Legacy field for backward compatibility
    customRegistrationLink: row.custom_registration_link || undefined, // New field for admin-defined links
    featured: row.featured,
    capacity: row.capacity || undefined,
    registeredCount: 0, // This would come from your external registration system
    speakers: row.speakers || undefined,
    schedule: (row.schedule as Event["schedule"]) || undefined,
    tags: row.tags || undefined,
    status: row.status,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    registrationDeadline: row.registration_deadline
      ? new Date(row.registration_deadline)
      : undefined,
  };
};

// Transform Event to database insert
const transformEventToDB = (event: Partial<Event> & { createdBy: string }): ExtendedEventInsert => {
  const baseData: EventInsert = {
    title: event.title!,
    description: event.description!,
    short_description: event.shortDescription!,
    date: event.date!.toISOString(),
    end_date: event.endDate?.toISOString() || null,
    location: event.location!,
    type: event.type || null, // Deprecated but kept for migration    category_id: event.category_id || null, // New dynamic category reference
    image_url: event.image || null,
    registration_required: event.registrationRequired ?? true,
    registration_deadline: event.registrationDeadline?.toISOString() || null,
    featured: event.featured ?? false,
    capacity: event.capacity || null,
    speakers: event.speakers || null,
    schedule:
      (event.schedule as Database["public"]["Tables"]["events"]["Insert"]["schedule"]) || null,
    tags: event.tags || null,
    status:
      (event as Event & { status: Database["public"]["Tables"]["events"]["Insert"]["status"] })
        .status || "draft",
    created_by: event.createdBy,
  };
  // Add registration link fields if they're provided (for migration compatibility)
  const extendedData: ExtendedEventInsert = {
    ...baseData,
    registration_link: event.registrationLink || null,
    custom_registration_link: event.customRegistrationLink || null,
    poster_image: event.posterImage || null, // New poster image field
    pdf_brochure: event.pdfBrochure || null, // New PDF brochure field
  };

  return extendedData;
};

// Event Management Functions
export class EventService {
  // Get all events with filters
  static async getEvents(filters?: {
    status?: string;
    type?: string;
    category_id?: string;
    featured?: boolean;
    upcoming?: boolean;
    limit?: number;
  }) {
    let query = supabase.from("events").select("*").order("date", { ascending: true });

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.type) {
      query = query.eq("type", filters.type);
    }

    if (filters?.category_id) {
      query = query.eq("category_id", filters.category_id);
    }

    if (filters?.featured !== undefined) {
      query = query.eq("featured", filters.featured);
    }
    if (filters?.upcoming) {
      // Use start of today to include events happening today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query = query.gte("date", today.toISOString());
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch events: ${error.message}`);
    }

    // Transform all events with categories
    const transformedEvents = await Promise.all(data.map(row => transformEventFromDB(row)));

    return transformedEvents;
  }

  // Get single event by ID
  static async getEvent(id: string) {
    const { data, error } = await supabase.from("events").select("*").eq("id", id).single();

    if (error) {
      throw new Error(`Failed to fetch event: ${error.message}`);
    }

    return transformEventFromDB(data);
  } // Create new event (Admin only)
  static async createEvent(event: Partial<Event> & { createdBy: string }) {
    const eventData = transformEventToDB(event);

    // Use admin client if available, otherwise fall back to regular client
    const client = supabaseAdmin || supabase;

    // Log some debugging information
    console.log("Creating event with client:", client === supabaseAdmin ? "admin" : "regular");
    console.log("Event data:", { title: eventData.title, createdBy: eventData.created_by });

    const { data, error } = await client.from("events").insert(eventData).select().single();

    if (error) {
      console.error("Event creation error:", error);
      throw new Error(`Failed to create event: ${error.message}`);
    }

    const createdEvent = await transformEventFromDB(data); // Log activity
    try {
      await activityService.logActivity(`create_event`, "event", createdEvent.id, {
        event_title: createdEvent.title,
        event_type: createdEvent.type,
        event_status: createdEvent.status,
        category_id: createdEvent.category_id,
      });
    } catch (logError) {
      console.error("Failed to log event creation activity:", logError);
      // Don't fail the entire operation if logging fails
    }

    return createdEvent;
  }

  // Update event (Admin only)
  static async updateEvent(id: string, updates: Partial<Event>) {
    // Get existing event for comparison
    let existingEvent: Event | null = null;
    try {
      existingEvent = await this.getEvent(id);
    } catch (error) {
      console.error("Failed to fetch existing event for activity logging:", error);
    }

    const updateData: ExtendedEventUpdate = {};

    if (updates.title) updateData.title = updates.title;
    if (updates.description) updateData.description = updates.description;
    if (updates.shortDescription) updateData.short_description = updates.shortDescription;
    if (updates.date) updateData.date = updates.date.toISOString();
    if (updates.endDate) updateData.end_date = updates.endDate.toISOString();
    if (updates.location) updateData.location = updates.location;
    if (updates.type) updateData.type = updates.type;
    if (updates.category_id !== undefined) updateData.category_id = updates.category_id;
    if (updates.image !== undefined) updateData.image_url = updates.image;
    if (updates.posterImage !== undefined) updateData.poster_image = updates.posterImage;
    if (updates.pdfBrochure !== undefined) updateData.pdf_brochure = updates.pdfBrochure;
    if (updates.registrationRequired !== undefined)
      updateData.registration_required = updates.registrationRequired;
    if (updates.registrationLink !== undefined)
      updateData.registration_link = updates.registrationLink;
    if (updates.customRegistrationLink !== undefined)
      updateData.custom_registration_link = updates.customRegistrationLink;
    if (updates.registrationDeadline)
      updateData.registration_deadline = updates.registrationDeadline.toISOString();
    if (updates.featured !== undefined) updateData.featured = updates.featured;
    if (updates.capacity !== undefined) updateData.capacity = updates.capacity;
    if (updates.speakers !== undefined) updateData.speakers = updates.speakers;
    if (updates.schedule !== undefined)
      updateData.schedule =
        updates.schedule as Database["public"]["Tables"]["events"]["Update"]["schedule"];
    if (updates.tags !== undefined) updateData.tags = updates.tags;
    if ((updates as Event & { status?: string }).status) {
      updateData.status = (
        updates as Event & { status: Database["public"]["Tables"]["events"]["Update"]["status"] }
      ).status;
    }
    updateData.updated_at = new Date().toISOString();

    // Use admin client to bypass RLS for admin operations
    const client = supabaseAdmin || supabase;
    const { data, error } = await client
      .from("events")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update event: ${error.message}`);
    }

    const updatedEvent = await transformEventFromDB(data);

    // Log activity
    try {
      // Determine what changed
      const changes: string[] = [];
      if (existingEvent) {
        if (updates.title && updates.title !== existingEvent.title) changes.push("title");
        if (updates.status && updates.status !== existingEvent.status) changes.push("status");
        if (updates.featured !== undefined && updates.featured !== existingEvent.featured)
          changes.push("featured");
        if (updates.date && updates.date.getTime() !== existingEvent.date.getTime())
          changes.push("date");
        if (updates.location && updates.location !== existingEvent.location)
          changes.push("location");
      }
      await activityService.logActivity(`update_event`, "event", updatedEvent.id, {
        event_title: updatedEvent.title,
        event_type: updatedEvent.type,
        event_status: updatedEvent.status,
        category_id: updatedEvent.category_id,
        changes: changes,
        previous_values: existingEvent
          ? {
              title: existingEvent.title,
              status: existingEvent.status,
              featured: existingEvent.featured,
            }
          : null,
      });
    } catch (logError) {
      console.error("Failed to log event update activity:", logError);
      // Don't fail the entire operation if logging fails
    }

    return updatedEvent;
  }

  // Delete event (Admin only)
  static async deleteEvent(id: string) {
    // Get existing event for logging
    let existingEvent: Event | null = null;
    try {
      existingEvent = await this.getEvent(id);
    } catch (error) {
      console.error("Failed to fetch existing event for activity logging:", error);
    }

    // Use admin client to bypass RLS for admin operations
    const client = supabaseAdmin || supabase;
    const { error } = await client.from("events").delete().eq("id", id);

    if (error) {
      throw new Error(`Failed to delete event: ${error.message}`);
    }

    // Log activity
    try {
      await activityService.logActivity(`delete_event`, "event", id, {
        event_title: existingEvent?.title,
        event_type: existingEvent?.type,
        event_status: existingEvent?.status,
        category_id: existingEvent?.category_id,
      });
    } catch (logError) {
      console.error("Failed to log event deletion activity:", logError);
      // Don't fail the entire operation if logging fails
    }

    return true;
  }

  // Get upcoming events
  static async getUpcomingEvents(limit = 10) {
    return this.getEvents({
      status: "published",
      upcoming: true,
      limit,
    });
  }

  // Get featured events
  static async getFeaturedEvents(limit = 3) {
    return this.getEvents({
      status: "published",
      featured: true,
      limit,
    });
  }

  // Get events by type
  static async getEventsByType(type: Event["type"], limit?: number) {
    return this.getEvents({
      status: "published",
      type,
      limit,
    });
  }

  // Real-time subscription for events
  static subscribeToEvents(callback: (events: Event[]) => void) {
    return supabase
      .channel("events-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
        },
        async () => {
          // Fetch updated events
          const events = await this.getEvents({ status: "published" });
          callback(events);
        }
      )
      .subscribe();
  }
}

// Category Management
// Admin Authentication
export class AdminService {
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(`Failed to sign in: ${error.message}`);
    }

    // Check if user is admin
    const { data: adminData, error: adminError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (adminError || !adminData) {
      await supabase.auth.signOut();
      throw new Error("Access denied: Not an admin user");
    }

    // Log successful login activity
    try {
      await activityService.logActivity(`admin_login`, "user", data.user.id, {
        email: adminData.email,
        name: adminData.name,
        role: adminData.role,
        login_time: new Date().toISOString(),
      });
    } catch (logError) {
      console.error("Failed to log login activity:", logError);
      // Don't fail the entire operation if logging fails
    }

    return { user: data.user, admin: adminData };
  }

  static async signOut() {
    // Get current user before signing out for logging
    let currentUser = null;
    try {
      currentUser = await this.getCurrentUser();
    } catch (error) {
      console.error("Failed to get current user for logout logging:", error);
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(`Failed to sign out: ${error.message}`);
    }

    // Log logout activity
    if (currentUser) {
      try {
        await activityService.logActivity(`admin_logout`, "user", currentUser.user.id, {
          email: currentUser.admin.email,
          name: currentUser.admin.name,
          role: currentUser.admin.role,
          logout_time: new Date().toISOString(),
        });
      } catch (logError) {
        console.error("Failed to log logout activity:", logError);
        // Don't fail the entire operation if logging fails
      }
    }
  }

  static async getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: adminData } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", user.id)
      .single();

    return adminData ? { user, admin: adminData } : null;
  }
}
