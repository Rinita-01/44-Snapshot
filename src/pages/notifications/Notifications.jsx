import React, { useState, useEffect } from "react";
import { EyeIcon, TrashIcon, CheckIcon } from "@heroicons/react/24/outline";
import DataTable from "../../components/ui/DataTable.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { SkeletonTable } from "../../components/ui/Skeletons.jsx";
import { notificationApi } from "../../api";
import { getApiErrorMessage } from "../../api/helpers.js";

export default function Notifications() {
  const [modal, setModal] = useState({ open: false, type: "", row: null });
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const columns = [
    { key: "title", label: "Title" },
    { key: "message", label: "Message" },
    {
      key: "createdAt",
      label: "Date",
      render: (row) => {
        if (!row.createdAt) return "N/A";
        try {
          return new Date(row.createdAt).toLocaleString();
        } catch {
          return row.createdAt;
        }
      }
    },
    {
      key: "isRead",
      label: "Status",
      render: (row) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            row.isRead
              ? "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
              : "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
          }`}
        >
          {row.isRead ? "Read" : "Unread"}
        </span>
      )
    }
  ];

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await notificationApi.getNotifications();
      const responseData = response?.data || response;
      setData(Array.isArray(responseData) ? responseData : []);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load notifications."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const openModal = (type, row) => setModal({ open: true, type, row });
  const closeModal = () => setModal({ open: false, type: "", row: null });

  const handleView = async (row) => {
    openModal("view", row);
    if (!row.isRead) {
      try {
        await notificationApi.markAsRead(row._id || row.id);
        setData((prev) =>
          prev.map((item) =>
            (item._id || item.id) === (row._id || row.id) ? { ...item, isRead: true } : item
          )
        );
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    }
  };

  const handleMarkAsRead = async (row) => {
    try {
      await notificationApi.markAsRead(row._id || row.id);
      setData((prev) =>
        prev.map((item) =>
          (item._id || item.id) === (row._id || row.id) ? { ...item, isRead: true } : item
        )
      );
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to mark notification as read."));
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setData((prev) => prev.map((item) => ({ ...item, isRead: true })));
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to mark all notifications as read."));
    }
  };

  const handleDelete = async () => {
    if (!modal.row) return;
    setIsProcessing(true);
    setError("");
    try {
      const id = modal.row._id || modal.row.id;
      await notificationApi.deleteNotification(id);
      setData((prev) => prev.filter((item) => (item._id || item.id) !== id));
      closeModal();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to delete notification."));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteAll = async () => {
    setIsProcessing(true);
    setError("");
    try {
      await notificationApi.deleteAllNotifications();
      setData([]);
      closeModal();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to delete all notifications."));
    } finally {
      setIsProcessing(false);
    }
  };

  const hasUnread = data.some((n) => !n.isRead);

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-2xl font-semibold">Notifications & Alerts</div>
          <p className="mt-2 text-sm text-slate-500">Track reminders sent for upcoming renewals and account alerts.</p>
        </div>
        <div className="flex items-center gap-3">
          {hasUnread && (
            <button
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              onClick={handleMarkAllAsRead}
              type="button"
            >
              Mark All as Read
            </button>
          )}
          {data.length > 0 && (
            <button
              className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 transition"
              onClick={() => openModal("deleteAll", null)}
              type="button"
            >
              Delete All
            </button>
          )}
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
          data={data}
          emptyMessage="No notifications found."
          actions={(row) => (
            <div className="flex items-center gap-2">
              <button
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                onClick={() => handleView(row)}
                type="button"
                title="View"
              >
                <EyeIcon className="h-4 w-4" />
                <span className="sr-only">View</span>
              </button>
              {!row.isRead && (
                <button
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
                  onClick={() => handleMarkAsRead(row)}
                  type="button"
                  title="Mark as Read"
                >
                  <CheckIcon className="h-4 w-4" />
                  <span className="sr-only">Mark as Read</span>
                </button>
              )}
              <button
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100"
                onClick={() => openModal("delete", row)}
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

      <Modal
        open={modal.open}
        title={
          modal.type === "view"
            ? "Alert Details"
            : modal.type === "delete"
            ? "Delete Notification"
            : "Delete All Notifications"
        }
        onClose={closeModal}
        actions={
          modal.type === "view" ? (
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={closeModal} type="button">
              Close
            </button>
          ) : (
            <>
              <button
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
                onClick={closeModal}
                type="button"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition disabled:opacity-50"
                onClick={modal.type === "delete" ? handleDelete : handleDeleteAll}
                type="button"
                disabled={isProcessing}
              >
                {isProcessing ? "Deleting..." : "Delete"}
              </button>
            </>
          )
        }
      >
        {modal.row && modal.type === "view" ? (
          <div className="space-y-4 text-sm text-slate-600">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <div className="text-xs text-slate-400">Title</div>
                <div className="font-semibold text-slate-900">{modal.row.title}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Sent At</div>
                <div className="font-semibold text-slate-900">
                  {modal.row.createdAt ? new Date(modal.row.createdAt).toLocaleString() : "N/A"}
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Status</div>
              <span
                className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  modal.row.isRead
                    ? "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                    : "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                }`}
              >
                {modal.row.isRead ? "Read" : "Unread"}
              </span>
            </div>
            <div className="border-t border-slate-100 pt-3">
              <div className="text-xs text-slate-400">Message</div>
              <div className="mt-1 text-slate-900 bg-slate-50 rounded-xl p-3 border border-slate-100 whitespace-pre-wrap leading-relaxed">
                {modal.row.message}
              </div>
            </div>
          </div>
        ) : null}

        {modal.type === "delete" && modal.row ? (
          <div className="text-sm text-slate-600">
            Are you sure you want to permanently delete this notification:{" "}
            <span className="font-semibold text-slate-900">"{modal.row.title}"</span>?
          </div>
        ) : null}

        {modal.type === "deleteAll" ? (
          <div className="text-sm text-slate-600">
            Are you sure you want to permanently delete <span className="font-semibold text-rose-600">ALL</span> notifications? This action cannot be undone.
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
