import React from "react";
import { DataTable } from "../components/DataTable.jsx";
import { documents, categoryColors } from "../data/mock.js";

export default function Documents() {
  const rows = documents.map((doc) => ({
    id: doc.id,
    cells: [
      doc.id,
      doc.user,
      <span
        key={doc.id}
        className="inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white"
        style={{ background: categoryColors[doc.type] || "#111827" }}
      >
        {doc.type}
      </span>,
      doc.uploadDate,
      doc.expiryDate,
      doc.status
    ]
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Document Monitoring</h2>
        <p className="text-sm text-slate-500">Track document uploads and expiry status.</p>
      </div>
      <DataTable
        columns={["Document ID", "User", "Document Type", "Upload Date", "Expiry Date", "Status"]}
        rows={rows}
        actions={() => (
          <div className="flex flex-wrap gap-2">
            <button className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold">View</button>
            <button className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold">Flag</button>
          </div>
        )}
      />
    </div>
  );
}