import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { PageLoader } from "../components/ui/Skeletons.jsx";

export function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <PageLoader title="Checking Session" message="Verifying your account and workspace access..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className="mx-auto mt-16 max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card">
        <h2 className="text-xl font-bold">Access Denied</h2>
        <p className="mt-2 text-sm text-slate-500">Your role does not have permission to view this page.</p>
      </div>
    );
  }

  return children;
}
