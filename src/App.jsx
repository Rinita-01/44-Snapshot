import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { AppLayout } from "./components/AppLayout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Users from "./pages/Users.jsx";
import Documents from "./pages/Documents.jsx";
import Subscriptions from "./pages/Subscriptions.jsx";
import Storage from "./pages/Storage.jsx";
import QRLogs from "./pages/QRLogs.jsx";
import Reminders from "./pages/Reminders.jsx";
import SystemLogs from "./pages/SystemLogs.jsx";
import AdminManagement from "./pages/AdminManagement.jsx";
import Settings from "./pages/Settings.jsx";

const roleMatrix = {
  dashboard: ["Super Admin", "Admin", "Support Manager"],
  users: ["Super Admin", "Admin", "Support Manager"],
  documents: ["Super Admin", "Admin", "Support Manager"],
  subscriptions: ["Super Admin", "Admin"],
  storage: ["Super Admin", "Admin"],
  qrls: ["Super Admin", "Admin", "Support Manager"],
  reminders: ["Super Admin", "Admin", "Support Manager"],
  logs: ["Super Admin", "Admin"],
  adminMgmt: ["Super Admin"],
  settings: ["Super Admin", "Admin"]
};

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowedRoles={roleMatrix.dashboard}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles={roleMatrix.users}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="documents"
            element={
              <ProtectedRoute allowedRoles={roleMatrix.documents}>
                <Documents />
              </ProtectedRoute>
            }
          />
          <Route
            path="subscriptions"
            element={
              <ProtectedRoute allowedRoles={roleMatrix.subscriptions}>
                <Subscriptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="storage"
            element={
              <ProtectedRoute allowedRoles={roleMatrix.storage}>
                <Storage />
              </ProtectedRoute>
            }
          />
          <Route
            path="qr-logs"
            element={
              <ProtectedRoute allowedRoles={roleMatrix.qrls}>
                <QRLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="reminders"
            element={
              <ProtectedRoute allowedRoles={roleMatrix.reminders}>
                <Reminders />
              </ProtectedRoute>
            }
          />
          <Route
            path="system-logs"
            element={
              <ProtectedRoute allowedRoles={roleMatrix.logs}>
                <SystemLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin-management"
            element={
              <ProtectedRoute allowedRoles={roleMatrix.adminMgmt}>
                <AdminManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute allowedRoles={roleMatrix.settings}>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
