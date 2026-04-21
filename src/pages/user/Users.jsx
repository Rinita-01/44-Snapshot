import React, { useEffect, useMemo, useState } from "react";
import { EyeIcon, PencilSquareIcon, PauseCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import DataTable from "../../components/ui/DataTable.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { PageLoader } from "../../components/ui/Skeletons.jsx";
import { userApi } from "../../api";
import { getApiErrorMessage } from "../../api/helpers.js";

const statuses = ["All", "Active", "Trial", "Suspended"];

const getStatusClasses = (value) =>
  value === "Active"
    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
    : value === "Trial"
      ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
      : "bg-rose-50 text-rose-700 ring-1 ring-rose-200";

const emptyForm = {
  name: "",
  email: "",
  joinDate: "2026-03-12",
  status: "Active",
  storageUsed: "0 GB",
  lastLogin: "2026-03-12",
  price: "$0"
};

const getUsersFromResponse = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.users)) return payload.users;
  if (Array.isArray(payload?.data?.users)) return payload.data.users;
  if (Array.isArray(payload?.results)) return payload.results;

  return [];
};

const getUpdatedUserFromResponse = (payload) => {
  if (!payload || typeof payload !== "object") return null;
  if (payload.user && typeof payload.user === "object") return payload.user;
  if (payload.data?.user && typeof payload.data.user === "object") return payload.data.user;
  if (payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)) return payload.data;
  if (payload.result && typeof payload.result === "object") return payload.result;

  return null;
};

const normalizeUser = (user, index = 0) => ({
  ...user,
  id: user?.id || user?._id || `user-${index}`,
  name: user?.name || user?.fullName || user?.username || "Unknown",
  email: user?.email || "N/A",
  joinDate: user?.joinDate || user?.createdAt || user?.registeredAt || "N/A",
  status: user?.status || user?.subscriptionStatus || user?.planStatus || "Active",
  storageUsed: user?.storageUsed || user?.storage || user?.storageUsage || "0 GB",
  lastLogin: user?.lastLogin || user?.lastSeen || user?.updatedAt || "N/A",
  price: user?.price || user?.amount || user?.planPrice || "$0"
});

