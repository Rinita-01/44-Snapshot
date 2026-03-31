import React, { useState } from "react";
import { EyeIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import DataTable from "../../components/DataTable.jsx";
import Modal from "../../components/Modal.jsx";
import { notifications } from "../../data/dummyData.js";

export default function Notifications() {
  const [modal, setModal] = useState({ open: false, type: "", row: null });

  const columns = [
    { key: "user", label: "User" },
    { key: "alert", label: "Alert" },
    { key: "dueDate", label: "Due Date" },
    { key: "alertSent", label: "Alert Sent" }
  ];

  const openModal = (type, row) => setModal({ open: true, type, row });
  const closeModal = () => setModal({ open: false, type: "", row: null });

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <div className="text-2xl font-semibold">Notifications & Alerts</div>
        <p className="mt-2 text-sm text-slate-500">Track reminders sent for upcoming renewals and account alerts.</p>
      </div>

      <DataTable
        columns={columns}
        data={notifications}
        actions={(row) => (
          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100"
              onClick={() => openModal("resend", row)}
              type="button"
              title="Resend"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
              <span className="sr-only">Resend</span>
            </button>
            <button
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100"
              onClick={() => openModal("view", row)}
              type="button"
              title="View"
            >
              <EyeIcon className="h-4 w-4" />
              <span className="sr-only">View</span>
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
              <div className="text-xs text-slate-400">Alert</div>
              <div className="font-semibold text-slate-900">{modal.row.alert}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Due Date</div>
              <div className="font-semibold text-slate-900">{modal.row.dueDate}</div>
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
            <span className="font-semibold text-slate-900"> {modal.row.alert}</span>?
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
