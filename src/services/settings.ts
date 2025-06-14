import { supabase } from "@/lib/supabase";
import { activityService } from "./activity";

// Define the possible setting value types
export type SettingValue = string | number | boolean | string[] | Record<string, string>;

export interface AdminSetting {
  id: string;
  key: string;
  value: SettingValue;
  description?: string;
  category: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  updated_by?: string;
}

export interface SettingsData {
  siteName: string;
  siteUrl: string;
  defaultRegistrationUrl: string;
  emailNotifications: boolean;
  autoPublishEvents: boolean;
  allowGuestRegistration: boolean;
  maintenanceMode: boolean;
  maxEventsPerPage: number;
  heroTexts: string[];
  contactEmail: string;
  admissionsEmail: string;
  contactPhones: string[];
  contactAddress: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zipCode: string;
  };
  supportHours: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
}

class SettingsService {
  // Get all settings
  async getAllSettings(): Promise<AdminSetting[]> {
    const { data, error } = await supabase
      .from("admin_settings")
      .select("*")
      .order("category, key");

    if (error) throw error;
    return data || [];
  }

  // Get settings by category
  async getSettingsByCategory(category: string): Promise<AdminSetting[]> {
    const { data, error } = await supabase
      .from("admin_settings")
      .select("*")
      .eq("category", category)
      .order("key");

    if (error) throw error;
    return data || [];
  }

  // Get a single setting by key
  async getSetting(key: string): Promise<AdminSetting | null> {
    const { data, error } = await supabase
      .from("admin_settings")
      .select("*")
      .eq("key", key)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  }
  // Update a setting
  async updateSetting(key: string, value: SettingValue): Promise<AdminSetting> {
    const { data, error } = await supabase
      .from("admin_settings")
      .update({ value })
      .eq("key", key)
      .select()
      .single();

    if (error) throw error;
    return data;
  } // Update multiple settings with upsert
  async updateSettings(settings: Record<string, SettingValue>): Promise<void> {
    const updates = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
      description: `Setting for ${key}`,
      category: "general",
      is_public: true, // Default to public for main settings
    }));

    const { error } = await supabase.from("admin_settings").upsert(updates, { onConflict: "key" });

    if (error) throw error;

    // Log activity for each setting update
    try {
      for (const [key, value] of Object.entries(settings)) {
        await activityService.logActivity("updated", "setting", undefined, {
          key,
          new_value: value,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (logError) {
      // Don't fail the main operation if logging fails
      console.warn("Failed to log settings activity:", logError);
    }
  }

  // Create a new setting
  async createSetting(
    key: string,
    value: SettingValue,
    description?: string,
    category: string = "general",
    isPublic: boolean = false
  ): Promise<AdminSetting> {
    const { data, error } = await supabase
      .from("admin_settings")
      .insert({
        key,
        value,
        description,
        category,
        is_public: isPublic,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete a setting
  async deleteSetting(key: string): Promise<void> {
    const { error } = await supabase.from("admin_settings").delete().eq("key", key);

    if (error) throw error;
  } // Get formatted settings data for the UI
  async getFormattedSettings(): Promise<SettingsData> {
    const settings = await this.getAllSettings();
    const settingsMap = settings.reduce(
      (acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      },
      {} as Record<string, SettingValue>
    );
    return {
      siteName:
        (settingsMap.site_name as string) ||
        "AIESR - Amity Institute of English Studies & Research",
      siteUrl: (settingsMap.site_url as string) || "https://aiesr-website.vercel.app",
      defaultRegistrationUrl: (settingsMap.default_registration_url as string) || "",
      emailNotifications: (settingsMap.email_notifications as boolean) ?? true,
      autoPublishEvents: (settingsMap.auto_publish_events as boolean) ?? false,
      allowGuestRegistration: (settingsMap.allow_guest_registration as boolean) ?? true,
      maintenanceMode: (settingsMap.maintenance_mode as boolean) ?? false,
      maxEventsPerPage: (settingsMap.max_events_per_page as number) || 10,
      heroTexts: (settingsMap.hero_texts as string[]) || [
        "Where Words Come Alive",
        "Craft Your Literary Legacy",
        "Discover the Power of Language",
        "Shape Your Future in Literature",
      ],
      contactEmail: (settingsMap.contact_email as string) || "info@aiesr.edu",
      admissionsEmail: (settingsMap.admissions_email as string) || "admissions@aiesr.amity.edu",
      contactPhones: (settingsMap.contact_phones as string[]) || [
        "+91 612 2346789",
        "+91 612 2346790",
      ],
      contactAddress: (settingsMap.contact_address as {
        line1: string;
        line2: string;
        city: string;
        state: string;
        zipCode: string;
      }) || {
        line1: "Amity University Campus",
        line2: "Patna, Bihar",
        city: "Patna",
        state: "Bihar",
        zipCode: "800014",
      },
      supportHours: (settingsMap.support_hours as string) || "9 AM - 6 PM, Monday to Saturday",
      socialMedia: (settingsMap.social_media as {
        facebook: string;
        twitter: string;
        instagram: string;
        linkedin: string;
      }) || {
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: "",
      },
    };
  }
  // Save formatted settings data
  async saveFormattedSettings(data: SettingsData): Promise<void> {
    const settingsMap = {
      site_name: data.siteName,
      site_url: data.siteUrl,
      default_registration_url: data.defaultRegistrationUrl,
      email_notifications: data.emailNotifications,
      auto_publish_events: data.autoPublishEvents,
      allow_guest_registration: data.allowGuestRegistration,
      maintenance_mode: data.maintenanceMode,
      max_events_per_page: data.maxEventsPerPage,
      hero_texts: data.heroTexts,
      contact_email: data.contactEmail,
      admissions_email: data.admissionsEmail,
      contact_phones: data.contactPhones,
      contact_address: data.contactAddress,
      support_hours: data.supportHours,
      social_media: data.socialMedia,
    };

    await this.updateSettings(settingsMap);
  }
  // Get public settings (for use in public parts of the site)
  async getPublicSettings(): Promise<Record<string, SettingValue>> {
    const { data, error } = await supabase
      .from("admin_settings")
      .select("key, value")
      .eq("is_public", true);

    if (error) throw error;

    return (data || []).reduce(
      (acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      },
      {} as Record<string, SettingValue>
    );
  }
}

export const settingsService = new SettingsService();
