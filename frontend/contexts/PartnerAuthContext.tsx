"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

const API_URL = process.env.NEXT_PUBLIC_AI_API_URL;
const TOKEN_KEY = "aegis_partner_session";

interface Partner {
  id: string;
  name: string;
  organization: string;
  role: string;
  permissions: string[];
}

interface PartnerAuthState {
  isAuthenticated: boolean;
  partner: Partner | null;
  isLoading: boolean;
  error: string | null;
}

interface PartnerAuthContextValue extends PartnerAuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const PartnerAuthContext = createContext<PartnerAuthContextValue | undefined>(undefined);

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_URL) throw new Error("Partner authentication backend is not configured");
  const response = await fetch(new URL(path, API_URL), init);
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.detail ?? "Partner request failed");
  return response.json() as Promise<T>;
}

export function PartnerAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PartnerAuthState>({
    isAuthenticated: false,
    partner: null,
    isLoading: true,
    error: null,
  });

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setState({ isAuthenticated: false, partner: null, isLoading: false, error: null });
  }, []);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setState({ isAuthenticated: false, partner: null, isLoading: false, error: null });
      return;
    }
    setState((previous) => ({ ...previous, isLoading: true, error: null }));
    try {
      const partner = await request<Partner>("/partner/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setState({ isAuthenticated: true, partner, isLoading: false, error: null });
    } catch (error) {
      logout();
      setState((previous) => ({ ...previous, error: error instanceof Error ? error.message : "Session expired" }));
    }
  }, [logout]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState((previous) => ({ ...previous, isLoading: true, error: null }));
    try {
      const response = await request<{ token: string; partner: Partner }>("/partner/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem(TOKEN_KEY, response.token);
      setState({ isAuthenticated: true, partner: response.partner, isLoading: false, error: null });
      return true;
    } catch (error) {
      setState({ isAuthenticated: false, partner: null, isLoading: false, error: error instanceof Error ? error.message : "Login failed" });
      return false;
    }
  }, []);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  return (
    <PartnerAuthContext.Provider value={{ ...state, login, logout, checkAuth }}>
      {children}
    </PartnerAuthContext.Provider>
  );
}

export function usePartnerAuth(): PartnerAuthContextValue {
  const context = useContext(PartnerAuthContext);
  if (!context) throw new Error("usePartnerAuth must be used within a <PartnerAuthProvider>");
  return context;
}

export function hasPermission(partner: Partner | null, permission: string): boolean {
  return partner?.permissions.includes(permission) ?? false;
}
