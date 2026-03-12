import React from "react";

export function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-20 grid place-items-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">{title}</div>
          <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}