export default function Users() {
  const [usersData, setUsersData] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");
  const [modal, setModal] = useState({ open: false, type: "", user: null });
  const [form, setForm] = useState(emptyForm);
  const pageSize = 6;

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await userApi.getUsers();
        const nextUsers = getUsersFromResponse(response).map(normalizeUser);

        if (isMounted) {
          setUsersData(nextUsers);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(getApiErrorMessage(fetchError, "Failed to load users."));
          setUsersData([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

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
    { key: "price", label: "Price" },
    {
      key: "status",
      label: "Subscription Status",
      render: (row) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(row.status)}`}
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
    setModalError("");
    setModal({ open: true, type: "add", user: null });
  };

  const openEdit = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      joinDate: user.joinDate,
      status: user.status,
      storageUsed: user.storageUsed,
      lastLogin: user.lastLogin,
      price: user.price
    });
    setModalError("");
    setModal({ open: true, type: "edit", user });
  };

  const openView = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      joinDate: user.joinDate,
      status: user.status,
      storageUsed: user.storageUsed,
      lastLogin: user.lastLogin,
      price: user.price
    });
    setModalError("");
    setModal({ open: true, type: "view", user });
  };

  const openSuspend = (user) => {
    setModalError("");
    setModal({ open: true, type: "suspend", user });
  };

  const openDelete = (user) => {
    setModalError("");
    setModal({ open: true, type: "delete", user });
  };

  const closeModal = () => {
    setModalError("");
    setModal({ open: false, type: "", user: null });
  };

  const handleSave = async () => {
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
      closeModal();
      return;
    }

    if (modal.type === "edit" && modal.user) {
      setIsSaving(true);
      setModalError("");

      try {
        const payload = {

          userId: modal.user.id,
          _id: modal.user._id,
          name: form.name,
          email: form.email,
          joinDate: form.joinDate,
          status: form.status,
          storageUsed: form.storageUsed,
          lastLogin: form.lastLogin,
          price: form.price
        };

        const response = await userApi.updateUser(payload, modal.user.id,);
        const updatedUser = getUpdatedUserFromResponse(response);
        const nextUser = normalizeUser(
          updatedUser ? { ...modal.user, ...updatedUser } : { ...modal.user, ...form }
        );

        setUsersData((prev) =>
          prev.map((item) => (item.id === modal.user.id ? nextUser : item))
        );
        closeModal();
      } catch (saveError) {
        setModalError(getApiErrorMessage(saveError, "Failed to update user."));
      } finally {
        setIsSaving(false);
      }

      return;
    }
  };

  const handleSuspend = () => {
    if (!modal.user) return;
    setUsersData((prev) =>
      prev.map((item) => (item.id === modal.user.id ? { ...item, status: "Suspended" } : item))
    );
    closeModal();
  };

  const handleDelete = async () => {
    if (!modal.user) return;

    const userId = modal.user._id || modal.user.id;
    if (!userId) {
      setModalError("Unable to determine which user to delete.");
      return;
    }

    setIsDeleting(true);
    setModalError("");

    try {
      await userApi.deleteUser({}, userId);

      setUsersData((prev) => {
        const nextUsers = prev.filter((item) => item.id !== modal.user.id);
        const nextTotalPages = Math.max(1, Math.ceil(nextUsers.length / pageSize));

        setPage((currentPage) => Math.min(currentPage, nextTotalPages));
        return nextUsers;
      });

      closeModal();
    } catch (deleteError) {
      setModalError(getApiErrorMessage(deleteError, "Failed to delete user."));
    } finally {
      setIsDeleting(false);
    }
  };

  const readOnly = modal.type === "view";
  const profileInitials = form.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <div className="text-2xl font-semibold">User Management</div>
        <p className="mt-2 text-sm text-slate-500">Manage accounts, subscriptions, and storage consumption.</p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

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
        <PageLoader title="Loading Users" message="Fetching user data from the server..." />
      ) : (
        <DataTable
          columns={columns}
          data={paginated}
          emptyMessage="No users found."
          actions={(row) => (
            <div className="flex items-center gap-2">
              <button
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                onClick={() => openView(row)}
                type="button"
                title="View"
              >
                <EyeIcon className="h-4 w-4" />
                <span className="sr-only">View</span>
              </button>
              <button
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                onClick={() => openEdit(row)}
                type="button"
                title="Edit"
              >
                <PencilSquareIcon className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </button>
              {/* <button
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-700 transition hover:bg-amber-100"
                onClick={() => openSuspend(row)}
                type="button"
                title="Suspend"
              >
                <PauseCircleIcon className="h-4 w-4" />
                <span className="sr-only">Suspend</span>
              </button> */}
              <button
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100"
                onClick={() => openDelete(row)}
                type="button"
                title="Delete"
              >
                <TrashIcon className="h-4 w-4" />
                <span className="sr-only">Delete</span>
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
              className={`h-8 w-8 rounded-lg border ${page === idx + 1 ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200"
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
              <button
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isDeleting}
                onClick={handleDelete}
                type="button"
              >
                {isDeleting ? "Deleting..." : "Delete User"}
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
              <button
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSaving}
                onClick={handleSave}
                type="button"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </>
          )
        }
      >
        {modalError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {modalError}
          </div>
        ) : null}

        {(modal.type === "add" || modal.type === "edit") && (
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
              Price
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.price}
                onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                disabled={readOnly}
              />
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

        {modal.type === "view" && modal.user ? (
          <div className="space-y-5">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="grid h-14 w-14 place-items-center rounded-xl border border-slate-200 bg-white text-base font-semibold text-slate-700">
                {profileInitials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg font-semibold text-slate-900">{form.name}</div>
                <div className="truncate text-sm text-slate-500">{form.email}</div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(form.status)}`}>
                {form.status}
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200">
              {[
                { label: "Email Address", value: form.email },
                { label: "Join Date", value: form.joinDate },
                { label: "Price", value: form.price },
                { label: "Storage Used", value: form.storageUsed },
                { label: "Last Login", value: form.lastLogin }
              ].map((item, index, array) => (
                <div
                  key={item.label}
                  className={`flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${index !== array.length - 1 ? "border-b border-slate-200" : ""
                    }`}
                >
                  <div className="text-sm font-medium text-slate-500">{item.label}</div>
                  <div className="text-sm text-slate-900">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

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
