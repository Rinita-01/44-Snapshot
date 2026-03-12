import React, { useState } from "react";
import Modal from "../components/Modal.jsx";
import { folders as seedFolders } from "../data/dummyData.js";

export default function Folders() {
  const [folders, setFolders] = useState(seedFolders);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ name: "", documents: "", storage: "", color: "from-slate-500/15 to-slate-50" });

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", documents: "", storage: "", color: "from-slate-500/15 to-slate-50" });
    setModalOpen(true);
  };

  const openEdit = (folder) => {
    setEditing(folder.id);
    setForm({ name: folder.name, documents: folder.documents, storage: folder.storage, color: folder.color });
    setModalOpen(true);
  };

  const openDelete = (folder) => {
    setDeleteTarget(folder);
  };

  const handleSave = () => {
    if (editing) {
      setFolders((prev) =>
        prev.map((folder) => (folder.id === editing ? { ...folder, ...form, documents: Number(form.documents) } : folder))
      );
    } else {
      setFolders((prev) => [
        {
          id: `f-${prev.length + 1}`,
          name: form.name || "New Folder",
          documents: Number(form.documents) || 0,
          storage: form.storage || "0 GB",
          color: form.color
        },
        ...prev
      ]);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setFolders((prev) => prev.filter((folder) => folder.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-2xl font-semibold">Folder & Category Management</div>
          <p className="mt-2 text-sm text-slate-500">Organize documents into secure categories, Apple Wallet style.</p>
        </div>
        <button
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm"
          onClick={openAdd}
          type="button"
        >
          Add Folder
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className={`rounded-2xl border border-slate-200 bg-gradient-to-br ${folder.color} p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md`}
          >
            <div className="text-sm font-semibold text-slate-800">{folder.name}</div>
            <div className="mt-2 text-xs text-slate-500">{folder.documents} documents</div>
            <div className="mt-1 text-xs text-slate-500">{folder.storage} stored</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
                onClick={() => openEdit(folder)}
                type="button"
              >
                Edit Folder
              </button>
              <button
                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700"
                onClick={() => openDelete(folder)}
                type="button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        title={editing ? "Edit Folder" : "Add Folder"}
        onClose={() => setModalOpen(false)}
        actions={
          <>
            <button
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
              onClick={() => setModalOpen(false)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              onClick={handleSave}
              type="button"
            >
              Save Folder
            </button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-slate-600">
            Folder name
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          </label>
          <label className="text-sm text-slate-600">
            Document count
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={form.documents}
              onChange={(event) => setForm((prev) => ({ ...prev, documents: event.target.value }))}
            />
          </label>
          <label className="text-sm text-slate-600">
            Storage
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={form.storage}
              onChange={(event) => setForm((prev) => ({ ...prev, storage: event.target.value }))}
            />
          </label>
          <label className="text-sm text-slate-600">
            Accent color
            <select
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={form.color}
              onChange={(event) => setForm((prev) => ({ ...prev, color: event.target.value }))}
            >
              <option value="from-indigo-500/15 to-indigo-50">Indigo</option>
              <option value="from-emerald-500/15 to-emerald-50">Emerald</option>
              <option value="from-amber-500/15 to-amber-50">Amber</option>
              <option value="from-rose-500/15 to-rose-50">Rose</option>
              <option value="from-sky-500/15 to-sky-50">Sky</option>
              <option value="from-slate-500/15 to-slate-50">Slate</option>
            </select>
          </label>
        </div>
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        title="Delete Folder"
        onClose={() => setDeleteTarget(null)}
        actions={
          <>
            <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={() => setDeleteTarget(null)} type="button">
              Cancel
            </button>
            <button className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white" onClick={handleDelete} type="button">
              Delete
            </button>
          </>
        }
      >
        <div className="text-sm text-slate-600">
          Delete <span className="font-semibold text-slate-900">{deleteTarget?.name}</span> and remove all category mappings?
        </div>
      </Modal>
    </div>
  );
}
