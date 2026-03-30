import React, { useState } from "react";
import StatsCard from "../components/StatsCard.jsx";
import DataTable from "../components/DataTable.jsx";
import Modal from "../components/Modal.jsx";
import { subscriptionRows as seedRows, subscriptionSummary } from "../data/dummyData.js";
import { CreditCardIcon, CurrencyDollarIcon, DocumentArrowDownIcon, PencilSquareIcon, SparklesIcon, UserGroupIcon } from "@heroicons/react/24/outline";

const summaryIcons = [CurrencyDollarIcon, CreditCardIcon, UserGroupIcon, SparklesIcon];

export default function Subscriptions() {
  const [rows, setRows] = useState(seedRows);
  const [modal, setModal] = useState({ open: false, type: "", row: null });
  const [form, setForm] = useState({ user: "", plan: "", startDate: "", nextBilling: "", status: "Active" });

  const columns = [
    { key: "user", label: "User" },
    { key: "plan", label: "Plan" },
    { key: "startDate", label: "Start Date" },
    { key: "nextBilling", label: "Next Billing" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            row.status === "Active"
              ? "bg-emerald-50 text-emerald-700"
              : row.status === "Trial"
              ? "bg-amber-50 text-amber-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {row.status}
        </span>
      )
    }
  ];

  const openInvoice = (row) => setModal({ open: true, type: "invoice", row });
  const openEdit = (row) => {
    setForm({
      user: row.user,
      plan: row.plan,
      startDate: row.startDate,
      nextBilling: row.nextBilling,
      status: row.status
    });
    setModal({ open: true, type: "edit", row });
  };

  const closeModal = () => setModal({ open: false, type: "", row: null });

  const handleSave = () => {
    if (!modal.row) return;
    setRows((prev) => prev.map((item) => (item.id === modal.row.id ? { ...item, ...form } : item)));
    closeModal();
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <div className="text-2xl font-semibold">Subscription & Billing Overview</div>
        <p className="mt-2 text-sm text-slate-500">Monitor revenue performance, plan mix, and billing cycles.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {subscriptionSummary.map((item, index) => (
          <StatsCard
            key={item.id}
            title={item.title}
            value={item.value}
            delta={item.delta}
            caption="vs last month"
            icon={summaryIcons[index]}
          />
        ))}
      </div>

      <DataTable
        columns={columns}
        data={rows}
        actions={(row) => (
          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100"
              onClick={() => openInvoice(row)}
              type="button"
              title="Invoice"
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              <span className="sr-only">Invoice</span>
            </button>
            <button
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100"
              onClick={() => openEdit(row)}
              type="button"
              title="Edit"
            >
              <PencilSquareIcon className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </button>
          </div>
        )}
      />

      <Modal
        open={modal.open}
        title={modal.type === "invoice" ? "Generate Invoice" : "Edit Subscription"}
        onClose={closeModal}
        actions={
          modal.type === "invoice" ? (
            <>
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={closeModal} type="button">
                Cancel
              </button>
              <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={closeModal} type="button">
                Generate
              </button>
            </>
          ) : (
            <>
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={closeModal} type="button">
                Cancel
              </button>
              <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={handleSave} type="button">
                Save Changes
              </button>
            </>
          )
        }
      >
        {modal.type === "invoice" && modal.row ? (
          <div className="text-sm text-slate-600">
            Generate invoice for <span className="font-semibold text-slate-900">{modal.row.user}</span> on plan
            <span className="font-semibold text-slate-900"> {modal.row.plan}</span>?
          </div>
        ) : null}

        {modal.type === "edit" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-slate-600">
              User
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.user}
                onChange={(event) => setForm((prev) => ({ ...prev, user: event.target.value }))}
              />
            </label>
            <label className="text-sm text-slate-600">
              Plan
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.plan}
                onChange={(event) => setForm((prev) => ({ ...prev, plan: event.target.value }))}
              />
            </label>
            <label className="text-sm text-slate-600">
              Start Date
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.startDate}
                onChange={(event) => setForm((prev) => ({ ...prev, startDate: event.target.value }))}
              />
            </label>
            <label className="text-sm text-slate-600">
              Next Billing
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.nextBilling}
                onChange={(event) => setForm((prev) => ({ ...prev, nextBilling: event.target.value }))}
              />
            </label>
            <label className="text-sm text-slate-600">
              Status
              <select
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.status}
                onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
              >
                <option>Active</option>
                <option>Trial</option>
                <option>Paused</option>
              </select>
            </label>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
