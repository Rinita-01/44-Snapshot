import React from "react";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Settings</h2>
        <p className="text-sm text-slate-500">Configure notifications, security, and payment gateways.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="text-sm font-semibold">Notification Settings</div>
          <div className="mt-3 space-y-3 text-sm">
            <label className="block">
              Email Alerts
              <select className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3">
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </label>
            <label className="block">
              SMS Alerts
              <select className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3">
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </label>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="text-sm font-semibold">Security Settings</div>
          <div className="mt-3 space-y-3 text-sm">
            <label className="block">
              Session Timeout
              <select className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3">
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>60 minutes</option>
              </select>
            </label>
            <label className="block">
              MFA Enforcement
              <select className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3">
                <option>Required</option>
                <option>Optional</option>
              </select>
            </label>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="text-sm font-semibold">Payment Gateway</div>
          <div className="mt-3 space-y-3 text-sm">
            <label className="block">
              Stripe
              <input className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3" placeholder="Stripe API Key" />
            </label>
            <label className="block">
              Apple Pay
              <input className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3" placeholder="Apple Pay Merchant ID" />
            </label>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="text-sm font-semibold">Storage Limits</div>
          <div className="mt-3 space-y-3 text-sm">
            <label className="block">
              Free Tier
              <input className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3" defaultValue="5 GB" />
            </label>
            <label className="block">
              Pro Tier
              <input className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3" defaultValue="50 GB" />
            </label>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="text-sm font-semibold">Subscription Pricing</div>
          <div className="mt-3 space-y-3 text-sm">
            <label className="block">
              Basic
              <input className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3" defaultValue="$5 / month" />
            </label>
            <label className="block">
              Pro
              <input className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3" defaultValue="$12 / month" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}