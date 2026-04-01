import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./auth-context";
import { authApi } from "@/api";
import { getApiErrorMessage } from "@/api/helpers";
import { clearAccessToken, getAccessToken, setAccessToken } from "@/auth/session";

const getAccessTokenFromResponse = (data) =>
  data?.accessToken || data?.token || data?.data?.accessToken || data?.data?.token;

const getUserFromResponse = (data) =>
  data?.user || data?.data?.user || data?.profile || data?.data?.profile;

const buildNameFromEmail = (email) => {
  if (!email) return "";

  const namePart = email.split("@")[0] || "";
  return namePart
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
};

const normalizeUser = (user, email) => {
  if (user && typeof user === "object") {
    const nextUser = { ...user };
    const resolvedEmail = nextUser.email || email;

    if (!nextUser.email && resolvedEmail) nextUser.email = resolvedEmail;
    if (!nextUser.name && resolvedEmail) {
      nextUser.name = buildNameFromEmail(resolvedEmail) || resolvedEmail;
    }

    return nextUser;
  }

  if (!email) return null;
  const name = buildNameFromEmail(email);

  return { name: name || email, email };
};

const resolveUser = (payload, email) =>
  normalizeUser(getUserFromResponse(payload) ?? payload, email);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const hydrateSession = async () => {
      try {
        const storedToken = getAccessToken();

        if (storedToken) {
          if (isMounted) setIsAuthenticated(true);
          const profile = await authApi.profile().catch(() => null);
          if (isMounted) setUser(resolveUser(profile));
          return;
        }

        const data = await authApi.refresh();
        const newAccessToken = getAccessTokenFromResponse(data);

        if (newAccessToken) {
          setAccessToken(newAccessToken);
          if (isMounted) setIsAuthenticated(true);
          const profile = await authApi.profile().catch(() => null);
          if (isMounted) setUser(resolveUser(profile));
        } else if (isMounted) {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch {
        if (isMounted) {
          clearAccessToken();
          setIsAuthenticated(false);
          setUser(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    hydrateSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleLogout = () => {
      clearAccessToken();
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("auth:logout", handleLogout);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("auth:logout", handleLogout);
      }
    };
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authApi.login({ email, password });
      const accessToken = getAccessTokenFromResponse(data);

      if (!accessToken) {
        setIsAuthenticated(false);
        setUser(null);
        return { ok: false, message: "Invalid login response. Please try again." };
      }

      setAccessToken(accessToken);
      setIsAuthenticated(true);

      let nextUser = resolveUser(data, email);
      if (!nextUser) {
        const profile = await authApi.profile().catch(() => null);
        nextUser = resolveUser(profile, email);
      }

      setUser(nextUser);
      return { ok: true };
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      return { ok: false, message: getApiErrorMessage(error, "Login failed.") };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      clearAccessToken();
      setIsAuthenticated(false);
      setUser(null);
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
          const profile = await authApi.profile();
          const nextUser = resolveUser(profile);
          setUser(nextUser);
          return { ok: true, user: nextUser };
        } catch (error) {
          return { ok: false, message: getApiErrorMessage(error, "Failed to load profile.") };
        }
      }
    }),
    [isAuthenticated, isLoading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
