import React, { useState } from "react";
import Modal from "../../../components/ui/Modal.jsx";
import { reminderTemplateOptions } from "../data/templates.js";

const initialState = {
  name: "",
  template: reminderTemplateOptions[0]?.value || ""
};

export default function FolderModal({ open, onClose, onSubmit, modalTitle = "Create Reminder Folder" }) {
  const [formState, setFormState] = useState(initialState);

  const handleClose = () => {
    setFormState(initialState);
    onClose();
  };

  const handleSubmit = () => {
    if (!formState.name.trim() || !formState.template) return;

    onSubmit(formState);
    setFormState(initialState);
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
            onClick={handleClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={!formState.name.trim() || !formState.template}
            onClick={handleSubmit}
            type="button"
          >
            Create Folder
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700">Folder Name</span>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400"
            onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
            placeholder="Client renewals"
            type="text"
            value={formState.name}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700">Template Type</span>
          <select
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400"
            onChange={(event) => setFormState((current) => ({ ...current, template: event.target.value }))}
            value={formState.template}
          >
            {reminderTemplateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </Modal>
  );
}
