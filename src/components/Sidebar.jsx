import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  FolderIcon,
  QrCodeIcon,
  CreditCardIcon,
  BellAlertIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "./AuthProvider.jsx";
import Modal from "./Modal.jsx";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: HomeIcon },
  { to: "/users", label: "Users", icon: UsersIcon },
  { to: "/documents", label: "Documents", icon: DocumentTextIcon },
  { to: "/folders", label: "Folders", icon: FolderIcon },
  { to: "/qr-sharing", label: "QR Sharing", icon: QrCodeIcon },
  { to: "/subscriptions", label: "Subscriptions", icon: CreditCardIcon },
  { to: "/notifications", label: "Notifications", icon: BellAlertIcon },
  { to: "/activity-logs", label: "Activity Logs", icon: ClipboardDocumentListIcon },
  { to: "/settings", label: "Settings", icon: Cog6ToothIcon }
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AC";
  const linkClass = ({ isActive }) =>
    [
      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
      isActive
        ? "bg-slate-900 text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-100"
    ].join(" ");

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-900/30 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        role="presentation"
      />
      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-slate-200 bg-white px-6 py-6 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white p-1 shadow-sm">
              <img src="/logo.png" alt="44 Snapshot" className="h-full w-full rounded-xl object-contain" />
            </div>
            <div>
              <div className="text-base font-semibold">44 Snapshot</div>
              <div className="text-xs text-slate-500">Admin Console</div>
            </div>
          </div>
          <button
            className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-500 lg:hidden"
            onClick={onClose}
            type="button"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
          <div className="text-xs font-semibold text-slate-400">Signed in as</div>
          <div className="mt-2 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-sm font-semibold text-slate-700 shadow-sm">
              {initials}
            </div>
            <div>
              <div className="text-sm font-semibold">{user?.name || "Ava Carter"}</div>
              <div className="text-xs text-slate-500">{user?.role || "Operations Admin"}</div>
            </div>
          </div>
        </div>

        <nav className="mt-6 flex flex-1 flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Storage Health</div>
          <div className="mt-2 text-sm font-semibold">82% used</div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-4/5 rounded-full bg-slate-900" />
          </div>
          <button
            className="mt-4 w-full rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
            onClick={() => setUpgradeOpen(true)}
            type="button"
          >
            Upgrade Storage
          </button>
        </div>

        <button
          className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          onClick={logout}
          type="button"
        >
          Logout
        </button>
      </aside>

      <Modal
        open={upgradeOpen}
        title="Upgrade Storage"
        onClose={() => setUpgradeOpen(false)}
        actions={
          <>
            <button
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold"
              onClick={() => setUpgradeOpen(false)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              onClick={() => setUpgradeOpen(false)}
              type="button"
            >
              Request Upgrade
            </button>
          </>
        }
      >
        <div className="space-y-3 text-sm text-slate-600">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            +50 GB Add-on - ideal for power users and heavy scans.
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            Annual Storage Bundle - discounted annual capacity boosts.
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            Enterprise Vault - dedicated storage clusters and SLA support.
          </div>
        </div>
      </Modal>
    </>
  );
}
