import React from "react";
import { DataTable } from "../../components/DataTable.jsx";
import { reminders } from "../../data/mock.js";

export default function Reminders() {
  const rows = reminders.map((row) => ({
    id: row.id,
    cells: [row.type, row.user, row.due, row.status]
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold">Reminders & Expiry Alerts</h2>
          <p className="text-sm text-slate-500">Upcoming insurance, MOT, and document expiry reminders.</p>
        </div>
        <button className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white">Send Notifications</button>
      </div>
      <DataTable columns={["Reminder Type", "User", "Due Date", "Status"]} rows={rows} />
    </div>
  );
}