import React, { useEffect, useMemo, useState } from "react";
import { InformationCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import DataTable from "../../components/ui/DataTable.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { SkeletonTable } from "../../components/ui/Skeletons.jsx";
import { activityApi } from "../../api";
import { getApiErrorMessage } from "../../api/helpers.js";

const getActivityLogsFromResponse = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.logs)) return payload.logs;
  if (Array.isArray(payload?.data?.logs)) return payload.data.logs;
  if (Array.isArray(payload?.results)) return payload.results;

  return [];
};

const normalizeActivityLog = (log, index = 0) => ({
  ...log,
  id: log?.id || log?._id || `activity-log-${index}`,
  user: log?.user || log?.userName || log?.actor || "Unknown",
  action: log?.action || log?.activity || log?.description || "N/A",
  date: log?.date || log?.createdAt || log?.timestamp || "N/A",
  ip: log?.ip || log?.ipAddress || log?.ip_address || "N/A"
});

export default function ActivityLogs() {
  const [modal, setModal] = useState({ open: false, type: "", row: null });
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteLog = async () => {
    if (!modal.row) return;
    setIsDeleting(true);
    setError("");
    try {
      await activityApi.deleteActivityLog(modal.row.id);
      setLogs((prev) => prev.filter((log) => log.id !== modal.row.id));
      setModal({ open: false, type: "", row: null });
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to delete activity log."));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAllLogs = async () => {
    setIsDeleting(true);
    setError("");
    try {
      await activityApi.deleteAllActivityLogs();
      setLogs([]);
      setModal({ open: false, type: "", row: null });
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to delete all activity logs."));
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchActivityLogs = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await activityApi.getActivityLogs();
        const nextLogs = getActivityLogsFromResponse(response).map(normalizeActivityLog);

        if (isMounted) {
          setLogs(nextLogs);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(getApiErrorMessage(fetchError, "Failed to load activity logs."));
          setLogs([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchActivityLogs();

    return () => {
      isMounted = false;
    };
  }, []);

  const columns = useMemo(() => ([
    { key: "user", label: "User" },
    { key: "action", label: "Action" },
    { key: "date", label: "Date" },
    { key: "ip", label: "IP Address" }
  ]), []);

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-2xl font-semibold">Activity Logs</div>
          <p className="mt-2 text-sm text-slate-500">Audit admin actions and system events.</p>
        </div>
        {!isLoading && logs.length > 0 && (
          <button
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 transition"
            onClick={() => setModal({ open: true, type: "deleteAll", row: null })}
            type="button"
          >
            Delete All
          </button>
        )}
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
          data={logs}
          emptyMessage="No activity logs found."
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
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              onClick={() => setModal({ open: false, type: "", row: null })}
              type="button"
            >
              Close
            </button>
          ) : (
            <>
              <button
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
                onClick={() => setModal({ open: false, type: "", row: null })}
                type="button"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                onClick={modal.type === "delete" ? handleDeleteLog : handleDeleteAllLogs}
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
        title={
          modal.type === "details"
            ? "Log Details"
            : modal.type === "delete"
              ? "Delete Log"
              : "Delete All Logs"
        }
      >
        {modal.type === "details" && modal.row && (
          <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            <div>
              <div className="text-xs text-slate-400">User</div>
              <div className="font-semibold text-slate-900">{modal.row.user}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Action</div>
              <div className="font-semibold text-slate-900">{modal.row.action}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Date</div>
              <div className="font-semibold text-slate-900">{modal.row.date}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">IP Address</div>
              <div className="font-semibold text-slate-900">{modal.row.ip}</div>
            </div>
          </div>
        )}

        {modal.type === "delete" && modal.row && (
          <p className="text-sm text-slate-600">
            Are you sure you want to permanently delete this log of action:{"  "}
            <span className="font-semibold text-slate-900">"{modal.row.action}"</span>?
          </p>
        )}

        {modal.type === "deleteAll" && (
          <p className="text-sm text-slate-600">
            Are you sure you want to permanently delete <span className="font-semibold text-rose-600 font-bold">ALL</span> activity logs? This action cannot be undone.
          </p>
        )}
      </Modal>
    </div>
  );
}
