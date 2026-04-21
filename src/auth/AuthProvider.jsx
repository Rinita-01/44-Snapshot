import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "@/api";
import { getApiErrorMessage } from "@/api/helpers";
import { clearAccessToken, getAccessToken, setAccessToken } from "@/auth/session";

const AuthContext = createContext(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const loadProfile = async () => {
    try {
      const profileRes = await authApi.profile();
      setUser(profileRes?.data);
    } catch {
      // Profile loading failed
    }
  };

  const applyLoggedOutState = () => {
    clearAccessToken();
    setIsAuthenticated(false);
    setUser(null);
    setIsLoading(false);
  };

  useEffect(() => {
    const hydrateSession = async () => {
      try {
        const storedToken = getAccessToken();

        if (storedToken) {
          setIsAuthenticated(true);
          await loadProfile();
        } else {
          const refreshRes = await authApi.refresh();
          const newAccessToken = refreshRes?.data?.accessToken;

          if (newAccessToken) {
            setAccessToken(newAccessToken);
            setIsAuthenticated(true);
            await loadProfile();
          } else {
            applyLoggedOutState();
            return;
          }
        }
      } catch {
        applyLoggedOutState();
        return;
      } finally {
        setIsLoading(false);
      }
    };

    hydrateSession();
  }, []);

  useEffect(() => {
    const handleLogout = () => applyLoggedOutState();
    const handleRefresh = () => loadProfile();

    if (typeof window !== "undefined") {
      window.addEventListener("auth:logout", handleLogout);
      window.addEventListener("auth:refreshed", handleRefresh);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("auth:logout", handleLogout);
        window.removeEventListener("auth:refreshed", handleRefresh);
      }
    };
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authApi.login({ email, password });
      const accessToken = data?.data?.accessToken;

      if (!accessToken) {
        return { ok: false, message: "Invalid login response" };
      }

      setAccessToken(accessToken);
      setIsAuthenticated(true);
      await loadProfile();

      return { ok: true };
    } catch (error) {
      applyLoggedOutState();
      return { ok: false, message: getApiErrorMessage(error) };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      applyLoggedOutState();
    }
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      login,
      logout,
      refreshProfile: async () => {
        try {
          await loadProfile();
          return { ok: true, user };
        } catch (error) {
          return {
            ok: false,
            message: getApiErrorMessage(error, "Failed to load profile."),
          };
        }
      },
    }),
    [isAuthenticated, isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
