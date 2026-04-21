import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

function AuthGate({ message }) {
    return (
        <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
            {message}
        </div>
    );
}

export function RequireAuth() {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <AuthGate message="Checking session..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}

export function RequireGuest() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <AuthGate message="Checking session..." />;
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
