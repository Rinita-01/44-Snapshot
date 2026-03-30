export const stats = {
  totalUsers: "128,540",
  activeSubscriptions: "94,230",
  expiringDocs: "1,284",
  totalDocs: "842,990",
  storageUsage: "62.4 TB"
};

export const charts = {
  monthlyUsers: [120, 160, 190, 240, 210, 260, 320, 410, 390, 460, 520, 610],
  revenue: [32, 45, 42, 55, 58, 62, 70, 68, 72, 78, 85, 96],
  uploads: [420, 380, 450, 520, 610, 590, 640, 700, 680, 720, 810, 880]
};

export const users = [
  {
    id: "USR-1001",
    name: "Maria Gomez",
    email: "maria.gomez@mail.com",
    subscription: "Pro",
    storage: "4.2 GB",
    registered: "2025-11-18",
    status: "Active"
  },
  {
    id: "USR-1002",
    name: "Ethan Brooks",
    email: "ethan.brooks@mail.com",
    subscription: "Trial",
    storage: "1.1 GB",
    registered: "2025-12-02",
    status: "Active"
  },
  {
    id: "USR-1003",
    name: "Alina Roy",
    email: "alina.roy@mail.com",
    subscription: "Basic",
    storage: "9.8 GB",
    registered: "2025-10-28",
    status: "Suspended"
  },
  {
    id: "USR-1004",
    name: "James Oliver",
    email: "j.oliver@mail.com",
    subscription: "Pro",
    storage: "12.5 GB",
    registered: "2025-09-13",
    status: "Active"
  }
];

export const documents = [
  {
    id: "DOC-2001",
    user: "Maria Gomez",
    type: "Motor Insurance",
    uploadDate: "2026-02-14",
    expiryDate: "2026-09-12",
    status: "Valid"
  },
  {
    id: "DOC-2002",
    user: "Ethan Brooks",
    type: "Health Insurance",
    uploadDate: "2026-02-22",
    expiryDate: "2026-04-01",
    status: "Expiring"
  },
  {
    id: "DOC-2003",
    user: "Alina Roy",
    type: "Certificates",
    uploadDate: "2025-12-12",
    expiryDate: "2027-12-12",
    status: "Valid"
  },
  {
    id: "DOC-2004",
    user: "James Oliver",
    type: "Personal Documents",
    uploadDate: "2026-01-05",
    expiryDate: "2026-03-25",
    status: "Expiring"
  }
];

export const subscriptions = [
  {
    id: "SUB-3001",
    user: "Maria Gomez",
    plan: "Pro Annual",
    startDate: "2025-11-18",
    nextBilling: "2026-11-18",
    status: "Paid"
  },
  {
    id: "SUB-3002",
    user: "Ethan Brooks",
    plan: "Trial",
    startDate: "2025-12-02",
    nextBilling: "2026-03-12",
    status: "Trial"
  },
  {
    id: "SUB-3003",
    user: "Alina Roy",
    plan: "Basic",
    startDate: "2025-10-28",
    nextBilling: "2026-04-28",
    status: "Past Due"
  }
];

export const storage = [
  {
    id: "STO-4001",
    user: "Maria Gomez",
    used: "4.2 GB",
    limit: "10 GB",
    status: "Healthy"
  },
  {
    id: "STO-4002",
    user: "Ethan Brooks",
    used: "1.1 GB",
    limit: "5 GB",
    status: "Healthy"
  },
  {
    id: "STO-4003",
    user: "Alina Roy",
    used: "9.8 GB",
    limit: "10 GB",
    status: "Near Limit"
  },
  {
    id: "STO-4004",
    user: "James Oliver",
    used: "12.5 GB",
    limit: "10 GB",
    status: "Over Limit"
  }
];

export const reminders = [
  {
    id: "REM-6001",
    type: "Insurance renewal",
    user: "James Oliver",
    due: "2026-03-20",
    status: "Pending"
  },
  {
    id: "REM-6002",
    type: "Vehicle MOT",
    user: "Maria Gomez",
    due: "2026-04-02",
    status: "Scheduled"
  },
  {
    id: "REM-6003",
    type: "Document expiry",
    user: "Ethan Brooks",
    due: "2026-04-01",
    status: "Urgent"
  }
];

export const systemLogs = [
  {
    id: "LOG-7001",
    activity: "User login",
    user: "Maria Gomez",
    date: "2026-03-10",
    status: "Success"
  },
  {
    id: "LOG-7002",
    activity: "Document upload",
    user: "Ethan Brooks",
    date: "2026-03-10",
    status: "Success"
  },
  {
    id: "LOG-7003",
    activity: "Payment transaction",
    user: "Alina Roy",
    date: "2026-03-09",
    status: "Failed"
  }
];

export const admins = [
  {
    id: "ADM-001",
    name: "Aisha Khan",
    email: "super@walletadmin.com",
    role: "Super Admin",
    status: "Active",
    lastActive: "2026-03-10"
  },
  {
    id: "ADM-002",
    name: "Lucas Brandt",
    email: "admin@walletadmin.com",
    role: "Admin",
    status: "Active",
    lastActive: "2026-03-09"
  },
  {
    id: "ADM-003",
    name: "Sonia Patel",
    email: "support@walletadmin.com",
    role: "Support Manager",
    status: "Inactive",
    lastActive: "2026-03-01"
  }
];

export const adminLogs = [
  { id: "ALOG-01", admin: "Aisha Khan", action: "Created admin Lucas Brandt", date: "2026-03-08" },
  { id: "ALOG-02", admin: "Lucas Brandt", action: "Suspended user USR-1003", date: "2026-03-09" },
  { id: "ALOG-03", admin: "Aisha Khan", action: "Updated storage limits", date: "2026-03-10" }
];

export const categoryColors = {
  "Motor Insurance": "#2F80ED",
  "Health Insurance": "#27AE60",
  "Personal Documents": "#9B51E0",
  Certificates: "#F2994A"
};
