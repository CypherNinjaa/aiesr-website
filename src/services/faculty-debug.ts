// ============================================
// FACULTY SERVICE DEBUG VERSION
// Simplified version to help diagnose issues
// ============================================

import { supabase } from "@/lib/supabase";

// Simple test function to check basic connectivity
export async function testFacultyConnection() {
  try {
    console.log("Testing Supabase connection...");
    // Test 1: Basic connection
    const { error: connectionError } = await supabase.from("faculty").select("count").limit(1);

    if (connectionError) {
      console.error("Connection test failed:", connectionError);
      return { success: false, error: connectionError };
    }

    console.log("Connection test passed");

    // Test 2: Count records
    const { count, error: countError } = await supabase
      .from("faculty")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.error("Count test failed:", countError);
      return { success: false, error: countError };
    }

    console.log(`Count test passed: ${count} records found`);

    // Test 3: Simple select
    const { data: selectData, error: selectError } = await supabase
      .from("faculty")
      .select("id, name, designation")
      .limit(3);

    if (selectError) {
      console.error("Select test failed:", selectError);
      return { success: false, error: selectError };
    }

    console.log("Select test passed:", selectData);

    return {
      success: true,
      recordCount: count,
      sampleData: selectData,
    };
  } catch (error) {
    console.error("Test failed with exception:", error);
    return { success: false, error };
  }
}

// Simplified getAllFacultyAdmin function
export async function getAllFacultyAdminDebug() {
  try {
    console.log("Starting getAllFacultyAdmin..."); // First, test the connection
    const connectionTest = await testFacultyConnection();
    if (!connectionTest.success) {
      const errorMsg =
        connectionTest.error &&
        typeof connectionTest.error === "object" &&
        "message" in connectionTest.error
          ? (connectionTest.error as Error).message
          : "Unknown connection error";
      throw new Error(`Connection test failed: ${errorMsg}`);
    }

    console.log("Connection successful, fetching all faculty...");

    const { data, error } = await supabase
      .from("faculty")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error in getAllFacultyAdmin:", error);
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      throw new Error(`Failed to fetch faculty: ${error.message} (Code: ${error.code})`);
    }

    console.log("Successfully fetched faculty:", data?.length || 0, "records");
    return data || [];
  } catch (error) {
    console.error("Exception in getAllFacultyAdmin:", error);
    throw error;
  }
}
