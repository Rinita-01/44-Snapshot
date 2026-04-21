import React, { useMemo, useState } from "react";
import Modal from "../../../components/ui/Modal.jsx";

function buildKeyFromLabel(label) {
  return label
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

function createEmptySection(template) {
  return template.fields.reduce((accumulator, field) => {
    accumulator[field.key] = field.type === "dropdown" ? String(field.options?.[0] || "") : "";
    return accumulator;
  }, {});
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

function FieldInput({ field, value, onChange, inputId }) {
  if (field.type === "dropdown") {
    return (
      <select
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400"
        id={inputId}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {field.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "file" || field.type === "image") {
    return (
      <input
        accept={field.accept}
        className="w-full rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white"
        id={inputId}
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) {
            onChange("");
            return;
          }

          const dataUrl = await readFileAsDataUrl(file);
          onChange({
            name: file.name,
            size: file.size,
            type: file.type,
            url: dataUrl
          });
        }}
        type="file"
      />
    );
  }

  return (
    <input
      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400"
      id={inputId}
      onChange={(event) => onChange(event.target.value)}
      placeholder={field.placeholder}
      type={field.type}
      value={value}
    />
  );
}

export default function DynamicEntryForm({ open, folderName, template, onClose, onSubmit, isSubmitting = false }) {
  const emptySection = useMemo(() => createEmptySection(template), [template]);
  const [sections, setSections] = useState([{ ...emptySection }]);
  const [submitError, setSubmitError] = useState("");

  const handleClose = () => {
    if (isSubmitting) return;
    setSections([{ ...emptySection }]);
    setSubmitError("");
    onClose();
  };

  const updateSection = (sectionIndex, key, nextValue) => {
    setSections((currentSections) =>
      currentSections.map((section, index) => (
        index === sectionIndex
          ? {
            ...section,
            [key]: nextValue,
            ...(key === "label" ? { key: buildKeyFromLabel(nextValue) } : {})
          }
          : section
      ))
    );
  };

  const addSection = () => {
    setSections((currentSections) => [...currentSections, { ...emptySection }]);
  };

  const removeSection = (sectionIndex) => {
    setSections((currentSections) => currentSections.filter((_, index) => index !== sectionIndex));
  };

  const handleSubmit = async () => {
    setSubmitError("");

    try {
      await onSubmit(sections);
      setSections([{ ...emptySection }]);
    } catch (error) {
      setSubmitError(error?.response?.data?.message || error?.message || "Failed to save entries.");
    }
  };

  return (
    <Modal
      open={open}
      title={`Add Entries to ${folderName}`}
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
            disabled={isSubmitting}
            onClick={handleSubmit}
            type="button"
          >
            {isSubmitting ? "Saving..." : "Save Entries"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {submitError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {submitError}
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-800">Template fields</div>
            <div className="text-xs text-slate-500">Use the plus button to add repeatable entry blocks.</div>
          </div>
          <button
            className="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-xl font-light text-white"
            disabled={isSubmitting}
            onClick={addSection}
            type="button"
          >
            +
          </button>
        </div>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
          {sections.map((section, sectionIndex) => (
            <div key={`entry-section-${sectionIndex}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-slate-800">Entry {sectionIndex + 1}</div>
                {sections.length > 1 ? (
                  <button
                    className="text-xs font-semibold text-rose-600"
                    disabled={isSubmitting}
                    onClick={() => removeSection(sectionIndex)}
                    type="button"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {template.fields.map((field) => {
                  const inputId = `${field.key}-${sectionIndex}`;

                  return (
                    <label key={field.key} className="block space-y-2">
                      <span className="text-sm font-semibold text-slate-700">{field.label}</span>
                      <FieldInput
                        field={field}
                        inputId={inputId}
                        onChange={(nextValue) => updateSection(sectionIndex, field.key, nextValue)}
                        value={section[field.key]}
                      />
                      {typeof section[field.key] === "object" && section[field.key]?.url ? (
                        <a
                          className="inline-flex text-xs font-semibold text-slate-500 underline"
                          href={section[field.key].url}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Preview {section[field.key].name}
                        </a>
                      ) : null}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
