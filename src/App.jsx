import React from "react";

import { AuthProvider } from "./auth/AuthProvider.jsx";
import { RequireAuth, RequireGuest } from "./auth/auth-guards.jsx";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx"
import Users from "./pages/user/Users.jsx"
import Subscriptions from "./pages/subscriptions/Subscriptions.jsx"
import Notifications from "./pages/notifications/Notifications.jsx"
import ActivityLogs from "./pages/activity/ActivityLogs.jsx"
import Settings from "./pages/settings/Settings.jsx"
import Profile from "./pages/profile/Profile.jsx"
import Login from "./pages/auth/Login.jsx"

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<RequireGuest />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route
          path="/"
          element={<RequireAuth />}
        >
          <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="activity-logs" element={<ActivityLogs />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
