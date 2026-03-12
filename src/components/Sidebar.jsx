import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "./AuthProvider.jsx";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/users", label: "User Management" },
  { to: "/documents", label: "Document Monitoring" },
  { to: "/subscriptions", label: "Subscription & Billing" },
  { to: "/storage", label: "Storage Management" },
  { to: "/qr-logs", label: "QR Sharing Logs" },
  { to: "/reminders", label: "Reminders & Expiry Alerts" },
  { to: "/system-logs", label: "System Activity Logs" },
  { to: "/admin-management", label: "Admin Management" },
  { to: "/settings", label: "Settings" }
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    [
      "w-full rounded-xl px-3 py-2 text-sm transition",
      isActive
        ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white"
        : "text-slate-300 hover:bg-white/10"
    ].join(" ");

  return (
    <aside className="sticky top-0 flex h-screen w-[270px] flex-col gap-6 bg-[#0b1120] p-6 text-slate-200">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-white p-1">
          <img src="/logo.png" alt="44 Snapshot" className="h-full w-full rounded-lg object-contain" />
        </div>
        <div>
          <div className="text-base font-bold">44 Snapshot</div>
          <div className="text-xs text-slate-400">Admin Console</div>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
        <div className="grid h-11 w-11 place-items-center rounded-full bg-slate-800 text-lg font-semibold">
          {user?.name?.[0] ?? "A"}
        </div>
        <div>
          <div className="font-semibold">{user?.name}</div>
          <div className="text-xs text-slate-400">{user?.role}</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass}>
            {item.label}
          </NavLink>
        ))}
        <button
          className="mt-2 w-full rounded-xl px-3 py-2 text-left text-sm text-rose-300 hover:bg-white/10"
          type="button"
          onClick={logout}
        >
          Logout
        </button>
      </nav>

      <div className="mt-auto flex flex-wrap gap-2">
        <div className="rounded-full bg-white/10 px-3 py-1 text-[11px]">JWT Secured</div>
        <div className="rounded-full bg-white/10 px-3 py-1 text-[11px]">RBAC Enabled</div>
      </div>
    </aside>
  );
}
