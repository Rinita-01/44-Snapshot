import React, { useState } from "react";

const initialSettings = {
  appName: "44 Snapshot",
  supportEmail: "support@44snapshot.com",
  storageLimit: "5 GB",
  region: "US-East"
};


export default function Settings() {
  const [form, setForm] = useState(initialSettings);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [preferences, setPreferences] = useState({
    emailSummaries: true,
    liveAlerts: false
  });
  const [status, setStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");

  const handleSubmit = () => {
    setStatus("Settings saved (demo). ");
    setTimeout(() => setStatus(""), 2000);
  };

  const handlePasswordUpdate = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordStatus("Please fill all password fields.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus("New passwords do not match.");
      return;
    }
    setPasswordStatus("Password updated (demo). ");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setPasswordStatus(""), 2000);
  };

  const togglePreference = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <div className="text-2xl font-semibold">Settings</div>
        <p className="mt-2 text-sm text-slate-500">Configure platform preferences, security, and billing rules.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-slate-800">General Settings</div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-600">
              App Name
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.appName}
                onChange={(event) => setForm((prev) => ({ ...prev, appName: event.target.value }))}
              />
            </label>
            <label className="text-sm text-slate-600">
              Support Email
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.supportEmail}
                onChange={(event) => setForm((prev) => ({ ...prev, supportEmail: event.target.value }))}
              />
            </label>
            <label className="text-sm text-slate-600">
              Default Storage Limit
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.storageLimit}
                onChange={(event) => setForm((prev) => ({ ...prev, storageLimit: event.target.value }))}
              />
            </label>
            <label className="text-sm text-slate-600">
              Default Region
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.region}
                onChange={(event) => setForm((prev) => ({ ...prev, region: event.target.value }))}
              />
            </label>
          </div>
          {status ? (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              {status}
            </div>
          ) : null}
          <div className="mt-6 flex justify-end">
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" type="button" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-slate-800">Change Password</div>
          <div className="mt-4 grid gap-4">
            <label className="text-sm text-slate-600">
              Current Password
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(event) => setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
                placeholder="Enter current password"
              />
            </label>
            <label className="text-sm text-slate-600">
              New Password
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                type="password"
                value={passwordForm.newPassword}
                onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                placeholder="Create a new password"
              />
            </label>
            <label className="text-sm text-slate-600">
              Confirm New Password
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                placeholder="Re-enter new password"
              />
            </label>
          </div>
          {passwordStatus ? (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
              {passwordStatus}
            </div>
          ) : null}
          <div className="mt-6 flex justify-end">
            <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700" type="button" onClick={handlePasswordUpdate}>
              Update Password
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="text-sm font-semibold text-slate-800">Preferences</div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <div className="font-semibold text-slate-900">Email summaries</div>
                <div className="text-xs text-slate-500">Weekly digest of platform activity</div>
              </div>
              <button
                className={`h-7 w-12 rounded-full p-1 ${preferences.emailSummaries ? "bg-slate-900" : "bg-slate-300"}`}
                type="button"
                onClick={() => togglePreference("emailSummaries")}
              >
                <span
                  className={`block h-5 w-5 rounded-full bg-white transition ${preferences.emailSummaries ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <div className="font-semibold text-slate-900">Live alerts</div>
                <div className="text-xs text-slate-500">Push notifications for critical events</div>
              </div>
              <button
                className={`h-7 w-12 rounded-full p-1 ${preferences.liveAlerts ? "bg-slate-900" : "bg-slate-300"}`}
                type="button"
                onClick={() => togglePreference("liveAlerts")}
              >
                <span
                  className={`block h-5 w-5 rounded-full bg-white transition ${preferences.liveAlerts ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
