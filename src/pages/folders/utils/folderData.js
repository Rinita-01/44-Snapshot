import { normalizeFolderColor } from "./folderColors.js";

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

export function normalizeFolder(folder, index = 0) {
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

export function getFoldersFromResponse(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.folders)) return payload.folders;
  if (Array.isArray(payload?.data?.folders)) return payload.data.folders;
  if (Array.isArray(payload?.results)) return payload.results;

  return [];
}

export function getFolderFromResponse(payload) {
  if (!payload) return null;
  if (payload.folder && typeof payload.folder === "object") return payload.folder;
  if (payload.data?.folder && typeof payload.data.folder === "object") return payload.data.folder;
  if (payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)) return payload.data;
  if (payload.result && typeof payload.result === "object") return payload.result;

  return null;
}
