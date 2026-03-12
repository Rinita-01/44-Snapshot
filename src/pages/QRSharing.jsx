import React, { useState } from "react";
import DataTable from "../components/DataTable.jsx";
import Modal from "../components/Modal.jsx";
import { qrShares } from "../data/dummyData.js";

export default function QRSharing() {
  const [modal, setModal] = useState({ open: false, type: "", share: null });

  const columns = [
    { key: "document", label: "Document" },
    { key: "owner", label: "Owner" },
    { key: "generated", label: "QR Generated" },
    { key: "scans", label: "Scan Count" },
    { key: "lastScanned", label: "Last Scanned" }
  ];

  const openModal = (type, share) => setModal({ open: true, type, share });
  const closeModal = () => setModal({ open: false, type: "", share: null });

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <div className="text-2xl font-semibold">QR Sharing Monitoring</div>
        <p className="mt-2 text-sm text-slate-500">Track QR-based document sharing activity and scans.</p>
      </div>

      <DataTable
        columns={columns}
        data={qrShares}
        actions={(row) => (
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
              onClick={() => openModal("view", row)}
              type="button"
            >
              View
            </button>
            <button
              className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
              onClick={() => openModal("revoke", row)}
              type="button"
            >
              Revoke
            </button>
          </div>
        )}
      />

      <Modal
        open={modal.open}
        title={modal.type === "view" ? "QR Share Details" : "Revoke QR Share"}
        onClose={closeModal}
        actions={
          modal.type === "revoke" ? (
            <>
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={closeModal} type="button">
                Cancel
              </button>
              <button className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white" onClick={closeModal} type="button">
                Revoke
              </button>
            </>
          ) : (
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={closeModal} type="button">
              Close
            </button>
          )
        }
      >
        {modal.share ? (
          <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            <div>
              <div className="text-xs text-slate-400">Document</div>
              <div className="font-semibold text-slate-900">{modal.share.document}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Owner</div>
              <div className="font-semibold text-slate-900">{modal.share.owner}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">QR Generated</div>
              <div className="font-semibold text-slate-900">{modal.share.generated}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Scan Count</div>
              <div className="font-semibold text-slate-900">{modal.share.scans}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Last Scanned</div>
              <div className="font-semibold text-slate-900">{modal.share.lastScanned}</div>
            </div>
          </div>
        ) : null}

        {modal.type === "revoke" && modal.share ? (
          <div className="mt-4 text-sm text-slate-600">
            Revoke sharing access for <span className="font-semibold text-slate-900">{modal.share.document}</span>?
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
