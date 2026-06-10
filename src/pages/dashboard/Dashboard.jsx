import React, { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid
} from "recharts";
import {
  UserIcon,
  BuildingOfficeIcon,
  BoltIcon,
  CloudIcon,
  ExclamationTriangleIcon,
  FolderIcon,
  BellIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import StatsCard from "../../components/ui/StatsCard.jsx";
import ChartCard from "../../components/ui/ChartCard.jsx";
import { PageLoader, CircleLoader } from "../../components/ui/Skeletons.jsx";
import { stats, userGrowthData, revenueData } from "../../data/dummyData.js";
import { folderApi, reminderApi, dashboardApi } from "../../api/index.js";
import { getFoldersFromResponse, normalizeFolder } from "../folders/utils/folderData.js";
import { getReminderFoldersFromResponse, normalizeReminder } from "../reminders/utils/reminderData.js";

const CustomActiveDot = (props) => {
  const { cx, cy, stroke } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={10} fill={stroke} opacity={0.3} className="animate-ping" />
      <circle cx={cx} cy={cy} r={5} fill="#ffffff" stroke={stroke} strokeWidth={2} />
    </g>
  );
};

const CustomTooltip = ({ active, payload, label, prefix = "", suffix = "" }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white/95 p-3 shadow-xl backdrop-blur-sm text-xs font-semibold text-slate-800 animate-fade-in">
        <p className="text-slate-400 text-[10px] font-medium uppercase tracking-wider mb-1.5">{label}</p>
        <p className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full animate-pulse"
            style={{ backgroundColor: payload[0].stroke || payload[0].color || '#3b82f6' }}
          />
          <span className="font-medium text-slate-500">{payload[0].name}:</span>
          <span className="text-slate-900 font-bold">{prefix}{payload[0].value.toLocaleString()}{suffix}</span>
        </p>
      </div>
    );
  }
  return null;
};

const iconMap = {
  individualUsers: UserIcon,
  companyUsers: BuildingOfficeIcon,
  activeSubscriptions: BoltIcon,
  storage: CloudIcon,
  requestTemplates: FolderIcon
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [folders, setFolders] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [foldersLoading, setFoldersLoading] = useState(true);
  const [remindersLoading, setRemindersLoading] = useState(true);
  const [foldersError, setFoldersError] = useState("");
  const [remindersError, setRemindersError] = useState("");
  const [statsData, setStatsData] = useState(stats);
  const [growthData, setGrowthData] = useState(userGrowthData);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchFolders = async () => {
      try {
        const response = await folderApi.getFolders();
        const nextFolders = getFoldersFromResponse(response).map(normalizeFolder);
        if (isMounted) setFolders(nextFolders);
      } catch (err) {
        if (isMounted) setFoldersError("Failed to load folder templates");
      } finally {
        if (isMounted) setFoldersLoading(false);
      }
    };

    const fetchReminders = async () => {
      try {
        const response = await reminderApi.getReminderData();
        const nextReminders = getReminderFoldersFromResponse(response).map(normalizeReminder);
        if (isMounted) setReminders(nextReminders);
      } catch (err) {
        if (isMounted) setRemindersError("Failed to load reminder folders");
      } finally {
        if (isMounted) setRemindersLoading(false);
      }
    };

    const fetchDashboardData = async () => {
      try {
        const response = await dashboardApi.getDashboardData();
        const dbData = response?.data || response;
        if (!isMounted) return;

        if (dbData?.userCount) {
          setStatsData((prev) =>
            prev.map((item) => {
              if (item.id === "individualUsers") {
                return { ...item, value: dbData.userCount.userCount.toLocaleString() };
              }
              if (item.id === "companyUsers") {
                return { ...item, value: dbData.userCount.companyUserCount.toLocaleString() };
              }
              if (item.id === "storage") {
                return { ...item, value: dbData.totalStorage.totalStorage.kb.toLocaleString() };
              }
              if (item.id === "requestTemplates") {
                return { ...item, value: dbData.requestTemplateCount.toLocaleString() };
              }
              return item;
            })
          );
        }

        if (Array.isArray(dbData?.userGrowth)) {
          setGrowthData(dbData.userGrowth);
        }
      } catch (err) {
        console.error("Failed to load dashboard statistics:", err);
      }
    };

    fetchFolders();
    fetchReminders();
    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <PageLoader title="Loading Dashboard" message="Preparing your overview data..." />;
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <div className="text-2xl font-semibold">Overview</div>
        <p className="mt-2 text-sm text-slate-500">
          Real-time snapshot of growth, storage health, and revenue performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {statsData.map((item) => (
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
        <ChartCard
          title="User growth"
          subtitle="Monthly active users across all plans"
          action="Last 7 months"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="userGrowth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} dy={8} style={{ fontSize: '11px' }} />
              <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} style={{ fontSize: '11px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                name="Active Users"
                type="monotone"
                dataKey="users"
                stroke="#06b6d4"
                strokeWidth={3}
                fill="url(#userGrowth)"
                activeDot={<CustomActiveDot />}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Subscription revenue"
          subtitle="Recurring monthly revenue trend"
          action="GBP"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} dy={8} style={{ fontSize: '11px' }} />
              <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} style={{ fontSize: '11px' }} />
              <Tooltip content={<CustomTooltip prefix="£" />} />
              <Area
                name="Monthly Revenue"
                type="monotone"
                dataKey="revenue"
                stroke="#8b5cf6"
                strokeWidth={3}
                fill="url(#revenue)"
                activeDot={<CustomActiveDot />}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>



      <div className="grid gap-6 lg:grid-cols-2 animate-fade-up">
        {/* Folder Templates Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Folder Templates</h2>
              <p className="text-xs text-slate-500">Quick access to repeatable document templates</p>
            </div>
            <button
              onClick={() => navigate("/create-templates")}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl"
            >
              View all
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {foldersLoading ? (
              <div className="flex h-32 items-center justify-center">
                <CircleLoader size="small" />
              </div>
            ) : foldersError ? (
              <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-xs text-rose-600">
                {foldersError}
              </div>
            ) : folders.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500">
                No folder templates created yet.
              </div>
            ) : (
              folders.slice(0, 5).map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => navigate(`/create-templates/${folder.id}`)}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-xl text-white shadow-sm flex items-center justify-center animate-fade-in"
                      style={{ backgroundColor: folder.color || '#f59e0b' }}
                    >
                      <FolderIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">{folder.name}</div>
                    </div>
                  </div>
                  <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition animate-pulse-subtle" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reminder Folders Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Reminder Folders</h2>
              <p className="text-xs text-slate-500">Quick access to reminder templates</p>
            </div>
            <button
              onClick={() => navigate("/reminders")}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl"
            >
              View all
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {remindersLoading ? (
              <div className="flex h-32 items-center justify-center">
                <CircleLoader size="small" />
              </div>
            ) : remindersError ? (
              <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-xs text-rose-600">
                {remindersError}
              </div>
            ) : reminders.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500">
                No reminder folders created yet.
              </div>
            ) : (
              reminders.slice(0, 5).map((reminder) => (
                <div
                  key={reminder.id}
                  onClick={() => navigate(`/reminders/${reminder.id}`)}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600 shadow-sm flex items-center justify-center group-hover:bg-indigo-200/80 transition-colors">
                      <BellIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">{reminder.name}</div>
                    </div>
                  </div>
                  <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition animate-pulse-subtle" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
