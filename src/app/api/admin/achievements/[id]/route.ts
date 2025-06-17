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

// GET /api/admin/achievements/[id] - Get single achievement
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Admin client not configured" }, { status: 500 });
    }

    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from("achievements")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching achievement:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in GET /api/admin/achievements/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/admin/achievements/[id] - Update achievement
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Admin client not configured" }, { status: 500 });
    }

    const { id } = await params;
    const body = await request.json();

    // Get the original data for comparison
    const { data: originalData } = await supabaseAdmin
      .from("achievements")
      .select("*")
      .eq("id", id)
      .single();

    const { data, error } = await supabaseAdmin
      .from("achievements")
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating achievement:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log the activity
    await logActivity("update", "achievement", id, {
      title: data.title,
      achiever_name: data.achiever_name,
      achiever_type: data.achiever_type,
      status: data.status,
      changes: {
        from: originalData
          ? {
              title: originalData.title,
              status: originalData.status,
            }
          : null,
        to: {
          title: data.title,
          status: data.status,
        },
      },
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in PUT /api/admin/achievements/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/achievements/[id] - Delete achievement
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Admin client not configured" }, { status: 500 });
    }

    const { id } = await params;

    // Get the achievement data before deletion for logging
    const { data: achievementData } = await supabaseAdmin
      .from("achievements")
      .select("*")
      .eq("id", id)
      .single();

    const { error } = await supabaseAdmin.from("achievements").delete().eq("id", id);

    if (error) {
      console.error("Error deleting achievement:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log the activity
    await logActivity("delete", "achievement", id, {
      title: achievementData?.title,
      achiever_name: achievementData?.achiever_name,
      achiever_type: achievementData?.achiever_type,
      status: achievementData?.status,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/admin/achievements/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
