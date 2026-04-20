import React, { useState } from "react";
import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Link, Navigate, useParams } from "react-router-dom";
import DynamicEntryForm from "../../features/reminders/components/DynamicEntryForm.jsx";
import EntryCard from "../../features/reminders/components/EntryCard.jsx";
import { useFolderStore } from "../../features/folders/context/FolderContext.jsx";
import { getFolderMutedTextColor, getFolderTextColor, normalizeFolderColor } from "../../features/folders/utils/folderColors.js";

export default function FolderDetails() {
  const { folderId } = useParams();
  const [entryModalOpen, setEntryModalOpen] = useState(false);
  const { getFolderById, templates, addEntries, snoozeEntry, snoozeOptions } = useFolderStore();

  const folder = getFolderById(folderId);

  if (!folder) {
    return <Navigate to="/folders" replace />;
  }

  const template = templates[folder.template];
  const backgroundColor = normalizeFolderColor(folder.color);
  const textColor = getFolderTextColor(backgroundColor);
  const mutedTextColor = getFolderMutedTextColor(backgroundColor);

  return (
    <>
      <div className="space-y-8">
        <div
          className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 p-6 shadow-xl md:flex-row md:items-start md:justify-between"
          style={{ backgroundColor, color: textColor }}
        >
          <div>
            <Link className="inline-flex items-center gap-2 text-sm font-semibold transition" style={{ color: mutedTextColor }} to="/folders">
              <ArrowLeftIcon className="h-4 w-4" />
              Back to folders
            </Link>
            <h1 className="mt-2 text-3xl font-bold">{folder.name}</h1>
            <p className="mt-2 max-w-2xl text-sm" style={{ color: mutedTextColor }}>
              Add one or many entries from this folder. The plus action on this page is reserved for entry creation only.
            </p>
          </div>
          <button
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold shadow-sm"
            onClick={() => setEntryModalOpen(true)}
            style={{ backgroundColor: textColor, color: backgroundColor }}
            type="button"
          >
            <PlusIcon className="h-5 w-5" />
            Add Entry
          </button>
        </div>

        {folder.entries.length ? (
          <div className="space-y-4">
            {folder.entries.map((entry) => (
              <EntryCard
                entry={entry}
                key={entry.id}
                onSnooze={(snoozeValue) => snoozeEntry(folder.id, entry.id, snoozeValue)}
                snoozeOptions={snoozeOptions}
                template={template}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <div className="text-lg font-semibold text-slate-800">No entries in this folder yet</div>
            <div className="mt-2 text-sm text-slate-500">Use the top-right plus action to add one or more entries.</div>
          </div>
        )}
      </div>

      <DynamicEntryForm
        folderName={folder.name}
        onClose={() => setEntryModalOpen(false)}
        onSubmit={async (entries) => {
          await addEntries(folder.id, entries);
          setEntryModalOpen(false);
        }}
        open={entryModalOpen}
        template={template}
      />
    </>
  );
}
