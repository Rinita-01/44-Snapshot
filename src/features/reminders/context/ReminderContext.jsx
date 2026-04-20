import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { reminderApi } from "../../../api/index.js";
import { getApiErrorMessage } from "../../../api/helpers.js";
import { reminderTemplates, SNOOZE_OPTIONS } from "../data/templates.js";
import { calculateReminderDate, calculateSnoozeUntil } from "../utils/reminderDates.js";

const STORAGE_KEY = "snapshot-reminders";

const demoFolders = [
  {
    id: "folder-birthdays",
    name: "Executive Birthdays",
    template: "birthdays",
    entries: [
      {
        id: "entry-birthday-1",
        values: {
          label: "Birthday Label",
          key: "birthday_key",
          type: "date",
          required: "Yes"
        },
        reminderDate: "",
        snoozedUntil: ""
      }
    ]
  },
  {
    id: "folder-maintenance",
    name: "Office Equipment",
    template: "maintenance",
    entries: [
      {
        id: "entry-maintenance-1",
        values: {
          label: "Maintenance Label",
          key: "maintenance_key",
          type: "text",
          required: "No"
        },
        reminderDate: "",
        snoozedUntil: ""
      }
    ]
  }
];

const ReminderContext = createContext(null);

function getReminderFoldersFromResponse(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.folders)) return payload.folders;
  if (Array.isArray(payload?.reminders)) return payload.reminders;
  if (Array.isArray(payload?.data?.folders)) return payload.data.folders;
  if (Array.isArray(payload?.data?.reminders)) return payload.data.reminders;
  if (Array.isArray(payload?.results)) return payload.results;

  return [];
}

function getCreatedReminderFromResponse(payload) {
  if (!payload || typeof payload !== "object") return null;
  if (payload.folder && typeof payload.folder === "object") return payload.folder;
  if (payload.reminder && typeof payload.reminder === "object") return payload.reminder;
  if (payload.data?.folder && typeof payload.data.folder === "object") return payload.data.folder;
  if (payload.data?.reminder && typeof payload.data.reminder === "object") return payload.data.reminder;
  if (payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)) return payload.data;
  if (payload.result && typeof payload.result === "object") return payload.result;

  return null;
}

function getCreatedEntriesFromResponse(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.entries)) return payload.entries;
  if (Array.isArray(payload?.reminders)) return payload.reminders;
  if (Array.isArray(payload?.data?.entries)) return payload.data.entries;
  if (Array.isArray(payload?.data?.reminders)) return payload.data.reminders;

  const singleEntry = payload?.entry || payload?.reminder || payload?.data?.entry || payload?.data?.reminder;
  if (singleEntry && typeof singleEntry === "object") return [singleEntry];

  return [];
}

function buildTemplatePayload(templateKey) {
  const template = reminderTemplates[templateKey];

  if (!template) return [];

  return template.fields.map((field) => ({
    label: field.label || "",
    key: field.key || "",
    type: field.type || "text",
    required:
      typeof field.required === "boolean"
        ? field.required
        : String(field.required).toLowerCase() === "yes",
    options: Array.isArray(field.options) ? field.options : []
  }));
}

function pickTemplateKey(folder) {
  if (folder?.template && typeof folder.template === "object") {
    const templateObject = folder.template;
    const objectCandidates = [templateObject.key, templateObject.name, templateObject.templateKey];

    for (const candidate of objectCandidates) {
      if (!candidate) continue;

      const normalized = String(candidate).trim();
      if (reminderTemplates[normalized]) return normalized;

      const matchingTemplate = Object.values(reminderTemplates).find(
        (template) => template.name.toLowerCase() === normalized.toLowerCase()
      );

      if (matchingTemplate) return matchingTemplate.key;
    }
  }

  const candidates = [
    folder?.template,
    folder?.templateKey,
    folder?.type,
    folder?.category,
    folder?.name
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;

    const normalized = String(candidate).trim();
    if (reminderTemplates[normalized]) return normalized;

    const matchingTemplate = Object.values(reminderTemplates).find(
      (template) => template.name.toLowerCase() === normalized.toLowerCase()
    );

    if (matchingTemplate) return matchingTemplate.key;
  }

  return Object.keys(reminderTemplates)[0] || "birthdays";
}

function normalizeReminderEntry(entry, index = 0) {
  return {
    id: entry?.id || entry?._id || `entry-${index}`,
    values: entry?.values && typeof entry.values === "object" ? entry.values : entry?.fields && typeof entry.fields === "object" ? entry.fields : {},
    reminderDate: entry?.reminderDate || entry?.reminder_date || "",
    snoozedUntil: entry?.snoozedUntil || entry?.snoozeUntil || ""
  };
}

