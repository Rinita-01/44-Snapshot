import React, { useMemo, useState } from "react";
import { DataTable } from "../components/DataTable.jsx";
import { users as mockUsers } from "../data/mock.js";
import { useAuth } from "../components/AuthProvider.jsx";

export default function Users() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const rows = useMemo(() => {
    return mockUsers
      .filter((row) =>
        [row.name, row.email, row.id].some((val) => val.toLowerCase().includes(query.toLowerCase()))
      )
      .filter((row) => (filter === "All" ? true : row.status === filter))
      .map((row) => ({
        id: row.id,
        cells: [row.id, row.name, row.email, row.subscription, row.storage, row.registered, row.status]
      }));
  }, [query, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold">User Management</h2>
          <p className="text-sm text-slate-500">Monitor, suspend, or review user activity.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users"
          />
          <select
            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All</option>
            <option>Active</option>
            <option>Suspended</option>
          </select>
        </div>
      </div>
      <DataTable
        columns={[
          "User ID",
          "Name",
          "Email",
          "Subscription Status",
          "Storage Used",
          "Registration Date",
          "Status"
        ]}
        rows={rows}
        actions={(row) => (
          <div className="flex flex-wrap gap-2">
            <button className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold">Profile</button>
            <button className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold">Documents</button>
            <button className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold">Suspend</button>
            <button
              className="rounded-lg bg-rose-500 px-3 py-1 text-xs font-semibold text-white disabled:opacity-50"
              disabled={user.role === "Support Manager"}
            >
              Delete
            </button>
          </div>
        )}
      />
    </div>
  );
}