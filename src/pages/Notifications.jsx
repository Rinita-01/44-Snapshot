import React, { useState } from "react";
import DataTable from "../components/DataTable.jsx";
import Modal from "../components/Modal.jsx";
import { notifications } from "../data/dummyData.js";

export default function Notifications() {
  const [modal, setModal] = useState({ open: false, type: "", row: null });

  const columns = [
    { key: "user", label: "User" },
    { key: "document", label: "Document" },
    { key: "expiryDate", label: "Expiry Date" },
    { key: "alertSent", label: "Alert Sent" }
  ];

  const openModal = (type, row) => setModal({ open: true, type, row });
  const closeModal = () => setModal({ open: false, type: "", row: null });

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <div className="text-2xl font-semibold">Notifications & Expiry Alerts</div>
        <p className="mt-2 text-sm text-slate-500">Track reminders sent for upcoming document expirations.</p>
      </div>

      <DataTable
        columns={columns}
        data={notifications}
        actions={(row) => (
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
              onClick={() => openModal("resend", row)}
              type="button"
            >
              Resend
            </button>
            <button
              className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
              onClick={() => openModal("view", row)}
              type="button"
            >
              View
            </button>
          </div>
        )}
      />

      <Modal
        open={modal.open}
        title={modal.type === "resend" ? "Resend Alert" : "Alert Details"}
        onClose={closeModal}
        actions={
          modal.type === "resend" ? (
            <>
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={closeModal} type="button">
                Cancel
              </button>
              <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={closeModal} type="button">
                Send
              </button>
            </>
          ) : (
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={closeModal} type="button">
              Close
            </button>
          )
        }
      >
        {modal.row ? (
          <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            <div>
              <div className="text-xs text-slate-400">User</div>
              <div className="font-semibold text-slate-900">{modal.row.user}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Document</div>
              <div className="font-semibold text-slate-900">{modal.row.document}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Expiry Date</div>
              <div className="font-semibold text-slate-900">{modal.row.expiryDate}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Alert Sent</div>
              <div className="font-semibold text-slate-900">{modal.row.alertSent}</div>
            </div>
          </div>
        ) : null}

        {modal.type === "resend" && modal.row ? (
          <div className="mt-4 text-sm text-slate-600">
            Send a reminder to <span className="font-semibold text-slate-900">{modal.row.user}</span> for
            <span className="font-semibold text-slate-900"> {modal.row.document}</span>?
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
