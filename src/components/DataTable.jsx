import React from "react";

export function DataTable({ columns, rows, actions }) {
  return (
    <div className="mb-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-3">
                {col}
              </th>
            ))}
            {actions ? <th className="px-4 py-3">Actions</th> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {rows.map((row, idx) => (
            <tr key={row.id || idx} className="hover:bg-slate-50">
              {row.cells.map((cell, cidx) => (
                <td key={cidx} className="px-4 py-3">
                  {cell}
                </td>
              ))}
              {actions ? <td className="px-4 py-3">{actions(row)}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}