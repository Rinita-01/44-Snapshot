export const REMINDER_DAYS_OPTIONS = [7, 30, 60];

export const SNOOZE_OPTIONS = [
  { label: "4 hours", value: "4h", hours: 4 },
  { label: "1 day", value: "1d", hours: 24 },
  { label: "7 days", value: "7d", hours: 168 }
];

const genericEntryFields = [
  { key: "label", label: "Label", type: "text", placeholder: "Display label" },
  { key: "key", label: "Key", type: "text", placeholder: "unique_key" },
  {
    key: "type",
    label: "Type",
    type: "dropdown",
    options: ["text", "date", "number", "float", "file"]
  },
  {
    key: "required",
    label: "Required",
    type: "dropdown",
    options: ["Yes", "No"]
  }
];

export const reminderTemplates = {
  birthdays: {
    key: "birthdays",
    name: "Birthdays",
    primaryDateField: "",
    fields: genericEntryFields
  },
  tickets: {
    key: "tickets",
    name: "Tickets",
    primaryDateField: "",
    fields: genericEntryFields
  },
  warranties: {
    key: "warranties",
    name: "Warranties",
    primaryDateField: "",
    fields: genericEntryFields
  },
  tax: {
    key: "tax",
    name: "Tax",
    primaryDateField: "",
    fields: genericEntryFields
  },
  maintenance: {
    key: "maintenance",
    name: "Maintenance",
    primaryDateField: "",
    fields: genericEntryFields
  },
  employeeTraining: {
    key: "employeeTraining",
    name: "Employee Training",
    primaryDateField: "",
    fields: genericEntryFields
  }
};

export const reminderTemplateOptions = Object.values(reminderTemplates).map((template) => ({
  label: template.name,
  value: template.key
}));
