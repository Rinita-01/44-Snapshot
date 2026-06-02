export function normalizeTemplateField(field, index = 0) {
  return {
    label: field?.label || `Field ${index + 1}`,
    key: field?.key || `field_${index + 1}`,
    type: field?.type || "text",
    required: Boolean(field?.required),
    options: Array.isArray(field?.options) ? field.options : [],
    _id: field?._id,
  };
}

export function buildTemplateDefinition(reminder) {
  if (reminder?.templateDefinition && Array.isArray(reminder.templateDefinition.fields)) {
    return reminder.templateDefinition;
  }

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

export function normalizeReminder(reminder, index = 0) {
  const templateDefinition = buildTemplateDefinition(reminder);

  return {
    ...reminder,
    id: reminder?.id || reminder?._id || `reminder-${index}`,
    name: reminder?.name || reminder?.title || `Reminder Folder ${index + 1}`,
    templateDefinition,
    template: templateDefinition.key,
  };
}

export function normalizeReminderPayloadTemplate(fields) {
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

export function getReminderFoldersFromResponse(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.folders)) return payload.folders;
  if (Array.isArray(payload?.reminders)) return payload.reminders;
  if (Array.isArray(payload?.data?.folders)) return payload.data.folders;
  if (Array.isArray(payload?.data?.reminders)) return payload.data.reminders;
  if (Array.isArray(payload?.results)) return payload.results;

  return [];
}

export function getReminderFromResponse(payload) {
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

export function getCreatedReminderFromResponse(payload) {
  return getReminderFromResponse(payload);
}
