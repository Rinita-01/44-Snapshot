import React, { useMemo, useState } from "react";
import DataTable from "../components/DataTable.jsx";
import Modal from "../components/Modal.jsx";
import { documents as seedDocuments } from "../data/dummyData.js";

const categories = ["All", "Motor Insurance", "Health Insurance", "Travel", "Personal Documents", "Medical Records", "Insurance"];

export default function Documents() {
  const [documents, setDocuments] = useState(seedDocuments);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [modal, setModal] = useState({ open: false, type: "", doc: null });

  const filtered = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) || doc.owner.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || doc.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category, documents]);

  const columns = [
    { key: "name", label: "Document Name" },
    { key: "category", label: "Category" },
    { key: "owner", label: "Owner" },
    { key: "uploadDate", label: "Upload Date" },
    { key: "expiryDate", label: "Expiry Date" },
    { key: "size", label: "Storage Size" }
  ];

  const openModal = (type, doc) => setModal({ open: true, type, doc });
  const closeModal = () => setModal({ open: false, type: "", doc: null });

  const handleArchive = () => {
    if (!modal.doc) return;
    setDocuments((prev) => prev.filter((item) => item.id !== modal.doc.id));
    closeModal();
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <div className="text-2xl font-semibold">Documents Management</div>
        <p className="mt-2 text-sm text-slate-500">Monitor uploads, expiries, and storage sizes across categories.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <input
            className="h-10 w-full max-w-xs rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm"
            placeholder="Search documents or owners"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <button
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
          onClick={() => openModal("export", null)}
          type="button"
        >
          Export
        </button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        actions={(row) => (
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
              onClick={() => openModal("preview", row)}
              type="button"
            >
              Preview
            </button>
            <button
              className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
              onClick={() => openModal("download", row)}
              type="button"
            >
              Download
            </button>
            <button
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700"
              onClick={() => openModal("archive", row)}
              type="button"
            >
              Archive
            </button>
          </div>
        )}
      />

      <Modal
        open={modal.open}
        title={
          modal.type === "preview"
            ? `Preview: ${modal.doc?.name || "Document"}`
            : modal.type === "download"
            ? "Download Document"
            : modal.type === "archive"
            ? "Archive Document"
            : "Export Documents"
        }
        onClose={closeModal}
        actions={
          modal.type === "preview" ? (
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={closeModal} type="button">
              Close
            </button>
          ) : modal.type === "archive" ? (
            <>
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={closeModal} type="button">
                Cancel
              </button>
              <button className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white" onClick={handleArchive} type="button">
                Archive
              </button>
            </>
          ) : (
            <>
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={closeModal} type="button">
                Cancel
              </button>
              <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={closeModal} type="button">
                Confirm
              </button>
            </>
          )
        }
      >
        {modal.type === "preview" && modal.doc ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
              Document preview placeholder
            </div>
            <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <div>
                <div className="text-xs text-slate-400">Owner</div>
                <div className="font-semibold text-slate-700">{modal.doc.owner}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Category</div>
                <div className="font-semibold text-slate-700">{modal.doc.category}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Uploaded</div>
                <div className="font-semibold text-slate-700">{modal.doc.uploadDate}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Expiry</div>
                <div className="font-semibold text-slate-700">{modal.doc.expiryDate}</div>
              </div>
            </div>
          </div>
        ) : null}

        {modal.type === "download" && modal.doc ? (
          <div className="text-sm text-slate-600">
            Download <span className="font-semibold text-slate-900">{modal.doc.name}</span> for {modal.doc.owner}?
          </div>
        ) : null}

        {modal.type === "archive" && modal.doc ? (
          <div className="text-sm text-slate-600">
            Archive <span className="font-semibold text-slate-900">{modal.doc.name}</span> from active documents?
          </div>
        ) : null}

        {modal.type === "export" ? (
          <div className="text-sm text-slate-600">Export the current filtered document list as CSV.</div>
        ) : null}
      </Modal>
    </div>
  );
}
