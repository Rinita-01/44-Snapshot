import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/auth-context";

export default function Profile() {
  const { user, refreshProfile } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!refreshProfile || user) return;
      setLoading(true);
      const result = await refreshProfile();
      if (isMounted && !result.ok) {
        setError(result.message);
      }
      if (isMounted) setLoading(false);
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [refreshProfile, user]);

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <div className="text-2xl font-semibold">Admin Profile</div>
        <p className="mt-2 text-sm text-slate-500">Manage your profile details and access preferences.</p>
        {loading ? <div className="mt-3 text-xs text-slate-400">Loading profile...</div> : null}
        {error ? <div className="mt-3 text-xs text-rose-500">{error}</div> : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="text-sm font-semibold text-slate-800">Profile Information</div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-600">
              Full Name
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={user?.name || "Ava Carter"}
                readOnly
              />
            </label>
            <label className="text-sm text-slate-600">
              Email
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={user?.email || "admin@44snapshot.com"}
                readOnly
              />
            </label>
            <label className="text-sm text-slate-600">
              Role
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={user?.role || "Operations Admin"}
                readOnly
              />
            </label>
            <label className="text-sm text-slate-600">
              Location
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={user?.location || "New York, USA"}
                readOnly
              />
            </label>
          </div>

          <div className="mt-6 flex justify-end">
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" type="button">
              Save Changes
            </button>
          </div>
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-slate-800">Access Overview</div>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs text-slate-400">Last Login</div>
              <div className="font-semibold text-slate-900">2026-03-12 09:40</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs text-slate-400">Team</div>
              <div className="font-semibold text-slate-900">Operations</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs text-slate-400">Security Level</div>
              <div className="font-semibold text-slate-900">Tier 2</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
