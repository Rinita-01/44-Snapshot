import React, { useMemo, useState } from "react";
import { NoSymbolIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { DataTable } from "../components/DataTable.jsx";
import { Modal } from "../components/Modal.jsx";
import { admins as seedAdmins, adminLogs } from "../data/mock.js";
import { ROLES } from "../components/AuthProvider.jsx";

export default function AdminManagement() {
  const [admins, setAdmins] = useState(seedAdmins);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const rows = useMemo(
    () =>
      admins.map((admin) => ({
        id: admin.id,
        cells: [admin.id, admin.name, admin.email, admin.role, admin.status, admin.lastActive]
      })),
    [admins]
  );

  const openAdd = () => {
    setEditing({ id: "", name: "", email: "", role: "Admin", status: "Active", lastActive: "2026-03-11" });
    setOpen(true);
  };

  const openEdit = (admin) => {
    setEditing(admin);
    setOpen(true);
  };

  const saveAdmin = () => {
    if (!editing.name || !editing.email) return;
    setAdmins((prev) => {
      const exists = prev.find((item) => item.id === editing.id);
      if (exists) {
        return prev.map((item) => (item.id === editing.id ? editing : item));
      }
      const nextId = `ADM-${String(prev.length + 1).padStart(3, "0")}`;
      return [{ ...editing, id: nextId }, ...prev];
    });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold">Admin Management</h2>
          <p className="text-sm text-slate-500">Super Admin controls for admins, roles, and activity.</p>
        </div>
        <button className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white" onClick={openAdd}>
          Add New Admin
        </button>
      </div>
      <DataTable
        columns={["Admin ID", "Name", "Email", "Role", "Status", "Last Active"]}
        rows={rows}
        actions={(row) => (
          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
              onClick={() => openEdit(admins.find((a) => a.id === row.id))}
              title="Edit"
            >
              <PencilSquareIcon className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </button>
            <button
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100"
              title="Deactivate"
            >
              <NoSymbolIcon className="h-4 w-4" />
              <span className="sr-only">Deactivate</span>
            </button>
          </div>
        )}
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="text-sm font-semibold">Admin Activity Logs</div>
        <ul className="mt-3 list-disc space-y-2 pl-4 text-sm">
          {adminLogs.map((log) => (
            <li key={log.id}>
              {log.date} - {log.action}
            </li>
          ))}
        </ul>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing?.id ? "Edit Admin" : "Add Admin"}>
        {editing ? (
          <div className="grid gap-3">
            <label className="text-sm">
              Name
              <input
                className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              />
            </label>
            <label className="text-sm">
              Email
              <input
                className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3"
                value={editing.email}
                onChange={(e) => setEditing({ ...editing, email: e.target.value })}
              />
            </label>
            <label className="text-sm">
              Role
              <select
                className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3"
                value={editing.role}
                onChange={(e) => setEditing({ ...editing, role: e.target.value })}
              >
                {ROLES.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              Status
              <select
                className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3"
                value={editing.status}
                onChange={(e) => setEditing({ ...editing, status: e.target.value })}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button
                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white" onClick={saveAdmin}>
                Save
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
