import React from "react";

export default function StatsCard({ title, value, delta, caption, icon: Icon, accent }) {
  return (
    <div
      className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
      style={accent ? { borderColor: accent } : undefined}
    >
      <div>
        <div className="text-xs font-semibold text-slate-500">{title}</div>
        <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
        <div className="mt-1 text-xs text-slate-500">{caption}</div>
      </div>
      <div className="flex flex-col items-end gap-2">
        {Icon ? (
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white shadow-sm">
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
        {delta ? (
          <span
            className={`text-xs font-semibold ${
              delta.startsWith("+") ? "text-emerald-600" : "text-rose-500"
            }`}
          >
            {delta}
          </span>
        ) : null}
      </div>
    </div>
  );
}
