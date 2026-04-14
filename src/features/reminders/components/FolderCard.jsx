import React from "react";
import { ChevronRightIcon, FolderIcon } from "@heroicons/react/24/outline";

export default function FolderCard({ folder, onOpen }) {
  return (
    <button
      className="group flex w-full flex-col rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
      onClick={onOpen}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-700">
          <FolderIcon className="h-6 w-6" />
        </div>
        <ChevronRightIcon className="h-5 w-5 text-slate-300 transition group-hover:text-slate-500" />
      </div>
      <div className="mt-5">
        <div className="text-lg font-semibold text-slate-900">{folder.name}</div>
      </div>
    </button>
  );
}
