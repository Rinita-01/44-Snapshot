import React, { useEffect, useMemo, useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import DataTable from "../../components/ui/DataTable.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { PageLoader } from "../../components/ui/Skeletons.jsx";
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
  const [modal, setModal] = useState({ open: false, row: null });
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
      <div>
        <div className="text-2xl font-semibold">Activity Logs</div>
        <p className="mt-2 text-sm text-slate-500">Audit admin actions and system events.</p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <PageLoader title="Loading Activity Logs" message="Fetching activity logs from the server..." />
      ) : (
        <DataTable
          columns={columns}
          data={logs}
          emptyMessage="No activity logs found."
          actions={(row) => (
            <button
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100"
              onClick={() => setModal({ open: true, row })}
              title="Details"
              type="button"
            >
              <InformationCircleIcon className="h-4 w-4" />
              <span className="sr-only">Details</span>
            </button>
          )}
        />
      )}

      <Modal
        actions={(
          <button
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            onClick={() => setModal({ open: false, row: null })}
            type="button"
          >
            Close
          </button>
        )}
        onClose={() => setModal({ open: false, row: null })}
        open={modal.open}
        title="Log Details"
      >
        {modal.row ? (
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
        ) : null}
      </Modal>
    </div>
  );
}
