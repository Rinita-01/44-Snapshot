import React, { useState } from "react";
import { BellIcon, ChevronDownIcon, MagnifyingGlassIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { useAuth } from "./AuthProvider.jsx";
import Modal from "./Modal.jsx";
import { useNavigate } from "react-router-dom";

export default function Navbar({ onMenuClick }) {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState({ open: false, type: "" });
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AC";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/70 px-6 py-4 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 lg:hidden"
            onClick={onMenuClick}
            type="button"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
          <div>
            <div className="text-lg font-semibold">Admin Dashboard</div>
            <div className="text-xs text-slate-500">Secure wallet operations & compliance</div>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 shadow-sm md:flex">
            <MagnifyingGlassIcon className="h-4 w-4" />
            <input
              className="w-56 bg-transparent text-sm text-slate-700 focus:outline-none"
              placeholder="Search users, docs, invoices"
            />
          </div>
          <button
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm"
            onClick={() => setModal({ open: true, type: "notifications" })}
            type="button"
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
          </button>
          <div className="relative">
            <button
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm"
              onClick={() => setOpen((prev) => !prev)}
              type="button"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                {initials}
              </span>
              {user?.name || "Ava Carter"}
              <ChevronDownIcon className="h-4 w-4" />
            </button>
            {open ? (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-2 text-sm shadow-lg">
                <button
                  className="w-full rounded-lg px-3 py-2 text-left text-slate-600 hover:bg-slate-100"
                  onClick={() => {
                    setOpen(false);
                    navigate("/profile");
                  }}
                  type="button"
                >
                  Profile
                </button>
                <button
                  className="w-full rounded-lg px-3 py-2 text-left text-slate-600 hover:bg-slate-100"
                  onClick={() => {
                    setOpen(false);
                    setModal({ open: true, type: "preferences" });
                  }}
                  type="button"
                >
                  Preferences
                </button>
                <button
                  className="w-full rounded-lg px-3 py-2 text-left text-rose-600 hover:bg-rose-50"
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  type="button"
                >
                  Sign out
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <Modal
        open={modal.open}
        title={modal.type === "notifications" ? "Notifications" : "Preferences"}
        onClose={() => setModal({ open: false, type: "" })}
        actions={
          <button
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            onClick={() => setModal({ open: false, type: "" })}
            type="button"
          >
            Close
          </button>
        }
      >
        {modal.type === "notifications" ? (
          <div className="space-y-3 text-sm text-slate-600">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              12 documents expiring in the next 7 days.
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              3 subscription renewals failed this morning.
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              New admin access request pending approval.
            </div>
          </div>
        ) : null}

        {modal.type === "preferences" ? (
          <div className="space-y-4 text-sm text-slate-600">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <div className="font-semibold text-slate-900">Email summaries</div>
                <div className="text-xs text-slate-500">Weekly digest of platform activity</div>
              </div>
              <button className="h-7 w-12 rounded-full bg-slate-900 p-1" type="button">
                <span className="block h-5 w-5 translate-x-5 rounded-full bg-white" />
              </button>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <div className="font-semibold text-slate-900">Live alerts</div>
                <div className="text-xs text-slate-500">Push notifications for critical events</div>
              </div>
              <button className="h-7 w-12 rounded-full bg-slate-300 p-1" type="button">
                <span className="block h-5 w-5 rounded-full bg-white" />
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </header>
  );
}
