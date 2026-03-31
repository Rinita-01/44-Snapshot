import React from "react";

export function SkeletonCard() {
  return <div className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white" />;
}

export function SkeletonChart() {
  return <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white" />;
}

export function SkeletonTable() {
  return <div className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white" />;
}
