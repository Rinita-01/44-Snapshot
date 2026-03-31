import React from "react";

export default function ChartCard({ title, subtitle, children, action }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-800">{title}</div>
          {subtitle ? <div className="text-xs text-slate-500">{subtitle}</div> : null}
        </div>
        {action ? <div className="text-xs text-slate-500">{action}</div> : null}
      </div>
      <div className="mt-4 h-64">{children}</div>
    </div>
  );
}
