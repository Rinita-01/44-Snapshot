import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import {
  UsersIcon,
  BoltIcon,
  CloudIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import StatsCard from "../../components/StatsCard.jsx";
import ChartCard from "../../components/ChartCard.jsx";
import { SkeletonCard, SkeletonChart } from "../../components/Skeletons.jsx";
import { stats, userGrowthData, revenueData, recentActivity } from "../../data/dummyData.js";

const iconMap = {
  totalUsers: UsersIcon,
  activeSubscriptions: BoltIcon,
  storage: CloudIcon,
  systemAlerts: ExclamationTriangleIcon
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <div className="text-2xl font-semibold">Overview</div>
        <p className="mt-2 text-sm text-slate-500">
          Real-time snapshot of growth, storage health, and revenue performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {loading
          ? Array.from({ length: 5 }).map((_, idx) => <SkeletonCard key={idx} />)
          : stats.map((item) => (
            <StatsCard
              key={item.id}
              title={item.title}
              value={item.value}
              delta={item.delta}
              caption={item.caption}
              icon={iconMap[item.id]}
              accent="#e2e8f0"
            />
          ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {loading ? (
          <SkeletonChart />
        ) : (
          <ChartCard
            title="User growth"
            subtitle="Monthly active users across all plans"
            action="Last 7 months"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#0f172a" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {loading ? (
          <SkeletonChart />
        ) : (
          <ChartCard
            title="Subscription revenue"
            subtitle="Recurring monthly revenue trend"
            action="USD"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="url(#revenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="text-sm font-semibold text-slate-800">Operational highlights</div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              { label: "New signups", value: "6,412", note: "Last 7 days" },
              { label: "Trial conversions", value: "1,284", note: "Last 7 days" },
              { label: "Upgrade requests", value: "312", note: "Last 7 days" }
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">{item.label}</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">{item.value}</div>
                <div className="text-xs text-slate-500">{item.note}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-slate-800">Recent activity</div>
          <div className="mt-4 space-y-4">
            {recentActivity.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-sm font-semibold text-slate-800">{item.title}</div>
                <div className="text-xs text-slate-500">{item.detail}</div>
                <div className="mt-2 text-[11px] font-semibold text-slate-400">{item.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
