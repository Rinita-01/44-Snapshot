export function calculateReminderDate(eventDate, reminderDays) {
  if (!eventDate || !reminderDays) return "";

  const parsedDate = new Date(eventDate);
  if (Number.isNaN(parsedDate.getTime())) return "";

  const reminderDate = new Date(parsedDate);
  reminderDate.setDate(reminderDate.getDate() - Number(reminderDays));
  return reminderDate.toISOString();
}

export function calculateSnoozeUntil(option) {
  if (!option?.hours) return "";

  const snoozedUntil = new Date();
  snoozedUntil.setHours(snoozedUntil.getHours() + option.hours);
  return snoozedUntil.toISOString();
}

export function formatDateLabel(value, options) {
  if (!value) return "Not set";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid date";

  return new Intl.DateTimeFormat("en-US", options || {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}
