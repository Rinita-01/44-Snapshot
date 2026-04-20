import React from "react";
import { ChevronRightIcon, FolderIcon } from "@heroicons/react/24/outline";
import { getFolderTextColor, getFolderMutedTextColor, normalizeFolderColor } from "../../folders/utils/folderColors.js";

export default function FolderCard({ folder, onOpen }) {
  const backgroundColor = normalizeFolderColor(folder.color);
  const textColor = getFolderTextColor(backgroundColor);
  const mutedTextColor = getFolderMutedTextColor(backgroundColor);

  return (
    <button
      className="group flex w-full flex-col rounded-3xl border border-slate-200 p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
      onClick={onOpen}
      style={{ backgroundColor, color: textColor }}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl" style={{ backgroundColor: textColor === "#ffffff" ? "rgba(255, 255, 255, 0.18)" : "rgba(15, 23, 42, 0.08)", color: textColor }}>
          <FolderIcon className="h-6 w-6" />
        </div>
        <ChevronRightIcon className="h-5 w-5 transition" style={{ color: mutedTextColor }} />
      </div>
      <div className="mt-5">
        <div className="text-lg font-semibold">{folder.name}</div>
      </div>
    </button>
  );
}
