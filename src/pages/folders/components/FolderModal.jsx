import React, { useMemo, useState } from "react";
import Modal from "../../../components/ui/Modal.jsx";

const FIELD_TYPE_OPTIONS = ["text", "email", "date", "time", "datetime", "phone", "number", "file", "image", "dropdown", "select"];
const DEFAULT_COLOR = "#4CAF50";

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

function createInitialState() {
  return {
    name: "",
    color: DEFAULT_COLOR,
    template: [createEmptyField()]
  };
}

function normalizeTemplateFields(fields) {
  return fields
    .map((field) => {
      const normalizedField = {
        label: field.label.trim(),
        key: field.key.trim() || buildKeyFromLabel(field.label),
        type: field.type || "text"
      };

      if (field.required) {
        normalizedField.required = true;
      }

      if (field.type === "dropdown" || field.type === "select") {
        normalizedField.options = field.optionsText
          .split(",")
          .map((option) => option.trim())
          .filter(Boolean);
      }

      return normalizedField;
    })
    .filter((field) => field.label && field.key && (!["dropdown", "select"].includes(field.type) || field.options?.length));
}

export default function FolderModal({ open, onClose, onSubmit, modalTitle = "Create Folder", isSubmitting = false }) {
  const [formState, setFormState] = useState(createInitialState);
  const [submitError, setSubmitError] = useState("");
  const normalizedTemplate = useMemo(() => normalizeTemplateFields(formState.template), [formState.template]);

  const handleClose = () => {
    setFormState(createInitialState());
    setSubmitError("");
    onClose();
  };

  const updateField = (fieldIndex, key, value) => {
    setFormState((current) => ({
      ...current,
      template: current.template.map((field, index) =>
        index === fieldIndex
          ? {
            ...field,
            [key]: value,
            ...(key === "type" && value !== "dropdown" && value !== "select" ? { optionsText: "" } : {}),
            ...(key === "label" ? { key: buildKeyFromLabel(value) } : {})
          }
          : field
      )
    }));
  };

  const addField = () => {
    setFormState((current) => ({
      ...current,
      template: [...current.template, createEmptyField()]
    }));
  };

  const removeField = (fieldIndex) => {
    setFormState((current) => ({
      ...current,
      template: current.template.filter((_, index) => index !== fieldIndex)
    }));
  };

  const handleSubmit = async () => {
    if (!formState.name.trim()) return;

    if (!normalizedTemplate.length) {
      setSubmitError("Add at least one valid template field before creating the folder.");
      return;
    }

    setSubmitError("");

    try {
      await onSubmit({
        name: formState.name.trim(),
        color: formState.color,
        template: normalizedTemplate
      });
      setFormState(createInitialState());
    } catch (error) {
      setSubmitError(error?.response?.data?.message || error?.message || "Failed to create folder.");
    }
  };

  return (
    <Modal
      open={open}
      title={modalTitle}
      onClose={handleClose}
      actions={
        <>
          <button
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
            disabled={isSubmitting}
            onClick={handleClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={isSubmitting || !formState.name.trim() || !normalizedTemplate.length}
            onClick={handleSubmit}
            type="button"
          >
            {isSubmitting ? "Creating..." : "Create Folder"}
          </button>
        </>
      }
    >
      <div className="space-y-5">
        {submitError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {submitError}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700">Folder Name</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400"
              disabled={isSubmitting}
              onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
              placeholder="Travel Documents"
              type="text"
              value={formState.name}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700">Folder Color</span>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2">
              <input
                className="h-10 w-14 cursor-pointer rounded border-0 bg-transparent p-0"
                disabled={isSubmitting}
                onChange={(event) => setFormState((current) => ({ ...current, color: event.target.value }))}
                type="color"
                value={formState.color}
              />
              <input
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-400"
                disabled={isSubmitting}
                onChange={(event) => setFormState((current) => ({ ...current, color: event.target.value }))}
                placeholder="#4CAF50"
                type="text"
                value={formState.color}
              />
            </div>
          </label>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-800">Template Fields</div>
              <div className="text-xs text-slate-500">These fields are sent as the folder `template` array.</div>
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

          <div className="max-h-[48vh] space-y-4 overflow-y-auto pr-1">
            {formState.template.map((field, fieldIndex) => (
              <div key={`folder-template-field-${fieldIndex}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-800">Field {fieldIndex + 1}</div>
                  {formState.template.length > 1 ? (
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
                      placeholder="Phone Number"
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
                      placeholder="phone_number"
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
                        placeholder="Personal, Business, Family"
                        type="text"
                        value={field.optionsText || ""}
                      />
                      <div className="text-xs text-slate-500">Separate each option with a comma.</div>
                    </label>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
