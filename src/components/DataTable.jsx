import React from "react";

export default function DataTable({ columns, data, actions, emptyMessage = "No records found." }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-[720px] w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((col) => (
              <th key={col.key || col.label} className="px-4 py-3">
                {col.label}
              </th>
            ))}
            {actions ? <th className="px-4 py-3">Actions</th> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-sm text-slate-500" colSpan={columns.length + (actions ? 1 : 0)}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="transition hover:bg-slate-50">
                {columns.map((col) => (
                  <td key={col.key || col.label} className="px-4 py-3 text-slate-700">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {actions ? <td className="px-4 py-3">{actions(row)}</td> : null}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
