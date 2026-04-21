import React, { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { reminderApi } from "../../api/index.js";
import { getApiErrorMessage } from "../../api/helpers.js";
import FolderModal from "./components/FolderModal.jsx";
import FolderCard from "./components/FolderCard.jsx";
import { SkeletonTable } from "../../components/ui/Skeletons.jsx";

const STORAGE_KEY = "snapshot-reminders";

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

function buildTemplateDefinition(reminder) {
  if (Array.isArray(reminder?.template)) {
    const fields = reminder.template.map(normalizeTemplateField);

    return {
      key: reminder?._id || reminder?.id || crypto.randomUUID(),
      name: reminder?.name || reminder?.title || "Reminder Template",
      fields
    };
  }

  return {
    key: reminder?._id || reminder?.id || crypto.randomUUID(),
    name: reminder?.name || reminder?.title || "Reminder Template",
    fields: []
  };
}

function normalizeReminder(reminder, index = 0) {
  const templateDefinition = buildTemplateDefinition(reminder);

  return {
    ...reminder,
    id: reminder?.id || reminder?._id || `reminder-${index}`,
    name: reminder?.name || reminder?.title || `Reminder Folder ${index + 1}`,
    templateDefinition,
    template: templateDefinition.key
  };
}

function normalizeReminderPayloadTemplate(fields) {
  return (Array.isArray(fields) ? fields : []).map((field) => {
    const normalizedField = {
      label: field.label,
      key: field.key,
      type: field.type
    };

    if (field.required) {
      normalizedField.required = true;
    }

    if (Array.isArray(field.options) && field.options.length) {
      normalizedField.options = field.options;
    }

    return normalizedField;
  });
}

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

function mergeReminderWithStoredData(reminder, storedFolders) {
  const matchingStoredFolder = storedFolders.find((storedFolder) => {
    const storedId = storedFolder?.id || storedFolder?._id;
    const incomingId = reminder?.id || reminder?._id;

    return String(storedId) === String(incomingId);
  });

  if (!matchingStoredFolder) return reminder;

  return {
    ...matchingStoredFolder,
    ...reminder,
    template: reminder?.template ?? matchingStoredFolder?.template,
    templateDefinition: reminder?.templateDefinition ?? matchingStoredFolder?.templateDefinition
  };
}

export default function Reminders() {
  const navigate = useNavigate();
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [folders, setFolders] = useState(readFolders);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [deletingReminderId, setDeletingReminderId] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchReminderData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await reminderApi.getReminderData();
        const storedFolders = readFolders();
        const nextFolders = getReminderFoldersFromResponse(response)
          .map((folder) => mergeReminderWithStoredData(folder, storedFolders))
          .map(normalizeReminder);

        if (!isMounted) return;

        setFolders(nextFolders);
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
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(folders));
  }, [folders]);

  const createFolder = async ({ name, template }) => {
    setIsCreating(true);
    setError("");

    try {
      const payload = {
        title: name.trim(),
        template: normalizeReminderPayloadTemplate(template)
      };

      const response = await reminderApi.createReminder(payload);
      const createdReminder = getCreatedReminderFromResponse(response) || { ...payload, name: payload.title };
      const nextFolder = normalizeReminder(createdReminder);

      setFolders((currentFolders) => [nextFolder, ...currentFolders]);
      return nextFolder;
    } catch (createError) {
      const message = getApiErrorMessage(createError, "Failed to create reminder.");
      setError(message);
      throw createError;
    } finally {
      setIsCreating(false);
    }
  };

  const deleteReminder = async (folderId) => {
    const targetFolder = folders.find((folder) => String(folder.id) === String(folderId));
    if (!targetFolder) return;

    const confirmed = window.confirm(`Delete "${targetFolder.name}"?`);
    if (!confirmed) return;

    const previousFolders = folders;
    setDeletingReminderId(String(folderId));
    setError("");
    setFolders((currentFolders) => currentFolders.filter((folder) => String(folder.id) !== String(folderId)));

    try {
      await reminderApi.deleteReminder(folderId);
    } catch (deleteError) {
      setFolders(previousFolders);
      setError(getApiErrorMessage(deleteError, "Failed to delete reminder."));
    } finally {
      setDeletingReminderId("");
    }
  };

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-600">Reminder Workspace</div>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Reminder templates</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Create and manage reminder templates here. The filled values will come from the mobile app, not from this page.
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

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <SkeletonTable />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {folders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                isDeleting={deletingReminderId === String(folder.id)}
                onDelete={() => deleteReminder(folder.id)}
                onOpen={() => navigate(`/reminders/${folder.id}`)}
              />
            ))}
          </div>
        )}

        {!loading && !folders.length ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <div className="text-lg font-semibold text-slate-800">No folders yet</div>
            <div className="mt-2 text-sm text-slate-500">Create your first reminder folder using the top-right plus action.</div>
          </div>
        ) : null}
      </div>

      <FolderModal
        onClose={() => setFolderModalOpen(false)}
        onSubmit={async (payload) => {
          await createFolder(payload);
          setFolderModalOpen(false);
        }}
        open={folderModalOpen}
        isSubmitting={isCreating}
      />
    </>
  );
}
