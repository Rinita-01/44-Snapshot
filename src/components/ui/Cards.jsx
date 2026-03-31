import React from "react";

export function StatCard({ title, value, delta, hint, accent }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border bg-white p-5 shadow-card" style={{ borderColor: accent }}>
      <div>
        <div className="text-xs text-slate-500">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
      <div className="text-right text-xs">
        <div className={delta?.startsWith("+") ? "font-bold text-emerald-600" : "font-bold text-rose-500"}>
          {delta}
        </div>
        <div className="text-slate-500">{hint}</div>
      </div>
    </div>
  );
}

export function InfoCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-3 text-sm font-semibold text-slate-700">{title}</div>
      <div>{children}</div>
    </div>
  );
}