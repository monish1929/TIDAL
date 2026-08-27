"use client";

import React, { useState, useEffect } from "react";
import {
  Navigation,
  Compass,
  Waves,
  Wind,
  Thermometer,
  Activity,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  Clock,
  MapPin,
  Anchor,
  Bot,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DecisionCard } from "./decision-card";
import { DecisionResponse, ActiveTrip } from "@/types/decision";
import { UserProfile } from "@/types/user";
import {
  ROLE_HOME_BRIEFINGS,
  FLAGSHIP_TRIP_SAFETY_MOCK,
} from "@/mocks/decisionMocks";
import { getUserActiveTrip } from "@/lib/storage";

interface HomeWorkspaceProps {
  userProfile: UserProfile;
  onNavigateToChat: () => void;
}

export const HomeWorkspace: React.FC<HomeWorkspaceProps> = ({
  userProfile,
  onNavigateToChat,
}) => {
  const [activeTrip, setActiveTrip] = useState<ActiveTrip | null>(null);
  const [operationalDecision, setOperationalDecision] = useState<DecisionResponse>(
    ROLE_HOME_BRIEFINGS[userProfile.role] || FLAGSHIP_TRIP_SAFETY_MOCK
  );

  useEffect(() => {
    if (userProfile.role === "FISHERMAN") {
      const trip = getUserActiveTrip(
        userProfile.identifier,
        userProfile.role,
        userProfile.roleDetails
      );
      setActiveTrip(trip);
    } else {
      setActiveTrip(null);
    }

    const briefing =
      ROLE_HOME_BRIEFINGS[userProfile.role] || FLAGSHIP_TRIP_SAFETY_MOCK;
    setOperationalDecision(briefing);
  }, [userProfile.identifier, userProfile.role, userProfile.roleDetails]);

  return (
    <main className="flex-1 flex flex-col h-full bg-background overflow-y-auto select-none">
      {/* ── TOP OPERATIONAL STATUS STRIP ── */}
      <div className="px-6 py-3 bg-white border-b border-border flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-dark-muted">
              Operational Status:
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Safe Operating Envelope
            </span>
          </div>

          <span className="text-dark-light hidden sm:inline">•</span>

          <div className="text-xs text-dark-muted hidden md:flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>Region: <strong>Gulf of Mannar & Palk Bay</strong></span>
          </div>
        </div>

        {/* Quick Link to Ask TIDAL */}
        <Button
          variant="outline"
          size="sm"
          onClick={onNavigateToChat}
          className="text-xs h-8 gap-1.5 hover:bg-blue-50 hover:border-primary hover:text-primary transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5 text-primary" />
          <span>Ask TIDAL Copilot</span>
          <ArrowRight className="w-3.5 h-3.5 text-dark-muted" />
        </Button>
      </div>

      {/* ── MAIN DASHBOARD CONTENT AREA (FULL WIDTH & BREATHABLE) ── */}
      <div className="p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* ── SECTION 1: ACTIVE VOYAGE TRACKING (For Fisherman / Active Trips) ── */}
        {userProfile.role === "FISHERMAN" && activeTrip && (
          <div className="bg-surface border border-border rounded-xl shadow-card p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-primary shrink-0">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-dark-muted">
                      Active Voyage Tracking
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      En Route
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-dark-text mt-0.5">
                    {activeTrip.vesselName} • {activeTrip.vesselType}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Safe Operating Envelope Active
                </span>
              </div>
            </div>

            {/* Voyage Details 4-Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-gray-50 border border-border rounded-lg space-y-1">
                <span className="text-dark-muted text-[10px] block font-semibold uppercase tracking-wider">
                  Departure Port
                </span>
                <span className="font-bold text-dark-text text-sm block truncate">
                  {activeTrip.departurePort}
                </span>
                <span className="text-[11px] text-dark-muted block">
                  Departed: {activeTrip.departureTime}
                </span>
              </div>

              <div className="p-3 bg-gray-50 border border-border rounded-lg space-y-1">
                <span className="text-dark-muted text-[10px] block font-semibold uppercase tracking-wider">
                  Target Destination
                </span>
                <span className="font-bold text-dark-text text-sm block truncate">
                  {activeTrip.destinationZone}
                </span>
                <span className="text-[11px] text-dark-muted block">
                  Distance: {activeTrip.distanceNM} NM
                </span>
              </div>

              <div className="p-3 bg-gray-50 border border-border rounded-lg space-y-1">
                <span className="text-dark-muted text-[10px] block font-semibold uppercase tracking-wider">
                  Safe Return Window
                </span>
                <span className="font-bold text-emerald-800 text-sm block">
                  Before {activeTrip.estimatedReturnTime}
                </span>
                <span className="text-[11px] text-dark-muted block truncate">
                  {activeTrip.seaStateStatus}
                </span>
              </div>

              <div className="p-3 bg-gray-50 border border-border rounded-lg space-y-1">
                <span className="text-dark-muted text-[10px] block font-semibold uppercase tracking-wider">
                  Telemetry Link
                </span>
                <span className="font-semibold text-primary text-xs block truncate mt-0.5">
                  INCOIS Ocean State Forecast
                </span>
                <span className="text-[10px] text-emerald-700 block font-medium">
                  Live Satellite & Buoy Sync
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION 2: LIVE MARINE TELEMETRY SNAPSHOT ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="bg-white border border-border rounded-xl shadow-subtle p-4 space-y-1.5">
            <div className="flex items-center justify-between text-dark-muted">
              <span className="text-[11px] font-bold uppercase tracking-wider">Wave Height</span>
              <Waves className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-dark-text">1.2</span>
              <span className="text-xs text-dark-muted">meters</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <span>● Safe (Max 1.3m morning)</span>
            </div>
          </div>

          <div className="bg-white border border-border rounded-xl shadow-subtle p-4 space-y-1.5">
            <div className="flex items-center justify-between text-dark-muted">
              <span className="text-[11px] font-bold uppercase tracking-wider">Surface Wind</span>
              <Wind className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-dark-text">12</span>
              <span className="text-xs text-dark-muted">kts (WNW)</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <span>● Favorable breeze</span>
            </div>
          </div>

          <div className="bg-white border border-border rounded-xl shadow-subtle p-4 space-y-1.5">
            <div className="flex items-center justify-between text-dark-muted">
              <span className="text-[11px] font-bold uppercase tracking-wider">Swell Dynamics</span>
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-dark-text">8.4</span>
              <span className="text-xs text-dark-muted">sec period</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <span>● Smooth transit</span>
            </div>
          </div>

          <div className="bg-white border border-border rounded-xl shadow-subtle p-4 space-y-1.5">
            <div className="flex items-center justify-between text-dark-muted">
              <span className="text-[11px] font-bold uppercase tracking-wider">Sea Surface Temp</span>
              <Thermometer className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-dark-text">28.4</span>
              <span className="text-xs text-dark-muted">°C</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <span>● Nominal thermocline</span>
            </div>
          </div>
        </div>

        {/* ── SECTION 3: PRIMARY OPERATIONAL DECISION INTELLIGENCE ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-sm font-bold text-dark-text uppercase tracking-wider">
                TIDAL Operational Decision Intelligence
              </h2>
            </div>
            <span className="text-[11px] text-dark-muted">
              Auto-synthesized from INCOIS, IMD, & ISRO models
            </span>
          </div>

          {/* Full-width Structured Decision Card */}
          <DecisionCard decision={operationalDecision} />
        </div>

        {/* ── SECTION 4: CONVERSATIONAL INTELLIGENCE INVITATION ── */}
        <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-blue-50/80 border border-blue-200/80 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-dark-text">
                Need to explore specific routes, weather shifts, or safety queries?
              </h3>
            </div>
            <p className="text-xs text-dark-muted max-w-2xl leading-relaxed">
              Launch <strong>Ask TIDAL</strong> to ask complex marine questions conversationally, test alternative scenarios, and receive evidence-backed decision responses.
            </p>
          </div>

          <Button
            onClick={onNavigateToChat}
            className="shrink-0 gap-2 font-semibold text-xs shadow-sm h-9 px-4"
          >
            <span>Open Ask TIDAL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </main>
  );
};
