import React from "react";
import { DataTable } from "../components/DataTable.jsx";
import { storage } from "../data/mock.js";

export default function Storage() {
  const rows = storage.map((row) => ({
    id: row.id,
    cells: [row.user, row.used, row.limit, row.status]
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold">Storage Management</h2>
          <p className="text-sm text-slate-500">Track usage, limits, and upgrade opportunities.</p>
        </div>
        <button className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white">
          Send Upgrade Offers
        </button>
      </div>
      <DataTable columns={["User", "Storage Used", "Storage Limit", "Status"]} rows={rows} />
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card md:flex-row md:items-center">
        <div>
          <div className="text-sm font-semibold">Storage Upgrade Options</div>
          <div className="text-xs text-slate-500">Trigger automated offers for users above 80% capacity.</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold">+50 GB Add-on</span>
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold">Annual Storage Bundle</span>
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold">Enterprise Vault</span>
        </div>
      </div>
    </div>
  );
}