"use client";

import React from "react";
import {
  Compass,
  MessageSquare,
  Anchor,
  Waves,
  AlertTriangle,
  Microscope,
  Navigation,
  ShieldAlert,
  Shield,
  Siren,
  Settings,
} from "lucide-react";
import { TopicScope } from "@/types/decision";
import { UserRole } from "@/types/user";

interface NavItem {
  id: TopicScope;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  primaryRole?: UserRole;
  badge?: string;
}

export const SIDEBAR_NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    label: "Home Overview",
    shortLabel: "Home",
    icon: Compass,
  },
  {
    id: "chat",
    label: "Ask TIDAL",
    shortLabel: "Ask TIDAL",
    icon: MessageSquare,
  },
  {
    id: "fishing",
    label: "Fishing Intelligence",
    shortLabel: "Fishing",
    icon: Anchor,
    primaryRole: "FISHERMAN",
  },
  {
    id: "weather",
    label: "Weather & Conditions",
    shortLabel: "Weather",
    icon: Waves,
  },
  {
    id: "alerts",
    label: "Alerts & Warnings",
    shortLabel: "Alerts",
    icon: AlertTriangle,
    badge: "Live",
  },
  {
    id: "research",
    label: "Research Analytics",
    shortLabel: "Research",
    icon: Microscope,
    primaryRole: "RESEARCHER",
  },
  {
    id: "routes",
    label: "Route Planning",
    shortLabel: "Routes",
    icon: Navigation,
    primaryRole: "MARITIME_OPERATOR",
  },
  {
    id: "zones",
    label: "Zone & Boundary Watch",
    shortLabel: "Zones",
    icon: ShieldAlert,
    primaryRole: "COASTAL_AUTHORITY",
  },
  {
    id: "coastal-authority",
    label: "Coastal Authority",
    shortLabel: "Coastal",
    icon: Shield,
    primaryRole: "COASTAL_AUTHORITY",
  },
  {
    id: "disaster-management",
    label: "Disaster Management",
    shortLabel: "Disaster",
    icon: Siren,
    primaryRole: "DISASTER_MANAGEMENT",
  },
  {
    id: "settings",
    label: "Profile & Settings",
    shortLabel: "Settings",
    icon: Settings,
  },
];

interface SidebarProps {
  currentScope: TopicScope;
  onSelectScope: (scope: TopicScope) => void;
  userRole?: UserRole;
}

export const DashboardSidebar: React.FC<SidebarProps> = ({
  currentScope,
  onSelectScope,
  userRole,
}) => {
  return (
    <>
      {/* DESKTOP SIDEBAR (Fixed Left, 240px width) */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-surface border-r border-border h-full justify-between select-none">
        <div className="p-3.5 space-y-4">
          {/* Section Header */}
          <div className="px-3 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">
              Marine Focus Areas
            </span>
          </div>

          {/* Navigation Items List */}
          <nav className="space-y-1">
            {SIDEBAR_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentScope === item.id;
              const isRecommended = item.primaryRole === userRole;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectScope(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all text-left group ${
                    isActive
                      ? "bg-blue-50/80 text-blue-950 font-semibold border border-blue-200 shadow-subtle"
                      : "text-dark-muted hover:text-dark-text hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? "text-primary"
                          : "text-dark-muted group-hover:text-dark-text"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
                      {item.badge}
                    </span>
                  )}

                  {!item.badge && isRecommended && !isActive && (
                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-blue-50 text-primary border border-blue-100">
                      Role
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Agent Core Status Pill */}
        <div className="p-3 border-t border-border bg-gray-50/60 shrink-0">
          <div className="flex items-center justify-between px-2.5 py-1.5 bg-white border border-border rounded-lg shadow-subtle text-[11px]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-dark-text">TIDAL Core</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Online
            </span>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION (Fixed at bottom on small screens) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border flex items-center justify-around px-2 py-1.5 shadow-card">
        {SIDEBAR_NAV_ITEMS.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = currentScope === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectScope(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] transition-colors ${
                isActive ? "text-primary font-semibold" : "text-dark-muted hover:text-dark-text"
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span className="truncate max-w-[56px]">{item.shortLabel}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
