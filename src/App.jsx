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
import Reminders from "./pages/reminders/Reminders.jsx";
import ReminderFolderDetails from "./pages/reminders/ReminderFolderDetails.jsx";
import { ReminderProvider } from "./features/reminders/context/ReminderContext.jsx";
import Folders from "./pages/folders/Folders.jsx";
import FolderDetails from "./pages/folders/FolderDetails.jsx";
import { FolderProvider } from "./features/folders/context/FolderContext.jsx";
import { ToastProvider } from "./components/ui/Toast.jsx";

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ReminderProvider>
          <FolderProvider>
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
                  <Route path="folders" element={<Folders />} />
                  <Route path="folders/:folderId" element={<FolderDetails />} />
                  <Route path="reminders" element={<Reminders />} />
                  <Route path="reminders/:folderId" element={<ReminderFolderDetails />} />
                  <Route path="activity-logs" element={<ActivityLogs />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="profile" element={<Profile />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </FolderProvider>
        </ReminderProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
