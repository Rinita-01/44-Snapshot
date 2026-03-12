import React, { useMemo, useState } from "react";
import DataTable from "../components/DataTable.jsx";
import Modal from "../components/Modal.jsx";
import { SkeletonTable } from "../components/Skeletons.jsx";
import { users as seedUsers } from "../data/dummyData.js";

const statuses = ["All", "Active", "Trial", "Suspended"];

const emptyForm = {
  name: "",
  email: "",
  joinDate: "2026-03-12",
  status: "Active",
  storageUsed: "0 GB",
  lastLogin: "2026-03-12"
};

export default function Users() {
  const [usersData, setUsersData] = useState(seedUsers);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [loading] = useState(false);
  const [modal, setModal] = useState({ open: false, type: "", user: null });
  const [form, setForm] = useState(emptyForm);
  const pageSize = 6;

  const filtered = useMemo(() => {
    return usersData.filter((user) => {
      const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "All" || user.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [search, status, usersData]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns = [
    { key: "name", label: "User Name" },
    { key: "email", label: "Email" },
    { key: "joinDate", label: "Join Date" },
    {
      key: "status",
      label: "Subscription Status",
      render: (row) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            row.status === "Active"
              ? "bg-emerald-50 text-emerald-700"
              : row.status === "Trial"
              ? "bg-amber-50 text-amber-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {row.status}
        </span>
      )
    },
    { key: "storageUsed", label: "Storage Used" },
    { key: "lastLogin", label: "Last Login" }
  ];

  const openAdd = () => {
    setForm(emptyForm);
    setModal({ open: true, type: "add", user: null });
  };

  const openEdit = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      joinDate: user.joinDate,
      status: user.status,
      storageUsed: user.storageUsed,
      lastLogin: user.lastLogin
    });
    setModal({ open: true, type: "edit", user });
  };

  const openView = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      joinDate: user.joinDate,
      status: user.status,
      storageUsed: user.storageUsed,
      lastLogin: user.lastLogin
    });
    setModal({ open: true, type: "view", user });
  };

  const openSuspend = (user) => {
    setModal({ open: true, type: "suspend", user });
  };

  const openDelete = (user) => {
    setModal({ open: true, type: "delete", user });
  };

  const closeModal = () => setModal({ open: false, type: "", user: null });

  const handleSave = () => {
    if (!form.name || !form.email) return;
    if (modal.type === "add") {
      const nextId = `u${usersData.length + 1}`;
      setUsersData((prev) => [
        {
          id: nextId,
          ...form
        },
        ...prev
      ]);
    }
    if (modal.type === "edit" && modal.user) {
      setUsersData((prev) =>
        prev.map((item) => (item.id === modal.user.id ? { ...item, ...form } : item))
      );
    }
    closeModal();
  };

  const handleSuspend = () => {
    if (!modal.user) return;
    setUsersData((prev) =>
      prev.map((item) => (item.id === modal.user.id ? { ...item, status: "Suspended" } : item))
    );
    closeModal();
  };

  const handleDelete = () => {
    if (!modal.user) return;
    setUsersData((prev) => prev.filter((item) => item.id !== modal.user.id));
    closeModal();
  };

  const readOnly = modal.type === "view";

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <div className="text-2xl font-semibold">User Management</div>
        <p className="mt-2 text-sm text-slate-500">Manage accounts, subscriptions, and storage consumption.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <input
            className="h-10 w-full max-w-xs rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm"
            placeholder="Search by name or email"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
          <select
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            {statuses.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <button
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm"
          onClick={openAdd}
          type="button"
        >
          Add User
        </button>
      </div>

      {loading ? (
        <SkeletonTable />
      ) : (
        <DataTable
          columns={columns}
          data={paginated}
          actions={(row) => (
            <div className="flex flex-wrap gap-2">
              <button
                className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
                onClick={() => openView(row)}
                type="button"
              >
                View
              </button>
              <button
                className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
                onClick={() => openEdit(row)}
                type="button"
              >
                Edit
              </button>
              <button
                className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700"
                onClick={() => openSuspend(row)}
                type="button"
              >
                Suspend
              </button>
              <button
                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700"
                onClick={() => openDelete(row)}
                type="button"
              >
                Delete
              </button>
            </div>
          )}
        />
      )}

      <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div>
          Showing {paginated.length} of {filtered.length} users
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border border-slate-200 px-3 py-1"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              className={`h-8 w-8 rounded-lg border ${
                page === idx + 1 ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200"
              }`}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button
            className="rounded-lg border border-slate-200 px-3 py-1"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Next
          </button>
        </div>
      </div>

      <Modal
        open={modal.open}
        title={
          modal.type === "add"
            ? "Add User"
            : modal.type === "edit"
            ? "Edit User"
            : modal.type === "view"
            ? "User Details"
            : modal.type === "suspend"
            ? "Suspend User"
            : "Delete User"
        }
        onClose={closeModal}
        actions={
          modal.type === "suspend" ? (
            <>
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={closeModal} type="button">
                Cancel
              </button>
              <button className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white" onClick={handleSuspend} type="button">
                Confirm Suspend
              </button>
            </>
          ) : modal.type === "delete" ? (
            <>
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={closeModal} type="button">
                Cancel
              </button>
              <button className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white" onClick={handleDelete} type="button">
                Delete User
              </button>
            </>
          ) : modal.type === "view" ? (
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={closeModal} type="button">
              Close
            </button>
          ) : (
            <>
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={closeModal} type="button">
                Cancel
              </button>
              <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={handleSave} type="button">
                Save
              </button>
            </>
          )
        }
      >
        {(modal.type === "add" || modal.type === "edit" || modal.type === "view") && (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-slate-600">
              User Name
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                disabled={readOnly}
              />
            </label>
            <label className="text-sm text-slate-600">
              Email
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                disabled={readOnly}
              />
            </label>
            <label className="text-sm text-slate-600">
              Join Date
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.joinDate}
                onChange={(event) => setForm((prev) => ({ ...prev, joinDate: event.target.value }))}
                disabled={readOnly}
              />
            </label>
            <label className="text-sm text-slate-600">
              Subscription Status
              <select
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.status}
                onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                disabled={readOnly}
              >
                {statuses.filter((item) => item !== "All").map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="text-sm text-slate-600">
              Storage Used
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.storageUsed}
                onChange={(event) => setForm((prev) => ({ ...prev, storageUsed: event.target.value }))}
                disabled={readOnly}
              />
            </label>
            <label className="text-sm text-slate-600">
              Last Login
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.lastLogin}
                onChange={(event) => setForm((prev) => ({ ...prev, lastLogin: event.target.value }))}
                disabled={readOnly}
              />
            </label>
          </div>
        )}

        {modal.type === "suspend" && modal.user ? (
          <div className="text-sm text-slate-600">
            Suspend <span className="font-semibold text-slate-900">{modal.user.name}</span> and pause their access?
          </div>
        ) : null}

        {modal.type === "delete" && modal.user ? (
          <div className="text-sm text-slate-600">
            Delete <span className="font-semibold text-slate-900">{modal.user.name}</span> permanently from the admin dashboard?
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
