
import { useAuth } from "@/hooks/useAuth";
import { useLocation, Navigate } from "react-router-dom";
import React from "react";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/auth" state={{ from: location }} replace />;

  return <>{children}</>;
}
