import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
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

  return <ReminderContext.Provider value={value}>{children}</ReminderContext.Provider>;
}

export function useReminderStore() {
  const context = useContext(ReminderContext);

  if (!context) {
    throw new Error("useReminderStore must be used within a ReminderProvider");
  }

  return context;
}
