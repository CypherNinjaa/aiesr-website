"use client";

import { useQueryClient } from "@tanstack/react-query";
import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { usePublicSettings } from "@/hooks/useSettings";
import { supabase } from "@/lib/supabase";
import { SettingValue } from "@/services/settings";

interface PublicSettingsContextType {
  settings: Record<string, SettingValue> | undefined;
  isLoading: boolean;
  error: Error | null;
}

const PublicSettingsContext = createContext<PublicSettingsContextType | undefined>(undefined);

interface PublicSettingsProviderProps {
  children: ReactNode;
}

export function PublicSettingsProvider({ children }: PublicSettingsProviderProps) {
  const { data: settings, isLoading, error } = usePublicSettings();
  const queryClient = useQueryClient();

  // Set up real-time updates for public settings
  useEffect(() => {
    const subscription = supabase
      .channel("public-settings-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "admin_settings",
          filter: "is_public=eq.true",
        },
        () => {
          // Invalidate and refetch public settings when any public setting changes
          queryClient.invalidateQueries({ queryKey: ["public-settings"] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return (
    <PublicSettingsContext.Provider value={{ settings, isLoading, error }}>
      {children}
    </PublicSettingsContext.Provider>
  );
}

export function usePublicSettingsContext() {
  const context = useContext(PublicSettingsContext);
  if (context === undefined) {
    throw new Error("usePublicSettingsContext must be used within a PublicSettingsProvider");
  }
  return context;
}

// Helper hooks for specific settings
export function useSiteName(): string {
  const { settings } = usePublicSettingsContext();
  return (settings?.site_name as string) || "AIESR - Amity Institute of English Studies & Research";
}

export function useHeroTexts(): string[] {
  const { settings } = usePublicSettingsContext();
  return (
    (settings?.hero_texts as string[]) || [
      "Where Words Come Alive",
      "Craft Your Literary Legacy",
      "Discover the Power of Language",
      "Shape Your Future in Literature",
    ]
  );
}

export function useContactEmail(): string {
  const { settings } = usePublicSettingsContext();
  return (settings?.contact_email as string) || "info@aiesr.edu";
}

export function useAdmissionsEmail(): string {
  const { settings } = usePublicSettingsContext();
  return (settings?.admissions_email as string) || "admissions@aiesr.amity.edu";
}

export function useContactPhones(): string[] {
  const { settings } = usePublicSettingsContext();
  return (settings?.contact_phones as string[]) || ["+91 612 2346789", "+91 612 2346790"];
}

export function useContactAddress(): {
  line1: string;
  line2: string;
  city: string;
  state: string;
  zipCode: string;
} {
  const { settings } = usePublicSettingsContext();
  return (
    (settings?.contact_address as {
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
    }
  );
}

export function useSupportHours(): string {
  const { settings } = usePublicSettingsContext();
  return (settings?.support_hours as string) || "9 AM - 6 PM, Monday to Saturday";
}

export function useSocialMedia(): {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
} {
  const { settings } = usePublicSettingsContext();
  return (
    (settings?.social_media as {
      facebook: string;
      twitter: string;
      instagram: string;
      linkedin: string;
    }) || {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    }
  );
}