function normalizeReminderFolder(folder, index = 0) {
  const entriesSource = Array.isArray(folder?.entries)
    ? folder.entries
    : Array.isArray(folder?.items)
      ? folder.items
      : Array.isArray(folder?.reminders)
        ? folder.reminders
        : [];

  return {
    id: folder?.id || folder?._id || `folder-${index}`,
    name: folder?.name || folder?.folderName || folder?.title || `Reminder Folder ${index + 1}`,
    template: pickTemplateKey(folder),
    color: folder?.color || folder?.folderColor,
    entries: entriesSource.map(normalizeReminderEntry)
  };
}

function readFolders() {
  if (typeof window === "undefined") return demoFolders;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return demoFolders;

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : demoFolders;
  } catch (error) {
    return demoFolders;
  }
}

function buildEntry(templateKey, values) {
  const template = reminderTemplates[templateKey];
  const reminderValue = Number(values.reminder || 0);
  const eventDate = values[template?.primaryDateField];

  return {
    id: crypto.randomUUID(),
    values,
    reminderDate: calculateReminderDate(eventDate, reminderValue),
    snoozedUntil: ""
  };
}

export function ReminderProvider({ children }) {
  const [folders, setFolders] = useState(readFolders);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isAddingEntries, setIsAddingEntries] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchReminderData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await reminderApi.getReminderData();
        const nextFolders = getReminderFoldersFromResponse(response).map(normalizeReminderFolder);

        if (isMounted && nextFolders.length) {
          setFolders(nextFolders);
        } else if (isMounted && !nextFolders.length) {
          setFolders([]);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(getApiErrorMessage(fetchError, "Failed to load reminder data."));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReminderData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(folders));
  }, [folders]);

  const value = useMemo(() => ({
    folders,
    loading,
    error,
    isCreating,
    isAddingEntries,
    templates: reminderTemplates,
    snoozeOptions: SNOOZE_OPTIONS,
    createFolder: async ({ name, color, template }) => {
      setIsCreating(true);
      setError("");

      try {
        const trimmedName = name.trim();
        const templatePayload = buildTemplatePayload(template);
        const payload = {
          title: trimmedName,
          name: trimmedName,
          color,
          template: templatePayload
        };

        const response = await reminderApi.createReminder(payload);
        const createdReminder = getCreatedReminderFromResponse(response);
        const nextFolder = normalizeReminderFolder(
          createdReminder ? { color, template, ...createdReminder } : payload
        );

        setFolders((currentFolders) => [nextFolder, ...currentFolders]);
        return nextFolder;
      } catch (createError) {
        const message = getApiErrorMessage(createError, "Failed to create reminder.");
        setError(message);
        throw createError;
      } finally {
        setIsCreating(false);
      }
    },
    addEntries: async (folderId, entries) => {
      const targetFolder = folders.find((folder) => folder.id === folderId);
      if (!targetFolder) return;

      setIsAddingEntries(true);
      setError("");

      try {
        const templatePayload = buildTemplatePayload(targetFolder.template);
        const payload = {
          folderId,
          reminderId: folderId,
          title: targetFolder.name,
          template: templatePayload,
          entries
        };

        const response = await reminderApi.createReminderTemplate(payload);
        const createdEntries = getCreatedEntriesFromResponse(response);
        const nextEntries = createdEntries.length
          ? createdEntries.map(normalizeReminderEntry)
          : entries.map((entry) => buildEntry(targetFolder.template, entry));

        setFolders((currentFolders) =>
          currentFolders.map((folder) =>
            folder.id === folderId
              ? {
                ...folder,
                entries: [...nextEntries, ...folder.entries]
              }
              : folder
          )
        );

        return nextEntries;
      } catch (createError) {
        const message = getApiErrorMessage(createError, "Failed to create reminder entry.");
        setError(message);
        throw createError;
      } finally {
        setIsAddingEntries(false);
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
    getFolderById: (folderId) => folders.find((folder) => folder.id === folderId)
  }), [error, folders, isAddingEntries, isCreating, loading]);

  return <ReminderContext.Provider value={value}>{children}</ReminderContext.Provider>;
}

export function useReminderStore() {
  const context = useContext(ReminderContext);

  if (!context) {
    throw new Error("useReminderStore must be used within a ReminderProvider");
  }

  return context;
}
