"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  AuthUser,
  getCurrentUser,
  login as loginFn,
  logout as logoutFn,
  register as registerFn,
  seedAuth,
  RegisterInput,
  AuthResult,
} from "@/lib/auth";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => AuthResult;
  register: (input: RegisterInput) => AuthResult;
  logout: () => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setUser(getCurrentUser());
  }, []);

  useEffect(() => {
    seedAuth();
    refresh();
    setLoading(false);

    const handler = () => refresh();
    window.addEventListener("staybook-auth-changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("staybook-auth-changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, [refresh]);

  const login = useCallback((email: string, password: string) => {
    const result = loginFn(email, password);
    if (result.ok && result.user) setUser(result.user);
    return result;
  }, []);

  const register = useCallback((input: RegisterInput) => {
    const result = registerFn(input);
    if (result.ok && result.user) setUser(result.user);
    return result;
  }, []);

  const logout = useCallback(() => {
    logoutFn();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoggedIn: !!user,
        isAdmin: user?.role === "admin" || user?.role === "superadmin",
        login,
        register,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
