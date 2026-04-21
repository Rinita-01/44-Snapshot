import React, { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { folderApi } from "@/api";
import { getApiErrorMessage } from "@/api/helpers";
import FolderModal from "./components/FolderModal.jsx";
import FolderCard from "./components/FolderCard.jsx";
import { normalizeFolderColor } from "./utils/folderColors.js";
import { PageLoader } from "../../components/ui/Skeletons.jsx";

const STORAGE_KEY = "snapshot-folders";

function normalizeTemplateField(field, index = 0) {
  return {
    label: field?.label || `Field ${index + 1}`,
    key: field?.key || `field_${index + 1}`,
    type: field?.type || "text",
    required: Boolean(field?.required),
    options: Array.isArray(field?.options) ? field.options : [],
    _id: field?._id
  };
}

function buildTemplateDefinition(folder) {
  if (Array.isArray(folder?.template)) {
    const fields = folder.template.map(normalizeTemplateField);
    const primaryDateField = fields.find((field) => field.type === "date")?.key || "";

    return {
      key: folder?.templateKey || folder?.type || folder?._id || crypto.randomUUID(),
      name: folder?.templateName || folder?.name || "Custom Template",
      primaryDateField,
      fields
    };
  }

  const candidate =
    folder?.template ||
    folder?.templateKey ||
    folder?.template_name ||
    folder?.templateName ||
    folder?.type;

  return {
    key: String(candidate || folder?._id || folder?.id || crypto.randomUUID()),
    name: folder?.templateName || folder?.name || "Custom Template",
    primaryDateField: "",
    fields: []
  };
}

function normalizeFolder(folder, index = 0) {
  const templateDefinition = buildTemplateDefinition(folder);

  return {
    ...folder,
    id: folder?.id || folder?._id || folder?.folderId || `folder-${index}`,
    name: folder?.name || folder?.folderName || folder?.title || `Folder ${index + 1}`,
    templateDefinition,
    template: templateDefinition.key,
    color: normalizeFolderColor(folder?.color || folder?.folderColor || folder?.bgColor),
    entries: Array.isArray(folder?.entries) ? folder.entries : []
  };
}

function getFoldersFromResponse(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.folders)) return payload.folders;
  if (Array.isArray(payload?.data?.folders)) return payload.data.folders;
  if (Array.isArray(payload?.results)) return payload.results;

  return [];
}

function readFolders() {
  if (typeof window === "undefined") return [];

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mergeFolderWithStoredData(folder, storedFolders) {
  const matchingStoredFolder = storedFolders.find((storedFolder) => {
    const storedId = storedFolder?.id || storedFolder?._id || storedFolder?.folderId;
    const incomingId = folder?.id || folder?._id || folder?.folderId;

    return String(storedId) === String(incomingId);
  });

  if (!matchingStoredFolder) return folder;

  return {
    ...matchingStoredFolder,
    ...folder,
    template: folder?.template ?? matchingStoredFolder?.template,
    templateDefinition: folder?.templateDefinition ?? matchingStoredFolder?.templateDefinition,
    entries: Array.isArray(folder?.entries) ? folder.entries : matchingStoredFolder?.entries
  };
}

export default function Folders() {
  const navigate = useNavigate();
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [folders, setFolders] = useState(readFolders);
  const [isLoadingFolders, setIsLoadingFolders] = useState(true);
  const [folderError, setFolderError] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [deletingFolderId, setDeletingFolderId] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchFolders = async () => {
      setIsLoadingFolders(true);
      setFolderError("");

      try {
        const response = await folderApi.getFolders();
        const storedFolders = readFolders();
        const nextFolders = getFoldersFromResponse(response)
          .map((folder) => mergeFolderWithStoredData(folder, storedFolders))
          .map(normalizeFolder);

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(folders));
  }, [folders]);

  const createFolder = async ({ name, color, template }) => {
    setIsCreatingFolder(true);
    setFolderError("");

    try {
      const payload = {
        name: name.trim(),
        color: normalizeFolderColor(color),
        template
      };
      const response = await folderApi.createFolder(payload);
      const createdFolder = response?.data?.folder || response?.folder || response?.data?.data?.folder || payload;
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

  const deleteFolder = async (folderId) => {
    const targetFolder = folders.find((folder) => String(folder.id) === String(folderId));
    if (!targetFolder) return;

    const confirmed = window.confirm(`Delete "${targetFolder.name}"?`);
    if (!confirmed) return;

    const previousFolders = folders;
    setDeletingFolderId(String(folderId));
    setFolderError("");
    setFolders((currentFolders) => currentFolders.filter((folder) => String(folder.id) !== String(folderId)));

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
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-600">Folder Workspace</div>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Folders and color-coded entries</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Organize entries into folders, assign a folder color, and manage repeatable records with reminder and snooze controls.
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
          <PageLoader title="Loading Folders" message="Fetching your folder data from the API..." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {folders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                isDeleting={deletingFolderId === String(folder.id)}
                onDelete={() => deleteFolder(folder.id)}
                onOpen={() => navigate(`/folders/${folder.id}`)}
              />
            ))}
          </div>
        )}

        {!isLoadingFolders && !folders.length ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <div className="text-lg font-semibold text-slate-800">No folders yet</div>
            <div className="mt-2 text-sm text-slate-500">Create your first folder using the top-right plus action.</div>
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
    </>
  );
}
