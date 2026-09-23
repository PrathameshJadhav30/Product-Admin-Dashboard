"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedToken = window.localStorage.getItem("product-admin-token");
    const storedUser = window.localStorage.getItem("product-admin-user");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }

    setIsReady(true);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    window.localStorage.setItem("product-admin-token", authToken);
    window.localStorage.setItem("product-admin-user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    window.localStorage.removeItem("product-admin-token");
    window.localStorage.removeItem("product-admin-user");
    router.push("/login");
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
      isReady,
    }),
    [user, token, isReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
