import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { AdminService } from "@/services/database";

// Hook for current admin user
export const useAdminAuth = () => {
  const [loading, setLoading] = useState(true);

  const { data: adminUser, isLoading } = useQuery({
    queryKey: ["admin-auth"],
    queryFn: AdminService.getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async () => {
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    adminUser,
    isLoading: loading || isLoading,
    isAuthenticated: !!adminUser,
    isAdmin: adminUser?.admin?.role === "admin",
    isSuperAdmin: adminUser?.admin?.role === "super_admin",
  };
};

// Hook for admin sign in
export const useAdminSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      AdminService.signIn(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-auth"] });
    },
  });
};

// Hook for admin sign out
export const useAdminSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AdminService.signOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-auth"] });
    },
  });
};
