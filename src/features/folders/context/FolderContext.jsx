import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { folderApi } from "@/api";
import { getApiErrorMessage } from "@/api/helpers";
import { reminderTemplates, SNOOZE_OPTIONS } from "../../reminders/data/templates.js";
import { calculateReminderDate, calculateSnoozeUntil } from "../../reminders/utils/reminderDates.js";
import { normalizeFolderColor } from "../utils/folderColors.js";

const FolderContext = createContext(null);
const DEFAULT_TEMPLATE_KEY = Object.keys(reminderTemplates)[0] || "";
const DEFAULT_TEMPLATE_FIELDS = reminderTemplates[DEFAULT_TEMPLATE_KEY]?.fields || [];

const normalizeTemplateKey = (folder) => {
  const candidate =
    folder?.template ||
    folder?.templateKey ||
    folder?.template_name ||
    folder?.templateName ||
    folder?.type;

  if (!candidate) return DEFAULT_TEMPLATE_KEY;
  if (reminderTemplates[candidate]) return candidate;

  const matchedTemplate = Object.values(reminderTemplates).find(
    (template) =>
      template.key.toLowerCase() === String(candidate).toLowerCase() ||
      template.name.toLowerCase() === String(candidate).toLowerCase()
  );

  return matchedTemplate?.key || DEFAULT_TEMPLATE_KEY;
};

const normalizeFolder = (folder, index = 0) => ({
  ...folder,
  id: folder?.id || folder?._id || folder?.folderId || `folder-${index}`,
  name: folder?.name || folder?.folderName || folder?.title || `Folder ${index + 1}`,
  template: normalizeTemplateKey(folder),
  color: normalizeFolderColor(folder?.color || folder?.folderColor || folder?.bgColor),
  entries: Array.isArray(folder?.entries) ? folder.entries : []
});

const getFoldersFromResponse = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.folders)) return payload.folders;
  if (Array.isArray(payload?.data?.folders)) return payload.data.folders;
  if (Array.isArray(payload?.results)) return payload.results;

  return [];
};

const normalizeEntry = (entry, templateKey) => {
  if (!entry) return null;

  const values = entry?.values || entry;
  const reminderValue = Number(values?.reminder || 0);
  const template = reminderTemplates[templateKey];
  const eventDate = values?.[template?.primaryDateField];

  return {
    ...entry,
    id: entry?.id || entry?._id || crypto.randomUUID(),
    values,
    reminderDate: entry?.reminderDate || calculateReminderDate(eventDate, reminderValue),
    snoozedUntil: entry?.snoozedUntil || ""
  };
};

function buildEntry(templateKey, values) {
  return normalizeEntry({ values }, templateKey);
}

export function FolderProvider({ children }) {
  const [folders, setFolders] = useState([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(true);
  const [folderError, setFolderError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchFolders = async () => {
      setIsLoadingFolders(true);
      setFolderError("");

      try {
        const response = await folderApi.getFolders();
        const nextFolders = getFoldersFromResponse(response).map(normalizeFolder);

        if (isMounted) {
          setFolders(nextFolders);
        }
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

  const value = useMemo(() => ({
    folders,
    isLoadingFolders,
    folderError,
    templates: reminderTemplates,
    snoozeOptions: SNOOZE_OPTIONS,
    createFolder: async ({ name, color }) => {
      const nextFolder = {
        id: crypto.randomUUID(),
        name: name.trim(),
        template: DEFAULT_TEMPLATE_KEY,
        color: normalizeFolderColor(color),
        entries: []
      };

      setFolders((currentFolders) => [nextFolder, ...currentFolders]);

      try {
        await folderApi.createFolder({
          name: nextFolder.name,
          color: nextFolder.color,
          template: DEFAULT_TEMPLATE_FIELDS
        });
      } catch (error) {
        setFolderError(getApiErrorMessage(error, "Failed to create folder."));
      }

      return nextFolder;
    },
    addEntries: async (folderId, entries) => {
      const targetFolder = folders.find((folder) => String(folder.id) === String(folderId));

      if (!targetFolder) return;

      const nextEntries = entries.map((entry) => buildEntry(targetFolder.template, entry));
      const previousFolders = folders;

      setFolderError("");
      setFolders((currentFolders) =>
        currentFolders.map((folder) =>
          String(folder.id) === String(folderId)
            ? {
              ...folder,
              entries: [...nextEntries, ...folder.entries]
            }
            : folder
        )
      );

      try {
        const response = await folderApi.addEntries({
          folderId,
          name: targetFolder.name,
          color: targetFolder.color,
          template: reminderTemplates[targetFolder.template]?.fields || DEFAULT_TEMPLATE_FIELDS,
          entries
        });

        const savedEntries =
          response?.data?.entries ||
          response?.data?.data?.entries ||
          response?.data?.folder?.entries ||
          response?.data?.data?.folder?.entries;

        if (Array.isArray(savedEntries)) {
          setFolders((currentFolders) =>
            currentFolders.map((folder) =>
              String(folder.id) === String(folderId)
                ? {
                  ...folder,
                  entries: savedEntries.map((entry) => normalizeEntry(entry, folder.template)).filter(Boolean)
                }
                : folder
            )
          );
        }
      } catch (error) {
        setFolders(previousFolders);
        setFolderError(getApiErrorMessage(error, "Failed to add entries."));
        throw error;
      }
    },
    snoozeEntry: (folderId, entryId, snoozeValue) => {
      const snoozeOption = SNOOZE_OPTIONS.find((option) => option.value === snoozeValue);

      setFolders((currentFolders) =>
        currentFolders.map((folder) =>
          folder.id === folderId
            ? {
              ...folder,
              entries: folder.entries.map((entry) =>
                entry.id === entryId
                  ? {
                    ...entry,
                    snoozedUntil: calculateSnoozeUntil(snoozeOption)
                  }
                  : entry
              )
            }
            : folder
        )
      );
    },
    getFolderById: (folderId) => folders.find((folder) => String(folder.id) === String(folderId))
  }), [folderError, folders, isLoadingFolders]);

  return <FolderContext.Provider value={value}>{children}</FolderContext.Provider>;
}

export function useFolderStore() {
  const context = useContext(FolderContext);

  if (!context) {
    throw new Error("useFolderStore must be used within a FolderProvider");
  }

  return context;
}
