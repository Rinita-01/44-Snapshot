import React from "react";

export function PageLoader({ title = "Loading", message = "Please wait while we prepare the page..." }) {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900/5">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
        </div>
        <div className="mt-6 text-center">
          <div className="text-lg font-semibold text-slate-900">{title}</div>
          <div className="mt-2 text-sm text-slate-500">{message}</div>
        </div>
        <div className="mt-6 grid gap-3">
          <div className="h-3 animate-pulse rounded-full bg-slate-100" />
          <div className="h-3 w-11/12 animate-pulse rounded-full bg-slate-100" />
          <div className="h-3 w-8/12 animate-pulse rounded-full bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="flex h-28 items-center justify-center rounded-2xl border border-slate-200 bg-white">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="flex h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="flex h-80 items-center justify-center rounded-2xl border border-slate-200 bg-white">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-3 border-slate-300 border-t-slate-900" />
        <div className="text-sm text-slate-500">Loading...</div>
      </div>
    </div>
  );
}
