"use client";
import { useAuth } from "./../stores/auth";

export default function RequireGestor({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user?.role !== "GESTOR") return null;
  return <>{children}</>;
}
