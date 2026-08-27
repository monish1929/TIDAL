"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Waves,
  Sparkles,
  LogOut,
  Sliders,
  Anchor,
  Microscope,
  ShieldCheck,
  AlertTriangle,
  Navigation,
  Globe,
  ChevronDown,
  PlusCircle,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/language-selector";
import { UserProfile, UserRole } from "@/types/user";
import { getAllRegisteredAccounts } from "@/lib/storage";

interface HeaderProps {
  userProfile: UserProfile;
  researchMode: boolean;
  onToggleResearchMode: (enabled: boolean) => void;
  onSignOut: () => void;
  onReconfigureRole: () => void;
  onSwitchAccount: (targetProfile: UserProfile) => void;
}

export const DashboardHeader: React.FC<HeaderProps> = ({
  userProfile,
  researchMode,
  onToggleResearchMode,
  onSignOut,
  onReconfigureRole,
  onSwitchAccount,
}) => {
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [registeredAccounts, setRegisteredAccounts] = useState<UserProfile[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const accountsMap = getAllRegisteredAccounts();
    const accountsList = Object.values(accountsMap);
    setRegisteredAccounts(accountsList);
  }, [userProfile]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSwitcherOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "FISHERMAN":
        return Anchor;
      case "RESEARCHER":
        return Microscope;
      case "COASTAL_AUTHORITY":
        return ShieldCheck;
      case "DISASTER_MANAGEMENT":
        return AlertTriangle;
      case "MARITIME_OPERATOR":
        return Navigation;
      case "GENERAL":
      default:
        return Globe;
    }
  };

  const IconComponent = getRoleIcon(userProfile.role);

  return (
    <header className="w-full bg-surface border-b border-border h-14 px-4 flex items-center justify-between shrink-0 select-none z-30 relative">
      {/* Left: Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm">
            <Waves className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-dark-text tracking-tight text-base">TIDAL</span>
            <span className="hidden md:inline text-[11px] text-dark-muted font-medium">
              Marine Decision Copilot
            </span>
          </div>
        </div>

        {/* Stakeholder Role Badge with Quick Switcher Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
            className="flex items-center gap-1.5 px-3 py-1 bg-blue-50/80 hover:bg-blue-100/70 border border-blue-200 text-blue-950 rounded-full text-xs font-semibold transition-colors group cursor-pointer"
            title="Click to switch account / stakeholder role"
          >
            <IconComponent className="w-3.5 h-3.5 text-primary" />
            <span className="capitalize">
              {userProfile.role.toLowerCase().replace(/_/g, " ")}
            </span>
            {userProfile.name && (
              <span className="text-[11px] font-normal text-blue-800/80 hidden sm:inline">
                • {userProfile.name}
              </span>
            )}
            <ChevronDown
              className={`w-3 h-3 text-blue-700 transition-transform duration-200 ${
                isSwitcherOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* User & Role Switcher Modal Dropdown */}
          {isSwitcherOpen && (
            <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-border rounded-xl shadow-dropdown py-2 z-50 animate-in fade-in-50 zoom-in-95 text-xs text-dark-text">
              <div className="px-3 py-2 border-b border-border/70 bg-gray-50/50">
                <span className="text-[10px] uppercase font-bold text-dark-muted block">
                  Active Account
                </span>
                <div className="font-semibold text-dark-text text-sm truncate mt-0.5">
                  {userProfile.name || "Marine User"}
                </div>
                <div className="text-[11px] text-dark-muted truncate">
                  {userProfile.identifier}
                </div>
              </div>

              {/* Registered Profiles List — Clicking switches instantly */}
              <div className="py-1 max-h-52 overflow-y-auto">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-dark-muted">
                  Registered Accounts ({registeredAccounts.length})
                </div>

                {registeredAccounts.map((acc) => {
                  const RoleIcon = getRoleIcon(acc.role);
                  const isCurrent = acc.identifier === userProfile.identifier;
                  return (
                    <button
                      key={acc.identifier}
                      type="button"
                      onClick={() => {
                        if (!isCurrent) {
                          onSwitchAccount(acc);
                        }
                        setIsSwitcherOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors ${
                        isCurrent
                          ? "bg-blue-50/80 font-semibold text-blue-950"
                          : "hover:bg-blue-50/60"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                            isCurrent
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-dark-muted"
                          }`}
                        >
                          <RoleIcon className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <div className="truncate font-medium text-xs">
                            {acc.name || acc.identifier}
                          </div>
                          <div className="text-[10px] text-dark-muted capitalize">
                            {acc.role.toLowerCase().replace(/_/g, " ")}
                          </div>
                        </div>
                      </div>
                      {isCurrent && (
                        <span className="text-[9px] font-bold text-primary bg-blue-100 px-1.5 py-0.5 rounded shrink-0 ml-2">
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Secondary Actions */}
              <div className="border-t border-border/80 pt-1 mt-1 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsSwitcherOpen(false);
                    onReconfigureRole();
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-dark-text text-xs transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5 text-dark-muted" />
                  <span>Edit Role & Preferences</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSwitcherOpen(false);
                    onSignOut();
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-dark-muted text-xs transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Sign Out & Add New Account</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center/Right Action Bar */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Research Mode Toggle */}
        <div className="flex items-center gap-2 px-2.5 py-1 bg-gray-50 border border-border rounded-lg">
          <div className="flex items-center gap-1.5">
            <Sparkles
              className={`w-3.5 h-3.5 ${
                researchMode ? "text-indigo-600 animate-pulse" : "text-dark-muted"
              }`}
            />
            <span
              className={`text-xs font-medium ${
                researchMode ? "text-indigo-950 font-semibold" : "text-dark-text"
              }`}
            >
              Research Mode
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={researchMode}
            onClick={() => onToggleResearchMode(!researchMode)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              researchMode ? "bg-indigo-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                researchMode ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Language Selector */}
        <LanguageSelector currentLanguage={userProfile.languagePreference} />

        {/* User Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSignOut}
            className="h-8 px-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
