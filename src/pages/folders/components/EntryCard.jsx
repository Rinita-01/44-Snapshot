import React from "react";
import { ClockIcon, PaperClipIcon } from "@heroicons/react/24/outline";
import { formatDateLabel } from "../../reminders/utils/reminderDates.js";

function renderFieldValue(value) {
  if (!value) return "Not provided";

  if (typeof value === "object" && value.url) {
    return (
      <a className="inline-flex items-center gap-1 text-slate-700 underline" href={value.url} rel="noreferrer" target="_blank">
        <PaperClipIcon className="h-4 w-4" />
        {value.name}
      </a>
    );
  }

  return String(value);
}

export default function EntryCard({ entry, template, snoozeOptions, onSnooze }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{template.name}</div>
          <div className="mt-2 text-sm text-slate-600">
            Reminder date: <span className="font-semibold text-slate-800">{formatDateLabel(entry.reminderDate)}</span>
          </div>
          <div className="mt-1 text-sm text-slate-600">
            Snoozed until: <span className="font-semibold text-slate-800">{formatDateLabel(entry.snoozedUntil, {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit"
            })}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {snoozeOptions.map((option) => (
            <button
              key={option.value}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              onClick={() => onSnooze(option.value)}
              type="button"
            >
              <ClockIcon className="h-4 w-4" />
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {template.fields.map((field) => (
          <div key={field.key} className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{field.label}</div>
            <div className="mt-2 text-sm font-medium text-slate-700">{renderFieldValue(entry.values[field.key])}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
