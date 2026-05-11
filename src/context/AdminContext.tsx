"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface AuthUser {
  id: string;
  username: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function loadUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("kb-user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setUser(loadUser());
    setHydrated(true);
  }, []);

  const setAuth = useCallback((role: "admin" | "user", username: string, id: string) => {
    const u: AuthUser = { id, username, role };
    setUser(u);
    localStorage.setItem("kb-user", JSON.stringify(u));
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        if (!res.ok) return false;
        const data = await res.json();
        setAuth("user", data.username, data.id);
        return true;
      } catch {
        return false;
      }
    },
    [setAuth]
  );

  const adminLogin = useCallback(
    async (username: string, password: string) => {
      try {
        const res = await fetch("/api/auth/admin-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        if (!res.ok) return false;
        const data = await res.json();
        setAuth("admin", data.username, data.id);
        return true;
      } catch {
        return false;
      }
    },
    [setAuth]
  );

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });
        return res.ok;
      } catch {
        return false;
      }
    },
    []
  );

  const logout = useCallback(() => {
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setUser(null);
    localStorage.removeItem("kb-user");
    sessionStorage.removeItem("pending-niche");
    router.push("/");
  }, [router]);

  if (!hydrated) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        adminLogin,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
