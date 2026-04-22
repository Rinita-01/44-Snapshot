import React, { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link, Navigate, useParams } from "react-router-dom";
import { folderApi } from "@/api";
import { getApiErrorMessage } from "@/api/helpers";
import { PageLoader } from "../../components/ui/Skeletons.jsx";
import TemplateEditor from "./components/TemplateEditor.jsx";
import { getFolderMutedTextColor, getFolderTextColor, normalizeFolderColor } from "./utils/folderColors.js";

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
    color: normalizeFolderColor(folder?.color || folder?.folderColor || folder?.bgColor)
  };
}

function getFolderFromResponse(payload) {
  if (!payload) return null;
  if (payload.folder && typeof payload.folder === "object") return payload.folder;
  if (payload.data?.folder && typeof payload.data.folder === "object") return payload.data.folder;
  if (payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)) return payload.data;
  if (payload.result && typeof payload.result === "object") return payload.result;

  return null;
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

export default function FolderDetails() {
  const { folderId } = useParams();
  const [folder, setFolder] = useState(null);
  const [isLoadingFolders, setIsLoadingFolders] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [folderError, setFolderError] = useState("");
  const [isUpdatingFolder, setIsUpdatingFolder] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchFolder = async () => {
      setIsLoadingFolders(true);
      setFolderError("");

      try {
        const response = await folderApi.getFolderById(folderId);
        const storedFolders = readFolders();
        const fetchedFolder = getFolderFromResponse(response);

        if (!fetchedFolder) {
          throw new Error("Folder not found.");
        }

        const nextFolder = normalizeFolder(mergeFolderWithStoredData(fetchedFolder, storedFolders));

        if (!isMounted) return;

        setFolder(nextFolder);
      } catch (error) {
        if (isMounted) {
          setFolderError(getApiErrorMessage(error, "Failed to load folders."));
          setFolder(null);
        }
      } finally {
        if (isMounted) {
          setIsLoadingFolders(false);
          setInitialLoad(false);
        }
      }
    };

    fetchFolder();

    return () => {
      isMounted = false;
    };
  }, [folderId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedFolders = readFolders();
    const nextFolders = folder
      ? [
        folder,
        ...storedFolders.filter((item) => String(item.id || item._id || item.folderId) !== String(folder.id))
      ]
      : storedFolders;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFolders));
  }, [folder]);

  if (initialLoad || (isLoadingFolders && !folder)) {
    return <PageLoader title="Loading Folder" message="Opening folder details..." />;
  }

  if (!folder) {
    return <Navigate to="/folders" replace />;
  }

  const template = folder.templateDefinition;
  const backgroundColor = normalizeFolderColor(folder.color);
  const textColor = getFolderTextColor(backgroundColor);
  const mutedTextColor = getFolderMutedTextColor(backgroundColor);

  const updateTemplate = async (fields) => {
    setIsUpdatingFolder(true);
    setFolderError("");

    try {
      const payload = {
        name: folder.name,
        color: folder.color,
        template: fields
      };

      const response = await folderApi.updateFolder(payload, folder.id);
      const updatedFolder = response?.data?.folder || response?.folder || response?.data?.data?.folder || { ...folder, template: fields };
      const normalizedFolder = normalizeFolder(updatedFolder);

      setFolder(normalizedFolder);
    } catch (error) {
      setFolderError(getApiErrorMessage(error, "Failed to update folder template."));
      throw error;
    } finally {
      setIsUpdatingFolder(false);
    }
  };

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
              This page edits the template only. The mobile app will be responsible for filling this form with actual values.
            </p>
          </div>
        </div>

        {folderError ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700 shadow-sm">
            {folderError}
          </div>
        ) : null}

        <TemplateEditor
          folderName={folder.name}
          fields={template.fields}
          isSubmitting={isUpdatingFolder}
          onSubmit={updateTemplate}
        />
      </div>
    </>
  );
}
