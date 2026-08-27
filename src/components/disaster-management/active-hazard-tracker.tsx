"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Radar,
  Cloud,
  Wind,
  Gauge,
  Compass,
  MapPin,
  Clock,
  Database,
  AlertTriangle,
  Radio,
  Layers,
  ChevronRight,
  ShieldCheck,
  CircleDot,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DisasterNavHeader } from "./disaster-nav-header";
import {
  ACTIVE_HAZARDS,
  ActiveHazard,
  HAZARD_SEVERITY_CONFIG,
  HazardSeverityClass,
} from "@/mocks/disasterManagementMocks";

export const ActiveHazardTracker: React.FC = () => {
  const [hazards, setHazards] = useState<ActiveHazard[]>(ACTIVE_HAZARDS);
  const [selectedHazardId, setSelectedHazardId] = useState<string>(
    ACTIVE_HAZARDS[0]?.id || ""
  );
  const [isSimulatingClearState, setIsSimulatingClearState] = useState<boolean>(false);

  const displayedHazards = isSimulatingClearState ? [] : hazards;
  const activeHazard = displayedHazards.find((h) => h.id === selectedHazardId) || displayedHazards[0];

  const severityStyle = activeHazard
    ? HAZARD_SEVERITY_CONFIG[activeHazard.severity]
    : null;

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      <DisasterNavHeader
        activeTab="tracker"
        title="Active Hazard Tracker"
        subtitle="Real-time cyclone, severe storm, and deep sea disturbance tracking with IMD bulletin synchronization."
        showBackButton={true}
        backHref="/dashboard/disaster-management"
      />

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Back Link & State Simulation Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Link
              href="/dashboard/disaster-management"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 hover:text-rose-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Back to Disaster Management</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSimulatingClearState(!isSimulatingClearState)}
                className="px-2.5 py-1 text-[11px] font-medium border border-border rounded-lg bg-white hover:bg-gray-50 text-dark-muted transition-colors"
              >
                {isSimulatingClearState ? "Show Active Hazard State" : "Simulate All-Clear State"}
              </button>

              <div className="text-[11px] text-dark-muted flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                <span>IMD Live Radar Feed Active</span>
              </div>
            </div>
          </div>

          {/* If No Active Hazards Detected (Empty State) */}
          {displayedHazards.length === 0 ? (
            <div className="bg-white border border-border rounded-2xl p-12 text-center shadow-card space-y-4 max-w-xl mx-auto my-8">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-dark-text">
                  No Active Hazards Detected
                </h3>
                <p className="text-xs text-dark-muted leading-relaxed">
                  All coastal sectors are currently reporting standard baseline oceanographic conditions. No cyclone advisories, storm surges, or tsunami warnings are in effect.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-border text-[11px] text-dark-muted">
                <Clock className="w-3.5 h-3.5 text-dark-light" />
                <span>Last bulletin scan: Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST (IMD Cyclone Warning Center)</span>
              </div>
            </div>
          ) : (
            /* Active Hazard Tracking Workspace */
            <div className="space-y-6">
              {/* Primary Hazard Overview Banner */}
              <div className="bg-gradient-to-r from-rose-900 via-rose-950 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Cloud className="w-3.5 h-3.5" />
                      Tropical Cyclonic Storm
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-200 text-xs font-semibold">
                      Severity: {activeHazard.severity.toUpperCase()}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight">
                    {activeHazard.name} — Bay of Bengal Deep Depression
                  </h2>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Estimated Landfall: <strong className="text-white">{activeHazard.estimatedLandfall}</strong> • Projected Window: <strong className="text-white">{activeHazard.estimatedTimeline}</strong>
                  </p>
                </div>

                <div className="flex md:flex-col items-start md:items-end justify-between gap-2 shrink-0">
                  <div className="text-right">
                    <div className="text-[11px] text-slate-300 font-mono">Bulletin Reference</div>
                    <div className="text-xs font-bold text-white">{activeHazard.sourceBulletin}</div>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Timestamp: {new Date(activeHazard.bulletinTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST
                  </div>
                </div>
              </div>

              {/* 2-Column Dashboard: Track Map + Telemetry Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Simulated Storm Track Radar View (7 Cols) */}
                <div className="lg:col-span-7 bg-white border border-border rounded-2xl p-5 shadow-card space-y-4 flex flex-col">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
                        <Radar className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-dark-text">
                          Projected Cyclone Track &amp; Cone of Uncertainty
                        </h3>
                        <p className="text-[11px] text-dark-muted">
                          Current Eye: [{activeHazard.currentPosition.lat}°N, {activeHazard.currentPosition.lon}°E]
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full uppercase">
                      Moving {activeHazard.movementDirection} @ {activeHazard.movementSpeed}
                    </span>
                  </div>

                  {/* Visual Storm Map */}
                  <div className="relative w-full h-80 bg-slate-950 rounded-xl overflow-hidden border border-border flex items-center justify-center">
                    {/* SVG Map Grid & Track Vector */}
                    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="radarGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#radarGrid)" />

                      {/* Uncertainty Cone Polygon */}
                      <polygon
                        points="150,220 320,130 380,80 290,60 150,220"
                        fill="rgba(244, 63, 94, 0.15)"
                        stroke="rgba(244, 63, 94, 0.4)"
                        strokeWidth="1"
                        strokeDasharray="4 2"
                      />

                      {/* Projected Track Path */}
                      <path
                        d="M 120 250 L 170 210 L 220 170 L 270 140 L 330 100"
                        fill="none"
                        stroke="#f43f5e"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      {/* Waypoint circles */}
                      <circle cx="120" cy="250" r="4" fill="#64748b" />
                      <circle cx="170" cy="210" r="4" fill="#64748b" />
                      <circle cx="220" cy="170" r="4" fill="#64748b" />
                      <circle cx="270" cy="140" r="4" fill="#64748b" />
                      <circle cx="330" cy="100" r="6" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
                    </svg>

                    {/* Cyclone Center Pulse Marker */}
                    <div className="absolute top-1/3 right-1/3 flex flex-col items-center">
                      <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-rose-400 opacity-60" />
                      <div className="relative w-8 h-8 rounded-full bg-rose-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        🌀
                      </div>
                      <span className="mt-1 text-[10px] font-bold text-rose-300 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700">
                        {activeHazard.name} (Eye)
                      </span>
                    </div>

                    {/* Coastal Landmarks */}
                    <div className="absolute top-6 left-6 text-left space-y-1">
                      <div className="text-[10px] font-bold text-slate-400">Landfall Target</div>
                      <div className="text-xs font-bold text-rose-300 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
                        {activeHazard.estimatedLandfall}
                      </div>
                    </div>
                  </div>

                  {/* Waypoint Timeline Log */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-dark-text uppercase tracking-wider">
                      Observed Waypoint History &amp; Trajectory
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px]">
                      {activeHazard.trackPoints.map((pt, idx) => (
                        <div key={idx} className="p-2 bg-gray-50 border border-border rounded-lg text-center space-y-0.5">
                          <span className="text-dark-muted block">T - {(4 - idx) * 12}h</span>
                          <span className="font-bold text-dark-text block">{pt.lat}°N, {pt.lon}°E</span>
                          <span className="text-[9px] text-dark-muted">{new Date(pt.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Telemetry & Impact Stats (5 Cols) */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Real-time Physical Marine Parameters */}
                  <div className="bg-white border border-border rounded-2xl p-5 shadow-card space-y-4">
                    <h3 className="text-sm font-bold text-dark-text border-b border-border pb-3">
                      Cyclone Telemetry &amp; Intensity
                    </h3>

                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 border border-border rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700">
                            <Wind className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-dark-muted block">
                              Max Sustained Wind Speed
                            </span>
                            <span className="text-xs font-bold text-dark-text">{activeHazard.windSpeed}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 border border-border rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
                            <Gauge className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-dark-muted block">
                              Central Atmospheric Pressure
                            </span>
                            <span className="text-xs font-bold text-dark-text">{activeHazard.pressure}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 border border-border rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-teal-50 border border-teal-200 text-teal-700">
                            <Compass className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-dark-muted block">
                              Direction &amp; Forward Speed
                            </span>
                            <span className="text-xs font-bold text-dark-text">Moving {activeHazard.movementDirection} at {activeHazard.movementSpeed}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Affected Jurisdictions List */}
                    <div className="space-y-2 pt-2 border-t border-border">
                      <span className="text-xs font-bold text-dark-text uppercase tracking-wider block">
                        Directly Affected Coastal Sectors
                      </span>

                      <div className="space-y-1.5">
                        {activeHazard.affectedRegions.map((regionName, idx) => (
                          <div
                            key={idx}
                            className="p-2 bg-rose-50/60 border border-rose-100 rounded-lg flex items-center justify-between text-xs"
                          >
                            <span className="font-semibold text-rose-950">{regionName}</span>
                            <span className="text-[10px] font-bold text-rose-800 uppercase">Warning Active</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Evidence / Source Block */}
                    <div className="pt-2 border-t border-border flex items-center justify-between text-[10px] text-dark-muted">
                      <span className="flex items-center gap-1">
                        <Database className="w-3 h-3 text-dark-light" />
                        Source: <strong className="text-dark-text">{activeHazard.sourceBulletin}</strong>
                      </span>
                      <span>{new Date(activeHazard.bulletinTimestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
