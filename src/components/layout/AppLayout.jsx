import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-col lg:pl-72">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 px-6 py-7 pb-14 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
