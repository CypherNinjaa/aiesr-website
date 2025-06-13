"use client";

import React from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminLoginForm } from "./AdminLoginForm";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children, fallback }) => {
  const { adminUser, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!adminUser) {
    return fallback || <AdminLoginForm />;
  }

  return <>{children}</>;
};
