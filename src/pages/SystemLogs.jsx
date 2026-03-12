import React from "react";
import { DataTable } from "../components/DataTable.jsx";
import { systemLogs } from "../data/mock.js";

export default function SystemLogs() {
  const rows = systemLogs.map((row) => ({
    id: row.id,
    cells: [row.activity, row.user, row.date, row.status]
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold">System Activity Logs</h2>
          <p className="text-sm text-slate-500">Audit user logins, document uploads, and payments.</p>
        </div>
        <button className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold">Export Logs</button>
      </div>
      <DataTable columns={["Activity", "User", "Date", "Status"]} rows={rows} />
    </div>
  );
}