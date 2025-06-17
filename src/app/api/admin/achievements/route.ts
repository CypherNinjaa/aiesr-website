import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Helper function to log activity
async function logActivity(
  action: string,
  resourceType: string,
  resourceId?: string,
  details?: Record<string, unknown>
) {
  try {
    if (!supabaseAdmin) return;

    await supabaseAdmin.rpc("log_admin_activity", {
      p_action: action,
      p_resource_type: resourceType,
      p_resource_id: resourceId,
      p_details: details,
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
    // Don't throw - activity logging is not critical
  }
}

// GET /api/admin/achievements - Get all achievements (admin)
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Admin client not configured" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const achiever_type = searchParams.get("achiever_type");
    const is_featured = searchParams.get("is_featured");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    let query = supabaseAdmin
      .from("achievements")
      .select("*", { count: "exact" })
      .order("sort_order", { ascending: true })
      .order("date_achieved", { ascending: false });

    // Apply filters
    if (status) query = query.eq("status", status);
    if (category) query = query.eq("category", category);
    if (achiever_type) query = query.eq("achiever_type", achiever_type);
    if (is_featured !== null) query = query.eq("is_featured", is_featured === "true");
    if (limit) query = query.limit(parseInt(limit));
    if (offset) {
      const offsetNum = parseInt(offset);
      const limitNum = parseInt(limit || "10");
      query = query.range(offsetNum, offsetNum + limitNum - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching achievements:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data || [], count: count || 0 });
  } catch (error) {
    console.error("Error in GET /api/admin/achievements:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/admin/achievements - Create new achievement
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Admin client not configured" }, { status: 500 });
    }
    const body = await request.json();

    // Generate a UUID for created_by since we don't have authentication yet
    // In a real app, you'd get this from the authenticated user
    const userId = crypto.randomUUID();

    const { data, error } = await supabaseAdmin
      .from("achievements")
      .insert({
        ...body,
        created_by: userId,
        sort_order: body.sort_order || 0,
        status: body.status || "draft",
        is_featured: body.is_featured || false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating achievement:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log the activity
    await logActivity("create", "achievement", data.id, {
      title: data.title,
      achiever_name: data.achiever_name,
      achiever_type: data.achiever_type,
      status: data.status,
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in POST /api/admin/achievements:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
