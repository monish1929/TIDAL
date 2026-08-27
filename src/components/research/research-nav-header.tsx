"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sparkles,
  Layers,
  BarChart3,
  FileSpreadsheet,
  LayoutDashboard,
  ArrowLeft,
} from "lucide-react";

interface ResearchNavHeaderProps {
  activeTab?: "overview" | "explorer" | "statistics" | "data";
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  backHref?: string;
  datasetCount?: number;
}

export const ResearchNavHeader: React.FC<ResearchNavHeaderProps> = ({
  activeTab = "overview",
  title = "Research Analytics Workspace",
  subtitle = "Strict raw data exploration & statistical computing — all observations source-attributed with zero automated verdicts.",
  showBackButton = false,
  backHref = "/dashboard/research",
  datasetCount = 1,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const NAV_ITEMS = [
    {
      id: "overview",
      label: "Overview",
      href: "/dashboard/research",
      icon: <LayoutDashboard className="w-3.5 h-3.5" />,
    },
    {
      id: "explorer",
      label: "Data Explorer",
      href: "/dashboard/research/explorer",
      icon: <Layers className="w-3.5 h-3.5" />,
    },
    {
      id: "statistics",
      label: "Statistical Analysis",
      href: "/dashboard/research/statistics",
      icon: <BarChart3 className="w-3.5 h-3.5" />,
    },
    {
      id: "data",
      label: "My Data",
      href: "/dashboard/research/data",
      icon: <FileSpreadsheet className="w-3.5 h-3.5" />,
      badge: datasetCount > 0 ? datasetCount : undefined,
    },
  ];

  return (
    <div className="px-5 py-3 bg-white border-b border-border flex flex-wrap items-center justify-between gap-3 shrink-0 select-none">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <button
            type="button"
            onClick={() => router.push(backHref)}
            className="p-2 rounded-xl bg-gray-50 border border-border hover:bg-gray-100 hover:text-primary transition-colors text-dark-muted shrink-0"
            title="Back to Research Analytics Overview"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-dark-text tracking-tight">
              {title}
            </h1>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              Deep Analytical Mode Active
            </span>
          </div>
          <p className="text-xs text-dark-muted mt-0.5 line-clamp-1">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Global Persistent Tab-Like Switcher */}
      <div className="flex items-center p-1 bg-gray-100/80 border border-border/80 rounded-xl gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            activeTab === item.id ||
            pathname === item.href ||
            (item.id !== "overview" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isActive
                  ? "bg-white text-indigo-950 shadow-subtle border border-border"
                  : "text-dark-muted hover:text-dark-text hover:bg-gray-200/50"
              }`}
            >
              <span className={isActive ? "text-indigo-600" : "text-dark-muted"}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="ml-0.5 px-1.5 py-0.2 bg-indigo-100 text-indigo-800 text-[10px] rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
