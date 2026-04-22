import React, { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link, Navigate, useParams } from "react-router-dom";
import { folderApi } from "@/api";
import { getApiErrorMessage } from "@/api/helpers";
import { PageLoader } from "../../components/ui/Skeletons.jsx";
import TemplateEditor from "./components/TemplateEditor.jsx";
import {
  getFolderMutedTextColor,
  getFolderTextColor,
  normalizeFolderColor,
} from "./utils/folderColors.js";
import { getFolderFromResponse, normalizeFolder } from "./utils/folderData.js";

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
        const fetchedFolder = getFolderFromResponse(response);

        if (!fetchedFolder) {
          throw new Error("Folder not found.");
        }

        const nextFolder = normalizeFolder(fetchedFolder);

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

  if (initialLoad || (isLoadingFolders && !folder)) {
    return (
      <PageLoader title="Loading Folder" message="Opening folder details..." />
    );
  }

  if (!folder) {
    return <Navigate to="/create-templates" replace />;
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
        template: fields,
      };

      const response = await folderApi.updateFolder(payload, folder.id);
      const updatedFolder = response?.data?.folder ||
        response?.folder ||
        response?.data?.data?.folder || { ...folder, template: fields };
      const normalizedFolder = normalizeFolder(updatedFolder);

      setFolder(normalizedFolder);
    } catch (error) {
      setFolderError(
        getApiErrorMessage(error, "Failed to update folder template."),
      );
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
            <Link
              className="inline-flex items-center gap-2 text-sm font-semibold transition"
              style={{ color: mutedTextColor }}
              to="/create-templates"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to templates
            </Link>
            <h1 className="mt-2 text-3xl font-bold">{folder.name}</h1>
            <p
              className="mt-2 max-w-2xl text-sm"
              style={{ color: mutedTextColor }}
            >
              This page edits the template only. The mobile app will be
              responsible for filling this form with actual values.
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
