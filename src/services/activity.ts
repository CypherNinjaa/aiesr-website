import { supabase } from "@/lib/supabase";

export interface ActivityLog {
  id: string;
  admin_id?: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  admin_users?: {
    email: string;
    name?: string;
  };
}

export interface ActivityLogFilters {
  action?: string;
  resource_type?: string;
  limit?: number;
  offset?: number;
}

class ActivityService {
  // Get activity logs with optional filters
  async getActivityLogs(filters: ActivityLogFilters = {}): Promise<{
    data: ActivityLog[];
    count: number;
  }> {
    let query = supabase
      .from("admin_activity_logs")
      .select(
        `
        *,
        admin_users (
          email,
          name
        )
      `
      )
      .order("created_at", { ascending: false });

    // Apply filters
    if (filters.action) {
      query = query.eq("action", filters.action);
    }

    if (filters.resource_type) {
      query = query.eq("resource_type", filters.resource_type);
    }

    // Get count for pagination
    const { count } = await supabase
      .from("admin_activity_logs")
      .select("*", { count: "exact", head: true });

    // Apply pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) throw error;

    return {
      data: data || [],
      count: count || 0,
    };
  }
  // Log a new activity
  async logActivity(
    action: string,
    resourceType?: string,
    resourceId?: string,
    details?: Record<string, unknown>
  ): Promise<ActivityLog> {
    const { data, error } = await supabase.rpc("log_admin_activity", {
      p_action: action,
      p_resource_type: resourceType,
      p_resource_id: resourceId,
      p_details: details,
    });

    if (error) throw error;

    // Fetch the created log with admin user info
    const { data: logData, error: fetchError } = await supabase
      .from("admin_activity_logs")
      .select(
        `
        *,
        admin_users (
          email,
          name
        )
      `
      )
      .eq("id", data)
      .single();

    if (fetchError) throw fetchError;

    return logData;
  }
  // Get activity statistics
  async getActivityStats(): Promise<{
    totalActivities: number;
    eventActivities: number;
    achievementActivities: number;
    systemActivities: number;
    userActivities: number;
    recentActivities: number; // last 24 hours
  }> {
    const { count: total } = await supabase
      .from("admin_activity_logs")
      .select("*", { count: "exact", head: true });

    const { count: events } = await supabase
      .from("admin_activity_logs")
      .select("*", { count: "exact", head: true })
      .eq("resource_type", "event");

    const { count: achievements } = await supabase
      .from("admin_activity_logs")
      .select("*", { count: "exact", head: true })
      .eq("resource_type", "achievement");

    const { count: system } = await supabase
      .from("admin_activity_logs")
      .select("*", { count: "exact", head: true })
      .in("action", ["login", "logout", "backup", "update", "system_action"]);

    const { count: users } = await supabase
      .from("admin_activity_logs")
      .select("*", { count: "exact", head: true })
      .in("action", ["login", "logout", "profile_update"]);

    // Recent activities (last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: recent } = await supabase
      .from("admin_activity_logs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", twentyFourHoursAgo);

    return {
      totalActivities: total || 0,
      eventActivities: events || 0,
      achievementActivities: achievements || 0,
      systemActivities: system || 0,
      userActivities: users || 0,
      recentActivities: recent || 0,
    };
  }

  // Get activities by resource type
  async getActivitiesByType(resourceType: string, limit = 10): Promise<ActivityLog[]> {
    const { data, error } = await supabase
      .from("admin_activity_logs")
      .select(
        `
        *,
        admin_users (
          email,
          name
        )
      `
      )
      .eq("resource_type", resourceType)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data || [];
  }
  // Delete old activity logs (for cleanup)
  async cleanupOldLogs(olderThanDays = 90): Promise<number> {
    const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000).toISOString();

    const { count, error } = await supabase
      .from("admin_activity_logs")
      .delete({ count: "exact" })
      .lt("created_at", cutoffDate);

    if (error) throw error;

    return count || 0;
  }
}

export const activityService = new ActivityService();
