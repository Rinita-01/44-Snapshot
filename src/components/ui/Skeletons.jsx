import React from "react";

// Simple circle loader component (fallback/spinner)
export function CircleLoader({ size = "medium", className = "" }) {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
    xlarge: "h-16 w-16"
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-slate-300 border-t-slate-900 ${sizeClasses[size] || sizeClasses.medium} ${className}`} />
  );
}

// Full page skeleton loader (e.g. Dashboard)
export function PageLoader() {
  return (
    <div className="w-full space-y-8 animate-pulse">
      {/* Header */}
      <div className="space-y-3">
        <div className="h-8 w-48 rounded-xl bg-slate-200" />
        <div className="h-4 w-96 rounded-xl bg-slate-200" />
      </div>
      
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="h-28 rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 rounded bg-slate-200" />
              <div className="h-8 w-8 rounded-xl bg-slate-200" />
            </div>
            <div className="h-6 w-12 rounded bg-slate-200" />
          </div>
        ))}
      </div>

      {/* Main Charts Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="h-56 w-full rounded-xl bg-slate-50" />
        </div>
        <div className="h-80 rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="h-56 w-full rounded-xl bg-slate-50" />
        </div>
      </div>
    </div>
  );
}

// Skeleton Card loader (e.g., FolderCard)
export function SkeletonCard() {
  return (
    <div className="w-full animate-pulse border border-slate-200 bg-white rounded-2xl p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-200" />
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-3 w-16 rounded bg-slate-200" />
          </div>
        </div>
        <div className="h-5 w-5 rounded bg-slate-200" />
      </div>
      <div className="h-3 w-full rounded bg-slate-100" />
    </div>
  );
}

// Skeleton Chart loader
export function SkeletonChart() {
  return (
    <div className="w-full animate-pulse border border-slate-200 bg-white rounded-2xl p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="h-3 w-48 rounded bg-slate-200" />
        </div>
        <div className="h-8 w-24 rounded-lg bg-slate-200" />
      </div>
      <div className="h-56 w-full rounded-xl bg-slate-50" />
    </div>
  );
}

// Skeleton Table loader (e.g., DataTable list)
export function SkeletonTable() {
  return (
    <div className="w-full animate-pulse border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm">
      {/* Table Header */}
      <div className="flex items-center gap-4 bg-slate-50 px-6 py-4 border-b border-slate-200">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="h-4 flex-1 rounded bg-slate-200" />
        ))}
        <div className="h-4 w-20 rounded bg-slate-200" />
      </div>
      
      {/* Table Rows */}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: 5 }).map((_, rowIdx) => (
          <div key={rowIdx} className="flex items-center gap-4 px-6 py-5">
            {Array.from({ length: 5 }).map((_, colIdx) => (
              <div key={colIdx} className="h-4 flex-1 rounded bg-slate-100" />
            ))}
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-lg bg-slate-100" />
              <div className="h-8 w-8 rounded-lg bg-slate-100" />
              <div className="h-8 w-8 rounded-lg bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Detail View Skeleton
export function DetailPageSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
        <div className="h-16 w-16 rounded-2xl bg-slate-200" />
        <div className="space-y-2 flex-1">
          <div className="h-5 w-48 rounded bg-slate-200" />
          <div className="h-4 w-32 rounded bg-slate-200" />
        </div>
        <div className="h-6 w-20 rounded-full bg-slate-200" />
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="space-y-2">
            <div className="h-3.5 w-24 rounded bg-slate-200" />
            <div className="h-10 w-full rounded-xl bg-slate-50 border border-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
