import React, { useState } from "react";
import DataTable from "../components/DataTable.jsx";
import Modal from "../components/Modal.jsx";
import { activityLogs } from "../data/dummyData.js";

export default function ActivityLogs() {
  const [modal, setModal] = useState({ open: false, row: null });

  const columns = [
    { key: "user", label: "User" },
    { key: "action", label: "Action" },
    { key: "date", label: "Date" },
    { key: "ip", label: "IP Address" }
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <div className="text-2xl font-semibold">Activity Logs</div>
        <p className="mt-2 text-sm text-slate-500">Audit admin actions and system events.</p>
      </div>

      <DataTable
        columns={columns}
        data={activityLogs}
        actions={(row) => (
          <button
            className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
            onClick={() => setModal({ open: true, row })}
            type="button"
          >
            Details
          </button>
        )}
      />

      <Modal
        open={modal.open}
        title="Log Details"
        onClose={() => setModal({ open: false, row: null })}
        actions={
          <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={() => setModal({ open: false, row: null })} type="button">
            Close
          </button>
        }
      >
        {modal.row ? (
          <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            <div>
              <div className="text-xs text-slate-400">User</div>
              <div className="font-semibold text-slate-900">{modal.row.user}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Action</div>
              <div className="font-semibold text-slate-900">{modal.row.action}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Date</div>
              <div className="font-semibold text-slate-900">{modal.row.date}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">IP Address</div>
              <div className="font-semibold text-slate-900">{modal.row.ip}</div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
