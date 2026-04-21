import React, { useEffect, useMemo, useState } from "react";

const FIELD_TYPE_OPTIONS = ["text", "email", "date", "time", "phone", "number", "file", "image", "dropdown", "select"];

function buildKeyFromLabel(label) {
  return label
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

function createEmptyField() {
  return {
    label: "",
    key: "",
    type: "text",
    required: false,
    optionsText: ""
  };
}

function normalizeFields(fields) {
  if (!Array.isArray(fields) || !fields.length) {
    return [createEmptyField()];
  }

  return fields.map((field) => ({
    label: field?.label || "",
    key: field?.key || "",
    type: field?.type || "text",
    required: Boolean(field?.required),
    optionsText: Array.isArray(field?.options) ? field.options.join(", ") : ""
  }));
}

function sanitizeFields(fields) {
  return fields
    .map((field) => {
      const nextField = {
        label: field.label.trim(),
        key: field.key.trim() || buildKeyFromLabel(field.label),
        type: field.type || "text"
      };

      if (field.required) {
        nextField.required = true;
      }

      if (field.type === "dropdown" || field.type === "select") {
        nextField.options = field.optionsText
          .split(",")
          .map((option) => option.trim())
          .filter(Boolean);
      }

      return nextField;
    })
    .filter((field) => field.label && field.key && (!["dropdown", "select"].includes(field.type) || field.options?.length));
}

export default function TemplateEditor({ folderName, fields, isSubmitting = false, onSubmit }) {
  const [draftFields, setDraftFields] = useState(() => normalizeFields(fields));
  const [submitError, setSubmitError] = useState("");
  const sanitizedFields = useMemo(() => sanitizeFields(draftFields), [draftFields]);

  useEffect(() => {
    setDraftFields(normalizeFields(fields));
  }, [fields]);

  const updateField = (fieldIndex, key, value) => {
    setDraftFields((currentFields) =>
      currentFields.map((field, index) =>
        index === fieldIndex
          ? {
            ...field,
            [key]: value,
            ...(key === "type" && value !== "dropdown" && value !== "select" ? { optionsText: "" } : {}),
            ...(key === "label" ? { key: buildKeyFromLabel(value) } : {})
          }
          : field
      )
    );
  };

  const addField = () => {
    setDraftFields((currentFields) => [...currentFields, createEmptyField()]);
  };

  const removeField = (fieldIndex) => {
    setDraftFields((currentFields) => currentFields.filter((_, index) => index !== fieldIndex));
  };

  const handleSubmit = async () => {
    if (!sanitizedFields.length) {
      setSubmitError("Add at least one valid template field before saving.");
      return;
    }

    setSubmitError("");

    try {
      await onSubmit(sanitizedFields);
    } catch (error) {
      setSubmitError(error?.response?.data?.message || error?.message || "Failed to update template.");
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{folderName} Template</h2>
          <p className="mt-1 text-sm text-slate-500">Edit the template fields here. This page defines the form that the mobile app will fill.</p>
        </div>
        <button
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={isSubmitting || !sanitizedFields.length}
          onClick={handleSubmit}
          type="button"
        >
          {isSubmitting ? "Saving..." : "Save Template"}
        </button>
      </div>

      {submitError ? (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {submitError}
        </div>
      ) : null}

      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-800">Template Fields</div>
          <div className="text-xs text-slate-500">Each field becomes part of the folder form used in the mobile app.</div>
        </div>
        <button
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          disabled={isSubmitting}
          onClick={addField}
          type="button"
        >
          Add Field
        </button>
      </div>

      <div className="space-y-4">
        {draftFields.map((field, fieldIndex) => (
          <div key={`template-field-${fieldIndex}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-slate-800">Field {fieldIndex + 1}</div>
              {draftFields.length > 1 ? (
                <button
                  className="text-xs font-semibold text-rose-600"
                  disabled={isSubmitting}
                  onClick={() => removeField(fieldIndex)}
                  type="button"
                >
                  Remove
                </button>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">Label</span>
                <input
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400"
                  disabled={isSubmitting}
                  onChange={(event) => updateField(fieldIndex, "label", event.target.value)}
                  placeholder="Customer Name"
                  type="text"
                  value={field.label}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">Key</span>
                <input
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400"
                  disabled={isSubmitting}
                  onChange={(event) => updateField(fieldIndex, "key", event.target.value)}
                  placeholder="customer_name"
                  type="text"
                  value={field.key}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">Type</span>
                <select
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400"
                  disabled={isSubmitting}
                  onChange={(event) => updateField(fieldIndex, "type", event.target.value)}
                  value={field.type}
                >
                  {FIELD_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <input
                  checked={field.required}
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                  disabled={isSubmitting}
                  onChange={(event) => updateField(fieldIndex, "required", event.target.checked)}
                  type="checkbox"
                />
                <span className="text-sm font-semibold text-slate-700">Required field</span>
              </label>

              {field.type === "dropdown" || field.type === "select" ? (
                <label className="block space-y-2 md:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">Dropdown Options</span>
                  <input
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400"
                    disabled={isSubmitting}
                    onChange={(event) => updateField(fieldIndex, "optionsText", event.target.value)}
                    placeholder="Low, Medium, High"
                    type="text"
                    value={field.optionsText}
                  />
                  <div className="text-xs text-slate-500">Separate each option with a comma.</div>
                </label>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
