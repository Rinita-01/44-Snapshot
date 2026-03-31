import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

const mockAdmins = [
  {
    id: "ADM-001",
    name: "Aisha Khan",
    email: "super@walletadmin.com",
    role: "Super Admin",
    password: "Secure@123",
    status: "Active"
  },
  {
    id: "ADM-002",
    name: "Lucas Brandt",
    email: "admin@walletadmin.com",
    role: "Admin",
    password: "Admin@123",
    status: "Active"
  },
  {
    id: "ADM-003",
    name: "Sonia Patel",
    email: "support@walletadmin.com",
    role: "Support Manager",
    password: "Support@123",
    status: "Active"
  }
];

const TOKEN_KEY = "wallet_admin_token";
const USER_KEY = "wallet_admin_user";
const LAST_ACTIVE = "wallet_admin_last_active";
const SESSION_TIMEOUT_MS = 15 * 60 * 1000;

function generateJwt(payload) {
  const base = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa("signed");
  return `${base}.${body}.${signature}`;
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const timerRef = useRef(null);

  const isAuthenticated = Boolean(token && user);

  const persistSession = (jwt, profile, remember) => {
    if (remember) {
      localStorage.setItem(TOKEN_KEY, jwt);
      localStorage.setItem(USER_KEY, JSON.stringify(profile));
    } else {
      sessionStorage.setItem(TOKEN_KEY, jwt);
      sessionStorage.setItem(USER_KEY, JSON.stringify(profile));
    }
    localStorage.setItem(LAST_ACTIVE, Date.now().toString());
    setToken(jwt);
    setUser(profile);
  };

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(LAST_ACTIVE);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const login = (email, password, remember) => {
    const match = mockAdmins.find(
      (admin) => admin.email === email && admin.password === password && admin.status === "Active"
    );
    if (!match) {
      return { ok: false, message: "Invalid credentials or inactive admin." };
    }
    const jwt = generateJwt({
      sub: match.id,
      role: match.role,
      email: match.email,
      name: match.name
    });
    persistSession(jwt, { ...match, password: undefined }, remember);
    return { ok: true };
  };

  const logout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  const updateLastActive = () => {
    localStorage.setItem(LAST_ACTIVE, Date.now().toString());
  };

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const tick = () => {
      const lastActive = Number(localStorage.getItem(LAST_ACTIVE) || 0);
      if (Date.now() - lastActive > SESSION_TIMEOUT_MS) {
        logout();
      }
    };

    const handleActivity = () => updateLastActive();
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    updateLastActive();

    timerRef.current = setInterval(tick, 30000);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAuthenticated]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      login,
      logout
    }),
    [user, token, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export const ROLES = ["Super Admin", "Admin", "Support Manager"];
