import React, { useEffect, useMemo, useState } from "react";
import { InformationCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import DataTable from "../../components/ui/DataTable.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { SkeletonTable } from "../../components/ui/Skeletons.jsx";
import { supportApi } from "../../api";
import { getApiErrorMessage } from "../../api/helpers.js";
import { useToast } from "../../components/ui/Toast.jsx";

const normalizeSupportRequest = (req, index = 0) => ({
  id: req?.id || req?._id || `support-req-${index}`,
  name: req?.name || req?.user?.name || "Anonymous",
  email: req?.email || req?.user?.email || "No Email",
  message: req?.message || "No Message",
  status: req?.status || "open",
  createdAt: req?.createdAt || req?.timestamp || null,
  user: req?.user || null
});

export default function Support() {
  const [modal, setModal] = useState({ open: false, type: "", row: null });
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { pushToast } = useToast();

  const fetchSupportRequests = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await supportApi.getSupportRequests();
      const rawData = response?.data || [];
      const normalizedData = rawData.map(normalizeSupportRequest);
      setTickets(normalizedData);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load support requests."));
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSupportRequests();
  }, []);

  const handleDeleteTicket = async () => {
    if (!modal.row) return;
    setIsDeleting(true);
    try {
      await supportApi.deleteSupportRequest(modal.row.id);
      setTickets((prev) => prev.filter((t) => t.id !== modal.row.id));
      pushToast("Support request deleted successfully.", "success");
      setModal({ open: false, type: "", row: null });
    } catch (err) {
      pushToast(getApiErrorMessage(err, "Failed to delete support request."), "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setIsUpdatingStatus(true);
    try {
      await supportApi.updateSupportTicketStatus(id, newStatus);
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
      );
      if (modal.row && modal.row.id === id) {
        setModal((prev) => ({
          ...prev,
          row: { ...prev.row, status: newStatus },
        }));
      }
      pushToast(`Status updated to "${newStatus.replace("_", " ")}"`, "success");
    } catch (err) {
      pushToast(getApiErrorMessage(err, "Failed to update status."), "error");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const columns = useMemo(() => ([
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "message",
      label: "Message",
      render: (row) => (
        <span className="block max-w-xs truncate" title={row.message}>
          {row.message}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        return (
          <select
            value={row.status}
            onChange={(e) => handleStatusChange(row.id, e.target.value)}
            disabled={isUpdatingStatus}
            className={`rounded-xl border px-3 py-1.5 text-xs font-semibold shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 disabled:opacity-50 transition cursor-pointer ${
              row.status === "open"
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : row.status === "in_progress"
                ? "border-amber-200 bg-amber-50 text-amber-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        );
      },
    },
  ]), []);

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-2xl font-semibold">Support Requests</div>
          <p className="mt-2 text-sm text-slate-500">View, manage, and process user support tickets.</p>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 animate-fade-in">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <SkeletonTable />
      ) : (
        <DataTable
          columns={columns}
          data={tickets}
          emptyMessage="No support requests found."
          actions={(row) => (
            <div className="flex items-center gap-2">
              <button
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                onClick={() => setModal({ open: true, type: "details", row })}
                title="Details"
                type="button"
              >
                <InformationCircleIcon className="h-4 w-4" />
                <span className="sr-only">Details</span>
              </button>
              <button
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100"
                onClick={() => setModal({ open: true, type: "delete", row })}
                title="Delete"
                type="button"
              >
                <TrashIcon className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </button>
            </div>
          )}
        />
      )}

      <Modal
        actions={
          modal.type === "details" ? (
            <button
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
              onClick={() => setModal({ open: false, type: "", row: null })}
              type="button"
            >
              Close
            </button>
          ) : (
            <>
              <button
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
                onClick={() => setModal({ open: false, type: "", row: null })}
                type="button"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition disabled:opacity-50"
                onClick={handleDeleteTicket}
                type="button"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </>
          )
        }
        onClose={() => setModal({ open: false, type: "", row: null })}
        open={modal.open}
        title={modal.type === "details" ? "Support Request Details" : "Delete Support Request"}
      >
        {modal.type === "details" && modal.row && (
          <div className="space-y-4">
            <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <div>
                <div className="text-xs text-slate-400">Name</div>
                <div className="font-semibold text-slate-900">{modal.row.name}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Email</div>
                <div className="font-semibold text-slate-900">{modal.row.email}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Date Submitted</div>
                <div className="font-semibold text-slate-900">
                  {modal.row.createdAt ? new Date(modal.row.createdAt).toLocaleString() : "N/A"}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Current Status</div>
                <div className="mt-1 flex items-center gap-2">
                  {modal.row.status === "open" && (
                    <span className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                      Open
                    </span>
                  )}
                  {modal.row.status === "in_progress" && (
                    <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                      In Progress
                    </span>
                  )}
                  {modal.row.status === "closed" && (
                    <span className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      Closed
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <div className="text-xs text-slate-400 mb-1">Message</div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700 whitespace-pre-wrap break-words leading-relaxed max-h-48 overflow-y-auto">
                {modal.row.message}
              </div>
            </div>
          </div>
        )}

        {modal.type === "delete" && modal.row && (
          <p className="text-sm text-slate-600">
            Are you sure you want to permanently delete the support request from{" "}
            <span className="font-semibold text-slate-900">{modal.row.name}</span> ({modal.row.email})?
            This action cannot be undone.
          </p>
        )}
      </Modal>
    </div>
  );
}
