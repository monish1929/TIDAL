"use client";

import React from "react";

export const ResearchChartSkeleton: React.FC<{
  title?: string;
}> = ({ title = "Loading analytical models & telemetry..." }) => {
  return (
    <div className="flex flex-col h-full w-full p-4 sm:p-6 space-y-4 animate-pulse bg-background">
      {/* Control Bar Skeleton */}
      <div className="bg-white border border-border rounded-xl p-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100" />
          <div className="space-y-1">
            <div className="h-3.5 w-32 bg-gray-200 rounded" />
            <div className="h-2.5 w-48 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-24 bg-gray-100 rounded-lg" />
          <div className="h-8 w-20 bg-gray-100 rounded-lg" />
        </div>
      </div>

      {/* Main Chart Canvas Skeleton */}
      <div className="flex-1 bg-white border border-border rounded-2xl p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="space-y-1.5">
            <div className="h-4 w-40 bg-gray-200 rounded" />
            <div className="h-3 w-60 bg-gray-100 rounded" />
          </div>
          <div className="h-6 w-24 bg-gray-100 rounded-md" />
        </div>

        {/* Chart Grid Lines Mock */}
        <div className="flex-1 flex items-end gap-3 pt-8 pb-4 px-2">
          <div className="w-full h-3/4 border-b border-l border-gray-200/80 relative flex items-end justify-around pb-2">
            <div className="w-1/12 h-1/3 bg-gray-100 rounded-t" />
            <div className="w-1/12 h-1/2 bg-gray-100 rounded-t" />
            <div className="w-1/12 h-2/3 bg-gray-100 rounded-t" />
            <div className="w-1/12 h-4/5 bg-gray-100 rounded-t" />
            <div className="w-1/12 h-1/2 bg-gray-100 rounded-t" />
            <div className="w-1/12 h-3/5 bg-gray-100 rounded-t" />
            <div className="w-1/12 h-2/5 bg-gray-100 rounded-t" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-dark-muted">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary/40 animate-ping" />
            <span>{title}</span>
          </div>
          <div className="h-3 w-32 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
};
