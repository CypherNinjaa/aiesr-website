import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

// Add runtime checks for Supabase env vars and log them for debugging
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase env vars missing:", {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey,
  });
  throw new Error(
    "Supabase client initialization failed: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing."
  );
}

if (!supabaseServiceRoleKey) {
  console.warn("SUPABASE_SERVICE_ROLE_KEY is missing. Admin features may not work.");
}

// Browser client for client-side operations
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Server client for server-side operations (with service role key)
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Database types (will be auto-generated from your schema)
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          short_description: string;
          date: string;
          end_date: string | null;
          location: string;
          type: "academic" | "cultural" | "research" | "workshop" | null; // Deprecated but kept for migration
          category_id: string | null; // New dynamic category reference
          image_url: string | null;
          registration_required: boolean;
          registration_link: string | null; // Legacy field for backward compatibility
          custom_registration_link: string | null; // New field for admin-defined registration links
          registration_deadline: string | null;
          featured: boolean;
          capacity: number | null;
          speakers: string[] | null;
          schedule: Json | null;
          tags: string[] | null;
          status: "draft" | "published" | "cancelled" | "completed";
          created_at: string;
          updated_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          short_description: string;
          date: string;
          end_date?: string | null;
          location: string;
          type?: "academic" | "cultural" | "research" | "workshop" | null; // Deprecated but kept for migration
          category_id?: string | null; // New dynamic category reference
          image_url?: string | null;
          registration_required?: boolean;
          registration_link?: string | null; // Legacy field for backward compatibility
          custom_registration_link?: string | null; // New field for admin-defined registration links
          registration_deadline?: string | null;
          featured?: boolean;
          capacity?: number | null;
          speakers?: string[] | null;
          schedule?: Json | null;
          tags?: string[] | null;
          status?: "draft" | "published" | "cancelled" | "completed";
          created_by: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          short_description?: string;
          date?: string;
          end_date?: string | null;
          location?: string;
          type?: "academic" | "cultural" | "research" | "workshop" | null; // Deprecated but kept for migration
          category_id?: string | null; // New dynamic category reference
          image_url?: string | null;
          registration_required?: boolean;
          registration_link?: string | null; // Legacy field for backward compatibility
          custom_registration_link?: string | null; // New field for admin-defined registration links
          registration_deadline?: string | null;
          featured?: boolean;
          capacity?: number | null;
          speakers?: string[] | null;
          schedule?: Json | null;
          tags?: string[] | null;
          status?: "draft" | "published" | "cancelled" | "completed";
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          color_class: string;
          icon_emoji: string;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          color_class?: string;
          icon_emoji?: string;
          is_active?: boolean;
          sort_order?: number;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          color_class?: string;
          icon_emoji?: string;
          is_active?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
      };
      event_categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          color: string;
          icon: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          color: string;
          icon?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          color?: string;
          icon?: string | null;
        };
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: "admin" | "super_admin";
          created_at: string;
          last_login: string | null;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          role?: "admin" | "super_admin";
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: "admin" | "super_admin";
          last_login?: string | null;
        };
      };
    };
  };
}
