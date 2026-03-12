import React from "react";
import { StatCard, InfoCard } from "../components/Cards.jsx";
import { SparkBar, LineChart } from "../components/Charts.jsx";
import { stats, charts } from "../data/mock.js";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard title="Total Users" value={stats.totalUsers} delta="+8.4%" hint="vs last month" accent="#2F80ED" />
        <StatCard title="Active Subscriptions" value={stats.activeSubscriptions} delta="+4.1%" hint="monthly" accent="#27AE60" />
        <StatCard title="Expiring Documents" value={stats.expiringDocs} delta="-2.5%" hint="30 days" accent="#F2994A" />
        <StatCard title="Total Documents" value={stats.totalDocs} delta="+5.2%" hint="rolling 90 days" accent="#9B51E0" />
        <StatCard title="Storage Usage" value={stats.storageUsage} delta="+1.9%" hint="capacity" accent="#111827" />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <InfoCard title="Monthly New Users">
          <SparkBar data={charts.monthlyUsers} color="#2F80ED" />
        </InfoCard>
        <InfoCard title="Subscription Revenue">
          <LineChart data={charts.revenue} color="#27AE60" title="Revenue Growth" />
        </InfoCard>
        <InfoCard title="Document Upload Activity">
          <LineChart data={charts.uploads} color="#9B51E0" title="Upload Activity" />
        </InfoCard>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <InfoCard title="Security Posture">
          <div className="grid gap-4">
            <div>
              <div className="text-xs text-slate-500">Active JWT Sessions</div>
              <div className="text-lg font-bold">1,240</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Failed Login Attempts</div>
              <div className="text-lg font-bold">38</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Auto Logouts (24h)</div>
              <div className="text-lg font-bold">112</div>
            </div>
          </div>
        </InfoCard>
        <InfoCard title="Document Categories">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white">Motor Insurance</span>
            <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">Health Insurance</span>
            <span className="rounded-full bg-purple-500 px-3 py-1 text-xs font-semibold text-white">Personal Docs</span>
            <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">Certificates</span>
          </div>
        </InfoCard>
        <InfoCard title="System Notices">
          <ul className="list-disc space-y-2 pl-4 text-sm">
            <li>Stripe billing webhook queue healthy.</li>
            <li>Apple Pay reconciliation completed.</li>
            <li>Storage usage alert: 12 users above 90%.</li>
          </ul>
        </InfoCard>
      </section>
    </div>
  );
}