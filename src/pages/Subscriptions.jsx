import React from "react";
import { DataTable } from "../components/DataTable.jsx";
import { subscriptions } from "../data/mock.js";

export default function Subscriptions() {
  const rows = subscriptions.map((sub) => ({
    id: sub.id,
    cells: [sub.user, sub.plan, sub.startDate, sub.nextBilling, sub.status]
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold">Subscription & Billing</h2>
          <p className="text-sm text-slate-500">Stripe for Android, Apple Pay for iOS.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold">Active: 94,230</span>
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold">Trial: 12,110</span>
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold">Expired: 3,890</span>
        </div>
      </div>
      <DataTable
        columns={["User", "Plan", "Start Date", "Next Billing", "Payment Status"]}
        rows={rows}
        actions={() => (
          <div className="flex flex-wrap gap-2">
            <button className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold">Invoice</button>
            <button className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold">Update</button>
          </div>
        )}
      />
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card md:flex-row md:items-center">
        <div>
          <div className="text-sm font-semibold">Revenue Summary</div>
          <div className="text-xs text-slate-500">Monthly recurring revenue: $1.42M</div>
        </div>
        <button className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white">Export Report</button>
      </div>
    </div>
  );
}