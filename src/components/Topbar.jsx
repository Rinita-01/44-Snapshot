import React from "react";
import { useAuth } from "./AuthProvider.jsx";

export default function Topbar() {
  const { logout } = useAuth();
  return (
    <header className="sticky top-0 z-10 flex flex-col gap-3 border-b border-slate-200 bg-white/70 px-6 py-5 backdrop-blur md:flex-row md:items-center md:justify-between md:px-8">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-white p-1 shadow-sm">
          <img src="/logo.png" alt="44 Snapshot" className="h-full w-full rounded-lg object-contain" />
        </div>
        <div>
          <div className="text-xl font-bold">Admin Dashboard</div>
          <div className="text-xs text-slate-500">44 Snapshot Document Library</div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm md:w-64"
          placeholder="Search users, documents, logs"
        />
        <button className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold">
          Alerts
        </button>
        <button
          className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white"
          type="button"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
