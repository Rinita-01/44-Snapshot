import React from "react";
import {
  ChevronRightIcon,
  FolderIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  getFolderMutedTextColor,
  getFolderTextColor,
  normalizeFolderColor,
} from "../utils/folderColors.js";

export default function FolderCard({
  folder,
  onOpen,
  onDelete,
  isDeleting = false,
  showDeleteAction = true,
}) {
  const backgroundColor = normalizeFolderColor(folder.color);
  const textColor = getFolderTextColor(backgroundColor);
  const mutedTextColor = getFolderMutedTextColor(backgroundColor);
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
      className="group rounded-3xl border border-slate-200 p-5 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg cursor-pointer"
      onClick={onOpen}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      style={{ backgroundColor, color: textColor }}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="grid h-12 w-12 place-items-center rounded-2xl"
          style={{
            backgroundColor:
              textColor === "#ffffff"
                ? "rgba(255, 255, 255, 0.18)"
                : "rgba(15, 23, 42, 0.08)",
            color: textColor,
          }}
        >
          <FolderIcon className="h-6 w-6" />
        </div>
        <div className="flex items-center gap-2">
          {showDeleteAction ? (
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm transition disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleDeleteClick}
              style={{
                borderColor:
                  textColor === "#ffffff"
                    ? "rgba(255,255,255,0.28)"
                    : "rgba(15,23,42,0.12)",
                color: mutedTextColor,
                backgroundColor:
                  textColor === "#ffffff"
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(255,255,255,0.55)",
              }}
              disabled={isDeleting}
              type="button"
              aria-label={`Delete ${folder.name}`}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          ) : null}
          <div
            className="inline-flex h-9 w-9 items-center justify-center rounded-full transition"
            style={{ color: mutedTextColor }}
            aria-hidden="true"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </div>
        </div>
      </div>
      <div className="mt-5 block w-full text-left">
        <div className="text-lg font-semibold">{folder.name}</div>
      </div>
    </div>
  );
}
