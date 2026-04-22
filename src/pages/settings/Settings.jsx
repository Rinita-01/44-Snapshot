import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { ChangepasswordApi } from "@/api";
import { getApiErrorMessage } from "@/api/helpers";
import { useToast } from "@/components/ui/Toast";
import { PageLoader } from "../../components/ui/Skeletons.jsx";

const initialSettings = {
  appName: "44 Snapshot",
  supportEmail: "support@44snapshot.com",
  storageLimit: "5 GB",
  region: "US-East",
};

export default function Settings() {
  const { pushToast } = useToast();
  const [form, setForm] = useState(initialSettings);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [preferences, setPreferences] = useState({
    emailSummaries: true,
    liveAlerts: false,
  });
  const [status, setStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleSubmit = () => {
    setStatus("Settings saved (demo). ");
    setTimeout(() => setStatus(""), 2000);
  };

  const handlePasswordUpdate = async () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordStatus("Please fill all password fields.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus("New passwords do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordStatus("");

    try {
      const payload = {
        oldPassword: passwordForm.currentPassword,
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
        confirmNewPassword: passwordForm.confirmPassword,
      };

      const response = await ChangepasswordApi.changePassword(payload);
      const successMessage =
        response?.message ||
        response?.data?.message ||
        "Password updated successfully.";

      setPasswordStatus(successMessage);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      pushToast(successMessage, "success");
      setTimeout(() => setPasswordStatus(""), 2000);
    } catch (error) {
      const message = getApiErrorMessage(error, "Failed to update password.");
      setPasswordStatus(message);
      pushToast(message, "error");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const togglePreference = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePasswordVisibility = (key) => {
    setShowPasswords((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (isUpdatingPassword) {
    return (
      <PageLoader
        title="Updating Password"
        message="Please wait while we update your password..."
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <div className="text-2xl font-semibold">Settings</div>
        <p className="mt-2 text-sm text-slate-500">
          Configure platform preferences, security, and billing rules.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-slate-800">
            General Settings
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-600">
              App Name
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.appName}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, appName: event.target.value }))
                }
              />
            </label>
            <label className="text-sm text-slate-600">
              Support Email
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.supportEmail}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    supportEmail: event.target.value,
                  }))
                }
              />
            </label>
            <label className="text-sm text-slate-600">
              Default Storage Limit
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.storageLimit}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    storageLimit: event.target.value,
                  }))
                }
              />
            </label>
            <label className="text-sm text-slate-600">
              Default Region
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.region}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, region: event.target.value }))
                }
              />
            </label>
          </div>
          {status ? (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              {status}
            </div>
          ) : null}
          <div className="mt-6 flex justify-end">
            <button
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              type="button"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-slate-800">
            Change Password
          </div>
          <div className="mt-4 grid gap-4">
            <label className="text-sm text-slate-600">
              Current Password
              <div className="relative mt-2">
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 pr-11 text-sm"
                  type={showPasswords.currentPassword ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      currentPassword: event.target.value,
                    }))
                  }
                  placeholder="Enter current password"
                />
                <button
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 transition hover:text-slate-600"
                  type="button"
                  onClick={() => togglePasswordVisibility("currentPassword")}
                  aria-label={
                    showPasswords.currentPassword
                      ? "Hide current password"
                      : "Show current password"
                  }
                >
                  {showPasswords.currentPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </label>
            <label className="text-sm text-slate-600">
              New Password
              <div className="relative mt-2">
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 pr-11 text-sm"
                  type={showPasswords.newPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      newPassword: event.target.value,
                    }))
                  }
                  placeholder="Create a new password"
                />
                <button
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 transition hover:text-slate-600"
                  type="button"
                  onClick={() => togglePasswordVisibility("newPassword")}
                  aria-label={
                    showPasswords.newPassword
                      ? "Hide new password"
                      : "Show new password"
                  }
                >
                  {showPasswords.newPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </label>
            <label className="text-sm text-slate-600">
              Confirm New Password
              <div className="relative mt-2">
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 pr-11 text-sm"
                  type={showPasswords.confirmPassword ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      confirmPassword: event.target.value,
                    }))
                  }
                  placeholder="Re-enter new password"
                />
                <button
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 transition hover:text-slate-600"
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  aria-label={
                    showPasswords.confirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showPasswords.confirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </label>
          </div>
          {passwordStatus ? (
            <div
              className={`mt-4 rounded-xl px-3 py-2 text-xs ${
                passwordStatus.toLowerCase().includes("success") ||
                passwordStatus.toLowerCase().includes("updated")
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border border-rose-200 bg-rose-50 text-rose-700"
              }`}
            >
              {passwordStatus}
            </div>
          ) : null}
          <div className="mt-6 flex justify-end">
            <button
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
              type="button"
              onClick={handlePasswordUpdate}
            >
              Update Password
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="text-sm font-semibold text-slate-800">
            Preferences
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <div className="font-semibold text-slate-900">
                  Email summaries
                </div>
                <div className="text-xs text-slate-500">
                  Weekly digest of platform activity
                </div>
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
                <div className="text-xs text-slate-500">
                  Push notifications for critical events
                </div>
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
