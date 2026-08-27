"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Siren,
  LayoutDashboard,
  Radar,
  MapPinned,
  Languages,
  ArrowLeft,
} from "lucide-react";

interface DisasterNavHeaderProps {
  activeTab?: "overview" | "tracker" | "exposure" | "alerts";
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  backHref?: string;
}

export const DisasterNavHeader: React.FC<DisasterNavHeaderProps> = ({
  activeTab = "overview",
  title = "Disaster Management Workspace",
  subtitle = "Active hazard tracking, exposure assessment, and multilingual alert preparation for disaster response officers.",
  showBackButton = false,
  backHref = "/dashboard/disaster-management",
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const NAV_ITEMS = [
    {
      id: "overview",
      label: "Overview",
      href: "/dashboard/disaster-management",
      icon: <LayoutDashboard className="w-3.5 h-3.5" />,
    },
    {
      id: "tracker",
      label: "Hazard Tracker",
      href: "/dashboard/disaster-management/tracker",
      icon: <Radar className="w-3.5 h-3.5" />,
    },
    {
      id: "exposure",
      label: "Exposure Assessment",
      href: "/dashboard/disaster-management/exposure",
      icon: <MapPinned className="w-3.5 h-3.5" />,
    },
    {
      id: "alerts",
      label: "Alert Studio",
      href: "/dashboard/disaster-management/alerts",
      icon: <Languages className="w-3.5 h-3.5" />,
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
            title="Back to Disaster Management Overview"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0">
          <Siren className="w-5 h-5" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-dark-text tracking-tight">
              {title}
            </h1>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              Emergency Operations
            </span>
          </div>
          <p className="text-xs text-dark-muted mt-0.5 line-clamp-1">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Tab-Like Switcher */}
      <div className="flex items-center p-1 bg-gray-100/80 border border-border/80 rounded-xl gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            activeTab === item.id ||
            pathname === item.href ||
            (item.id !== "overview" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isActive
                  ? "bg-white text-rose-950 shadow-subtle border border-border"
                  : "text-dark-muted hover:text-dark-text hover:bg-gray-200/50"
              }`}
            >
              <span className={isActive ? "text-rose-600" : "text-dark-muted"}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
