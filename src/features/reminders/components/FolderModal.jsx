import React, { useState } from "react";
import Modal from "../../../components/ui/Modal.jsx";

const initialState = {
  name: ""
};

export default function FolderModal({ open, onClose, onSubmit, modalTitle = "Create Reminder Folder", isSubmitting = false }) {
  const [formState, setFormState] = useState(initialState);
  const [submitError, setSubmitError] = useState("");

  const handleClose = () => {
    setFormState(initialState);
    setSubmitError("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!formState.name.trim()) return;

    setSubmitError("");

    try {
      await onSubmit(formState);
      setFormState(initialState);
    } catch (error) {
      setSubmitError(error?.response?.data?.message || error?.message || "Failed to create reminder.");
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
            disabled={isSubmitting || !formState.name.trim()}
            onClick={handleSubmit}
            type="button"
          >
            {isSubmitting ? "Creating..." : "Create Folder"}
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

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700">Folder Name</span>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400"
            disabled={isSubmitting}
            onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
            placeholder="Client renewals"
            type="text"
            value={formState.name}
          />
        </label>
      </div>
    </Modal>
  );
}
