import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { PageLoader } from "../components/ui/Skeletons.jsx";

function AuthGate({ message }) {
  return <PageLoader title="Checking Session" message={message} />;
}

export function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthGate message="Verifying your session and preparing the dashboard..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export function RequireGuest() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <AuthGate message="Checking your session before opening the login page..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
