import React, { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link, Navigate, useParams } from "react-router-dom";
import { reminderApi } from "../../api/index.js";
import { getApiErrorMessage } from "../../api/helpers.js";
import { PageLoader } from "../../components/ui/Skeletons.jsx";
import TemplateEditor from "../folders/components/TemplateEditor.jsx";

function normalizeTemplateField(field, index = 0) {
  return {
    label: field?.label || `Field ${index + 1}`,
    key: field?.key || `field_${index + 1}`,
    type: field?.type || "text",
    required: Boolean(field?.required),
    options: Array.isArray(field?.options) ? field.options : [],
    _id: field?._id,
  };
}

function buildTemplateDefinition(reminder) {
  if (Array.isArray(reminder?.template)) {
    const fields = reminder.template.map(normalizeTemplateField);

    return {
      key:
        reminder?.templateKey ||
        reminder?._id ||
        reminder?.id ||
        crypto.randomUUID(),
      name: reminder?.templateName || reminder?.name || "Reminder Template",
      fields,
    };
  }

  return {
    key:
      reminder?.templateKey ||
      reminder?._id ||
      reminder?.id ||
      crypto.randomUUID(),
    name: reminder?.templateName || reminder?.name || "Reminder Template",
    fields: [],
  };
}

function normalizeReminder(reminder, index = 0) {
  const templateDefinition = buildTemplateDefinition(reminder);

  return {
    ...reminder,
    id: reminder?.id || reminder?._id || `reminder-${index}`,
    name: reminder?.name || reminder?.title || `Reminder Folder ${index + 1}`,
    templateDefinition,
    template: templateDefinition.key,
  };
}

function normalizeReminderPayloadTemplate(fields) {
  return (Array.isArray(fields) ? fields : []).map((field) => {
    const normalizedField = {
      label: field.label,
      key: field.key,
      type: field.type,
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

function getReminderFromResponse(payload) {
  if (!payload) return null;
  if (payload.folder && typeof payload.folder === "object")
    return payload.folder;
  if (payload.reminder && typeof payload.reminder === "object")
    return payload.reminder;
  if (payload.data?.folder && typeof payload.data.folder === "object")
    return payload.data.folder;
  if (payload.data?.reminder && typeof payload.data.reminder === "object")
    return payload.data.reminder;
  if (
    payload.data &&
    typeof payload.data === "object" &&
    !Array.isArray(payload.data)
  )
    return payload.data;
  if (payload.result && typeof payload.result === "object")
    return payload.result;

  return null;
}

export default function ReminderFolderDetails() {
  const { folderId } = useParams();
  const [folder, setFolder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState("");
  const [isUpdatingReminder, setIsUpdatingReminder] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchReminder = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await reminderApi.getReminderById(folderId);
        const fetchedReminder = getReminderFromResponse(response);

        if (!fetchedReminder) {
          throw new Error("Reminder not found.");
        }

        const nextFolder = normalizeReminder(fetchedReminder);

        if (!isMounted) return;

        setFolder(nextFolder);
      } catch (fetchError) {
        if (isMounted) {
          setError(
            getApiErrorMessage(fetchError, "Failed to load reminder data."),
          );
          setFolder(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setInitialLoad(false);
        }
      }
    };

    fetchReminder();

    return () => {
      isMounted = false;
    };
  }, [folderId]);

  if (initialLoad || (loading && !folder)) {
    return (
      <PageLoader
        title="Loading Reminder"
        message="Opening reminder details..."
      />
    );
  }

  if (!folder) {
    return <Navigate to="/reminders" replace />;
  }

  const template = folder.templateDefinition;

  const updateTemplate = async (fields) => {
    setIsUpdatingReminder(true);
    setError("");

    try {
      const payload = {
        title: folder.name,
        template: normalizeReminderPayloadTemplate(fields),
      };

      const response = await reminderApi.updateReminder(payload, folder.id);
      const updatedReminder = getReminderFromResponse(response) || {
        ...folder,
        title: payload.title,
        template: payload.template,
      };
      setFolder(normalizeReminder(updatedReminder));
    } catch (updateError) {
      setError(
        getApiErrorMessage(updateError, "Failed to update reminder template."),
      );
      throw updateError;
    } finally {
      setIsUpdatingReminder(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-amber-700 p-6 text-white shadow-xl md:flex-row md:items-start md:justify-between">
        <div>
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
            to="/reminders"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to folders
          </Link>
          <h1 className="mt-4 text-3xl font-bold">{folder.name}</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/80">
            This page edits the reminder template only. The mobile app will fill
            the actual values later.
          </p>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <TemplateEditor
        folderName={folder.name}
        fields={template.fields}
        isSubmitting={isUpdatingReminder}
        onSubmit={updateTemplate}
      />
    </div>
  );
}
