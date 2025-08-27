"use client";

import { createContext, useContext, useMemo, useState } from "react";
import api from "@/lib/api";

type User = { id: string; name: string; email: string; role: "NORMAL" | "GESTOR" };
type AuthCtx = {
  user: User | null;
  token: string | null;
  ready: boolean;
  login: (email: string, pw: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initial = (() => {
    if (typeof window === "undefined")
      return { user: null as User | null, token: null as string | null };
    try {
      const raw = sessionStorage.getItem("auth");
      if (raw) return JSON.parse(raw) as { user: User; token: string };
    } catch {}
    return { user: null as User | null, token: null as string | null };
  })();

  const [user, setUser] = useState<User | null>(initial.user);
  const [token, setToken] = useState<string | null>(initial.token);
  const [ready] = useState(true);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data.user);
    setToken(data.token);
    sessionStorage.setItem("auth", JSON.stringify({ user: data.user, token: data.token }));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem("auth");
    if (typeof window !== "undefined") window.location.href = "/login";
  };

  const value = useMemo(() => ({ user, token, ready, login, logout }), [user, token, ready]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be within AuthProvider");
  return ctx;
}
