import React, { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { folderApi } from "@/api";
import { getApiErrorMessage } from "@/api/helpers";
import Modal from "../../components/ui/Modal.jsx";
import FolderModal from "./components/FolderModal.jsx";
import FolderCard from "./components/FolderCard.jsx";
import { normalizeFolderColor } from "./utils/folderColors.js";
import { PageLoader } from "../../components/ui/Skeletons.jsx";
import { getFoldersFromResponse, normalizeFolder } from "./utils/folderData.js";

export default function Folders() {
  const navigate = useNavigate();
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(true);
  const [folderError, setFolderError] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [deletingFolderId, setDeletingFolderId] = useState("");
  const [folderPendingDelete, setFolderPendingDelete] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchFolders = async () => {
      setIsLoadingFolders(true);
      setFolderError("");

      try {
        const response = await folderApi.getFolders();
        const nextFolders =
          getFoldersFromResponse(response).map(normalizeFolder);

        if (!isMounted) return;

        setFolders(nextFolders);
      } catch (error) {
        if (isMounted) {
          setFolderError(getApiErrorMessage(error, "Failed to load folders."));
          setFolders([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingFolders(false);
        }
      }
    };

    fetchFolders();

    return () => {
      isMounted = false;
    };
  }, []);

  const createFolder = async ({ name, color, template }) => {
    setIsCreatingFolder(true);
    setFolderError("");

    try {
      const payload = {
        name: name.trim(),
        color: normalizeFolderColor(color),
        template,
      };
      const response = await folderApi.createFolder(payload);
      const createdFolder =
        response?.data?.folder ||
        response?.folder ||
        response?.data?.data?.folder ||
        payload;
      const nextFolder = normalizeFolder(createdFolder);

      setFolders((currentFolders) => [nextFolder, ...currentFolders]);
      return nextFolder;
    } catch (error) {
      setFolderError(getApiErrorMessage(error, "Failed to create folder."));
      throw error;
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const requestDeleteFolder = (folderId) => {
    const targetFolder = folders.find(
      (folder) => String(folder.id) === String(folderId),
    );
    if (!targetFolder) return;

    setFolderPendingDelete(targetFolder);
  };

  const deleteFolder = async () => {
    if (!folderPendingDelete) return;

    const folderId = folderPendingDelete.id;

    const previousFolders = folders;
    setDeletingFolderId(String(folderId));
    setFolderError("");
    setFolderPendingDelete(null);
    setFolders((currentFolders) =>
      currentFolders.filter((folder) => String(folder.id) !== String(folderId)),
    );

    try {
      await folderApi.deleteFolder(folderId);
    } catch (error) {
      setFolders(previousFolders);
      setFolderError(getApiErrorMessage(error, "Failed to delete folder."));
    } finally {
      setDeletingFolderId("");
    }
  };

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-600">
              Folder Workspace
            </div>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Folders and color-coded entries
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Organize entries into folders, assign a folder color, and manage
              repeatable records with reminder and snooze controls.
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

        {folderError ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700 shadow-sm">
            {folderError}
          </div>
        ) : null}

        {isLoadingFolders ? (
          <PageLoader
            title="Loading Folders"
            message="Fetching your folder data from the API..."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {folders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                isDeleting={deletingFolderId === String(folder.id)}
                onDelete={() => requestDeleteFolder(folder.id)}
                onOpen={() => navigate(`/create-templates/${folder.id}`)}
              />
            ))}
          </div>
        )}

        {!isLoadingFolders && !folders.length ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <div className="text-lg font-semibold text-slate-800">
              No folders yet
            </div>
            <div className="mt-2 text-sm text-slate-500">
              Create your first folder using the top-right plus action.
            </div>
          </div>
        ) : null}
      </div>

      <FolderModal
        modalTitle="Create Folder"
        onClose={() => setFolderModalOpen(false)}
        onSubmit={async (payload) => {
          await createFolder(payload);
          setFolderModalOpen(false);
        }}
        open={folderModalOpen}
        isSubmitting={isCreatingFolder}
      />

      <Modal
        open={Boolean(folderPendingDelete)}
        title="Delete Folder"
        onClose={() => setFolderPendingDelete(null)}
        actions={
          <>
            <button
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
              onClick={() => setFolderPendingDelete(null)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              onClick={deleteFolder}
              type="button"
              disabled={!folderPendingDelete}
            >
              Delete
            </button>
          </>
        }
      >
        {folderPendingDelete ? (
          <div className="text-sm text-slate-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-900">
              {folderPendingDelete.name}
            </span>
            ?
          </div>
        ) : null}
      </Modal>
    </>
  );
}
