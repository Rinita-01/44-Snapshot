import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import FolderModal from "../../features/reminders/components/FolderModal.jsx";
import FolderCard from "../../features/reminders/components/FolderCard.jsx";
import { useFolderStore } from "../../features/folders/context/FolderContext.jsx";

export default function Folders() {
  const navigate = useNavigate();
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const { folders, createFolder } = useFolderStore();

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-600">Folder Workspace</div>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Folders and template-driven entries</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Organize entries into folders, assign a template once, and manage repeatable records with reminder and snooze controls.
            </p>
          </div>
          <button
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm"
            onClick={() => setFolderModalOpen(true)}
            type="button"
          >
            <PlusIcon className="h-5 w-5" />
            New Folder
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {folders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              onOpen={() => navigate(`/folders/${folder.id}`)}
            />
          ))}
        </div>

        {!folders.length ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <div className="text-lg font-semibold text-slate-800">No folders yet</div>
            <div className="mt-2 text-sm text-slate-500">Create your first folder using the top-right plus action.</div>
          </div>
        ) : null}
      </div>

      <FolderModal
        modalTitle="Create Folder"
        onClose={() => setFolderModalOpen(false)}
        onSubmit={(payload) => {
          createFolder(payload);
          setFolderModalOpen(false);
        }}
        open={folderModalOpen}
      />
    </>
  );
}
