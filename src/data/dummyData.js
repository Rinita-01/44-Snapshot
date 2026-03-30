export const stats = [
  {
    id: "totalUsers",
    title: "Total Users",
    value: "128,480",
    delta: "+8.2%",
    caption: "vs Feb 2026"
  },
  {
    id: "activeSubscriptions",
    title: "Active Subscriptions",
    value: "42,915",
    delta: "+5.6%",
    caption: "renewals in March"
  },
  {
    id: "storage",
    title: "Storage Usage",
    value: "812 TB",
    delta: "+2.4%",
    caption: "of 1 PB pool"
  },
  {
    id: "systemAlerts",
    title: "System Alerts",
    value: "18",
    delta: "-12.5%",
    caption: "open incidents"
  }
];

export const userGrowthData = [
  { month: "Jan", users: 8200 },
  { month: "Feb", users: 9200 },
  { month: "Mar", users: 10400 },
  { month: "Apr", users: 11800 },
  { month: "May", users: 12950 },
  { month: "Jun", users: 14200 },
  { month: "Jul", users: 15900 }
];

export const revenueData = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 46800 },
  { month: "Mar", revenue: 51250 },
  { month: "Apr", revenue: 54800 },
  { month: "May", revenue: 59700 },
  { month: "Jun", revenue: 63350 },
  { month: "Jul", revenue: 67500 }
];

export const users = [
  {
    id: "u1",
    name: "Mila Robertson",
    email: "mila.robertson@44snapshot.com",
    joinDate: "2025-06-18",
    status: "Active",
    storageUsed: "2.1 GB",
    lastLogin: "2026-03-10",
    price: "$1,240"
  },
  {
    id: "u2",
    name: "Caleb Foster",
    email: "caleb.foster@44snapshot.com",
    joinDate: "2025-09-03",
    status: "Trial",
    storageUsed: "520 MB",
    lastLogin: "2026-03-09",
    price: "$0"
  },
  {
    id: "u3",
    name: "Avery Brooks",
    email: "avery.brooks@44snapshot.com",
    joinDate: "2024-12-22",
    status: "Active",
    storageUsed: "4.8 GB",
    lastLogin: "2026-03-11",
    price: "$2,980"
  },
  {
    id: "u4",
    name: "Noah Hernandez",
    email: "noah.hernandez@44snapshot.com",
    joinDate: "2025-04-12",
    status: "Suspended",
    storageUsed: "310 MB",
    lastLogin: "2026-02-18",
    price: "$640"
  },
  {
    id: "u5",
    name: "Iris Bennett",
    email: "iris.bennett@44snapshot.com",
    joinDate: "2025-11-04",
    status: "Active",
    storageUsed: "1.3 GB",
    lastLogin: "2026-03-12",
    price: "$1,420"
  },
  {
    id: "u6",
    name: "Julian Carter",
    email: "julian.carter@44snapshot.com",
    joinDate: "2025-10-21",
    status: "Active",
    storageUsed: "3.2 GB",
    lastLogin: "2026-03-08",
    price: "$2,115"
  },
  {
    id: "u7",
    name: "Layla Chen",
    email: "layla.chen@44snapshot.com",
    joinDate: "2025-08-15",
    status: "Active",
    storageUsed: "2.9 GB",
    lastLogin: "2026-03-07",
    price: "$1,760"
  },
  {
    id: "u8",
    name: "Ethan Wallace",
    email: "ethan.wallace@44snapshot.com",
    joinDate: "2024-05-26",
    status: "Trial",
    storageUsed: "740 MB",
    lastLogin: "2026-03-06",
    price: "$0"
  }
];

export const subscriptionRows = [
  {
    id: "s1",
    user: "Mila Robertson",
    plan: "Premium",
    startDate: "2025-07-01",
    nextBilling: "2026-04-01",
    status: "Active"
  },
  {
    id: "s2",
    user: "Avery Brooks",
    plan: "Family",
    startDate: "2024-12-22",
    nextBilling: "2026-03-22",
    status: "Active"
  },
  {
    id: "s3",
    user: "Caleb Foster",
    plan: "Trial",
    startDate: "2026-03-01",
    nextBilling: "2026-03-31",
    status: "Trial"
  },
  {
    id: "s4",
    user: "Noah Hernandez",
    plan: "Premium",
    startDate: "2025-04-12",
    nextBilling: "2026-04-12",
    status: "Paused"
  }
];

export const notifications = [
  {
    id: "n1",
    user: "Caleb Foster",
    alert: "Subscription renewal",
    dueDate: "2026-03-28",
    alertSent: "2026-03-10"
  },
  {
    id: "n2",
    user: "Mila Robertson",
    alert: "Payment retry",
    dueDate: "2026-03-30",
    alertSent: "2026-03-08"
  },
  {
    id: "n3",
    user: "Layla Chen",
    alert: "Plan upgrade request",
    dueDate: "2026-04-04",
    alertSent: "2026-03-07"
  }
];

export const activityLogs = [
  {
    id: "a1",
    user: "Ava Carter",
    action: "Approved subscription upgrade",
    date: "2026-03-11 14:22",
    ip: "172.16.34.22"
  },
  {
    id: "a2",
    user: "System",
    action: "Nightly billing sync completed",
    date: "2026-03-11 09:05",
    ip: "10.10.8.44"
  },
  {
    id: "a3",
    user: "Support Bot",
    action: "Sent renewal reminder notifications",
    date: "2026-03-10 18:31",
    ip: "10.10.8.44"
  },
  {
    id: "a4",
    user: "Ava Carter",
    action: "Reviewed account health report",
    date: "2026-03-10 12:09",
    ip: "172.16.34.22"
  }
];

export const subscriptionSummary = [
  { id: "monthly", title: "Monthly Revenue", value: "$68.4K", delta: "+6.1%" },
  { id: "annual", title: "Annual Revenue", value: "$711K", delta: "+9.4%" },
  { id: "active", title: "Active Subscriptions", value: "42,915", delta: "+5.6%" },
  { id: "trial", title: "Free Trial Users", value: "3,120", delta: "+2.2%" }
];

export const recentActivity = [
  {
    id: "r1",
    title: "Bulk data migration completed",
    detail: "2,430 records moved to the new archive tier.",
    time: "2 hours ago"
  },
  {
    id: "r2",
    title: "New enterprise onboarding",
    detail: "Northwind Insurance added 1,200 users.",
    time: "Yesterday"
  },
  {
    id: "r3",
    title: "Storage lifecycle audit",
    detail: "120 TB moved to cold storage tier.",
    time: "Mar 9, 2026"
  }
];
