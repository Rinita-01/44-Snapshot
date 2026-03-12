import React from "react";
import { DataTable } from "../components/DataTable.jsx";
import { qrLogs } from "../data/mock.js";

export default function QRLogs() {
  const rows = qrLogs.map((row) => ({
    id: row.id,
    cells: [row.user, row.document, row.date, row.scans, row.sharedWith]
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">QR Sharing Logs</h2>
        <p className="text-sm text-slate-500">Track QR scan events and recipients.</p>
      </div>
      <DataTable columns={["User", "Document", "Date", "QR Scan Count", "Shared With"]} rows={rows} />
    </div>
  );
}