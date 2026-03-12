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
    id: "documents",
    title: "Total Documents Stored",
    value: "2.4M",
    delta: "+3.1%",
    caption: "stored securely"
  },
  {
    id: "storage",
    title: "Storage Usage",
    value: "812 TB",
    delta: "+2.4%",
    caption: "of 1 PB pool"
  },
  {
    id: "expiring",
    title: "Expiring Documents",
    value: "3,248",
    delta: "-4.9%",
    caption: "next 30 days"
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

export const documentCategoryData = [
  { name: "Insurance", value: 38 },
  { name: "Personal IDs", value: 22 },
  { name: "Medical", value: 18 },
  { name: "Travel", value: 12 },
  { name: "Finance", value: 10 }
];

export const users = [
  {
    id: "u1",
    name: "Mila Robertson",
    email: "mila.robertson@44snapshot.com",
    joinDate: "2025-06-18",
    status: "Active",
    storageUsed: "2.1 GB",
    lastLogin: "2026-03-10"
  },
  {
    id: "u2",
    name: "Caleb Foster",
    email: "caleb.foster@44snapshot.com",
    joinDate: "2025-09-03",
    status: "Trial",
    storageUsed: "520 MB",
    lastLogin: "2026-03-09"
  },
  {
    id: "u3",
    name: "Avery Brooks",
    email: "avery.brooks@44snapshot.com",
    joinDate: "2024-12-22",
    status: "Active",
    storageUsed: "4.8 GB",
    lastLogin: "2026-03-11"
  },
  {
    id: "u4",
    name: "Noah Hernandez",
    email: "noah.hernandez@44snapshot.com",
    joinDate: "2025-04-12",
    status: "Suspended",
    storageUsed: "310 MB",
    lastLogin: "2026-02-18"
  },
  {
    id: "u5",
    name: "Iris Bennett",
    email: "iris.bennett@44snapshot.com",
    joinDate: "2025-11-04",
    status: "Active",
    storageUsed: "1.3 GB",
    lastLogin: "2026-03-12"
  },
  {
    id: "u6",
    name: "Julian Carter",
    email: "julian.carter@44snapshot.com",
    joinDate: "2025-10-21",
    status: "Active",
    storageUsed: "3.2 GB",
    lastLogin: "2026-03-08"
  },
  {
    id: "u7",
    name: "Layla Chen",
    email: "layla.chen@44snapshot.com",
    joinDate: "2025-08-15",
    status: "Active",
    storageUsed: "2.9 GB",
    lastLogin: "2026-03-07"
  },
  {
    id: "u8",
    name: "Ethan Wallace",
    email: "ethan.wallace@44snapshot.com",
    joinDate: "2024-05-26",
    status: "Trial",
    storageUsed: "740 MB",
    lastLogin: "2026-03-06"
  }
];

export const documents = [
  {
    id: "d1",
    name: "Auto Policy - AXA",
    category: "Motor Insurance",
    owner: "Mila Robertson",
    uploadDate: "2026-02-22",
    expiryDate: "2026-06-30",
    size: "8.2 MB"
  },
  {
    id: "d2",
    name: "Health Card",
    category: "Health Insurance",
    owner: "Avery Brooks",
    uploadDate: "2026-01-12",
    expiryDate: "2027-01-11",
    size: "1.4 MB"
  },
  {
    id: "d3",
    name: "Passport Scan",
    category: "Personal Documents",
    owner: "Iris Bennett",
    uploadDate: "2025-12-05",
    expiryDate: "2031-12-04",
    size: "3.1 MB"
  },
  {
    id: "d4",
    name: "Travel Insurance",
    category: "Travel",
    owner: "Caleb Foster",
    uploadDate: "2026-03-01",
    expiryDate: "2026-03-28",
    size: "2.7 MB"
  },
  {
    id: "d5",
    name: "Medical Report",
    category: "Medical Records",
    owner: "Layla Chen",
    uploadDate: "2026-02-10",
    expiryDate: "2026-08-10",
    size: "6.5 MB"
  },
  {
    id: "d6",
    name: "Property Policy",
    category: "Insurance",
    owner: "Julian Carter",
    uploadDate: "2026-01-28",
    expiryDate: "2026-12-31",
    size: "4.9 MB"
  }
];

export const folders = [
  {
    id: "f1",
    name: "Motor Insurance",
    documents: 420,
    storage: "92 GB",
    color: "from-indigo-500/15 to-indigo-50"
  },
  {
    id: "f2",
    name: "Health Insurance",
    documents: 318,
    storage: "61 GB",
    color: "from-emerald-500/15 to-emerald-50"
  },
  {
    id: "f3",
    name: "Travel",
    documents: 210,
    storage: "33 GB",
    color: "from-amber-500/15 to-amber-50"
  },
  {
    id: "f4",
    name: "Personal Documents",
    documents: 512,
    storage: "120 GB",
    color: "from-rose-500/15 to-rose-50"
  },
  {
    id: "f5",
    name: "Medical Records",
    documents: 287,
    storage: "74 GB",
    color: "from-sky-500/15 to-sky-50"
  }
];

export const qrShares = [
  {
    id: "q1",
    document: "Auto Policy - AXA",
    owner: "Mila Robertson",
    generated: "2026-03-09 14:10",
    scans: 12,
    lastScanned: "2026-03-11 09:30"
  },
  {
    id: "q2",
    document: "Passport Scan",
    owner: "Iris Bennett",
    generated: "2026-03-08 10:42",
    scans: 4,
    lastScanned: "2026-03-10 18:02"
  },
  {
    id: "q3",
    document: "Medical Report",
    owner: "Layla Chen",
    generated: "2026-03-05 16:18",
    scans: 7,
    lastScanned: "2026-03-11 13:22"
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
    document: "Travel Insurance",
    expiryDate: "2026-03-28",
    alertSent: "2026-03-10"
  },
  {
    id: "n2",
    user: "Mila Robertson",
    document: "Auto Policy - AXA",
    expiryDate: "2026-06-30",
    alertSent: "2026-03-08"
  },
  {
    id: "n3",
    user: "Layla Chen",
    document: "Medical Report",
    expiryDate: "2026-08-10",
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
    action: "Document OCR batch completed",
    date: "2026-03-11 09:05",
    ip: "10.10.8.44"
  },
  {
    id: "a3",
    user: "Support Bot",
    action: "Sent expiry reminder notifications",
    date: "2026-03-10 18:31",
    ip: "10.10.8.44"
  },
  {
    id: "a4",
    user: "Ava Carter",
    action: "Reviewed user storage report",
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
    title: "Bulk document conversion completed",
    detail: "2,430 PDFs converted for enterprise accounts.",
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
