import React from "react";
import { ChevronRightIcon, FolderIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function FolderCard({ folder, onOpen, onDelete, isDeleting = false }) {
  const handleDeleteClick = (event) => {
    event.stopPropagation();
    onDelete?.(event);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen?.();
    }
  };

  return (
    <div
      className="group cursor-pointer rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
      onClick={onOpen}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-700">
          <FolderIcon className="h-6 w-6" />
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleDeleteClick}
            disabled={isDeleting}
            type="button"
            aria-label={`Delete ${folder.name}`}
          >
            <TrashIcon className="h-4 w-4" />
          </button>
          <div
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition"
            aria-hidden="true"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </div>
        </div>
      </div>
      <div className="mt-5 block w-full text-left">
        <div className="text-lg font-semibold text-slate-900">{folder.name}</div>
      </div>
    </div>
  );
}
