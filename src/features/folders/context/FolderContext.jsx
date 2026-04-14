import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { reminderTemplates, SNOOZE_OPTIONS } from "../../reminders/data/templates.js";
import { calculateReminderDate, calculateSnoozeUntil } from "../../reminders/utils/reminderDates.js";

const STORAGE_KEY = "snapshot-folders";

const demoFolders = [
  {
    id: "folder-documents",
    name: "Client Documents",
    template: "tickets",
    entries: [
      {
        id: "entry-documents-1",
        values: {
          label: "Passport Copy",
          key: "passport_copy",
          type: "file",
          required: "Yes"
        },
        reminderDate: "",
        snoozedUntil: ""
      }
    ]
  },
  {
    id: "folder-training",
    name: "Staff Onboarding",
    template: "employeeTraining",
    entries: [
      {
        id: "entry-training-1",
        values: {
          label: "Welcome Packet",
          key: "welcome_packet",
          type: "text",
          required: "No"
        },
        reminderDate: "",
        snoozedUntil: ""
      }
    ]
  }
];

const FolderContext = createContext(null);

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

export function FolderProvider({ children }) {
  const [folders, setFolders] = useState(readFolders);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(folders));
  }, [folders]);

  const value = useMemo(() => ({
    folders,
    templates: reminderTemplates,
    snoozeOptions: SNOOZE_OPTIONS,
    createFolder: ({ name, template }) => {
      setFolders((currentFolders) => [
        {
          id: crypto.randomUUID(),
          name: name.trim(),
          template,
          entries: []
        },
        ...currentFolders
      ]);
    },
    addEntries: (folderId, entries) => {
      setFolders((currentFolders) =>
        currentFolders.map((folder) =>
          folder.id === folderId
            ? {
              ...folder,
              entries: [...entries.map((entry) => buildEntry(folder.template, entry)), ...folder.entries]
            }
            : folder
        )
      );
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
  }), [folders]);

  return <FolderContext.Provider value={value}>{children}</FolderContext.Provider>;
}

export function useFolderStore() {
  const context = useContext(FolderContext);

  if (!context) {
    throw new Error("useFolderStore must be used within a FolderProvider");
  }

  return context;
}
