import React, { useState } from "react";
import Modal from "../components/Modal.jsx";

export default function Settings() {
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [faceEnabled, setFaceEnabled] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <div className="text-2xl font-semibold">Settings</div>
        <p className="mt-2 text-sm text-slate-500">Configure platform preferences, security, and billing rules.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="text-sm font-semibold text-slate-800">General Settings</div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-600">
              App Name
              <input className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" defaultValue="44 Snapshot" />
            </label>
            <label className="text-sm text-slate-600">
              Support Email
              <input className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" defaultValue="support@44snapshot.com" />
            </label>
            <label className="text-sm text-slate-600">
              Default Storage Limit
              <input className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" defaultValue="5 GB" />
            </label>
            <label className="text-sm text-slate-600">
              Default Region
              <input className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" defaultValue="US-East" />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-slate-800">Security Settings</div>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-slate-700">Enable MFA</div>
                <div className="text-xs text-slate-500">Require multi-factor authentication</div>
              </div>
              <button
                className={`h-7 w-12 rounded-full p-1 transition ${mfaEnabled ? "bg-slate-900" : "bg-slate-300"}`}
                onClick={() => setMfaEnabled((prev) => !prev)}
                type="button"
              >
                <span
                  className={`block h-5 w-5 rounded-full bg-white transition ${mfaEnabled ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-slate-700">Enable Face Recognition</div>
                <div className="text-xs text-slate-500">Allow biometric login for mobile app</div>
              </div>
              <button
                className={`h-7 w-12 rounded-full p-1 transition ${faceEnabled ? "bg-slate-900" : "bg-slate-300"}`}
                onClick={() => setFaceEnabled((prev) => !prev)}
                type="button"
              >
                <span
                  className={`block h-5 w-5 rounded-full bg-white transition ${faceEnabled ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold text-slate-800">Subscription Settings</div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <label className="text-sm text-slate-600">
            Monthly price
            <input className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" defaultValue="$9.99" />
          </label>
          <label className="text-sm text-slate-600">
            Annual price
            <input className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" defaultValue="$99.00" />
          </label>
          <label className="text-sm text-slate-600">
            Free trial duration
            <input className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" defaultValue="30 days" />
          </label>
        </div>
        <div className="mt-6 flex justify-end">
          <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={() => setConfirmOpen(true)} type="button">
            Save Changes
          </button>
        </div>
      </section>

      <Modal
        open={confirmOpen}
        title="Save Settings"
        onClose={() => setConfirmOpen(false)}
        actions={
          <>
            <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={() => setConfirmOpen(false)} type="button">
              Cancel
            </button>
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={() => setConfirmOpen(false)} type="button">
              Confirm
            </button>
          </>
        }
      >
        <div className="text-sm text-slate-600">Apply updated general, security, and subscription settings?</div>
      </Modal>
    </div>
  );
}
