import React from "react";

// Simple circle loader component
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

export function PageLoader() {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <CircleLoader size="large" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="flex h-28 items-center justify-center rounded-2xl border border-slate-200 bg-white">
      <CircleLoader size="small" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="flex h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white">
      <CircleLoader size="medium" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="flex h-80 items-center justify-center rounded-2xl border border-slate-200 bg-white">
      <CircleLoader size="medium" />
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <CircleLoader size="large" />
    </div>
  );
}
