"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPinned,
  Anchor,
  Ship,
  Clock,
  AlertTriangle,
  Layers,
  MapPin,
  Info,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DisasterNavHeader } from "./disaster-nav-header";
import {
  ACTIVE_HAZARDS,
  EXPOSURE_DATA,
  HARBOUR_LOCATIONS,
  HarbourReference,
} from "@/mocks/disasterManagementMocks";

export const ExposureAssessment: React.FC = () => {
  const [selectedHazardId, setSelectedHazardId] = useState<string>("cyclone_dana_2024");
  const [filterPathOnly, setFilterPathOnly] = useState<boolean>(false);

  const activeHazard = ACTIVE_HAZARDS.find((h) => h.id === selectedHazardId) || ACTIVE_HAZARDS[0];

  const displayedHarbours = filterPathOnly
    ? HARBOUR_LOCATIONS.filter((h) => h.inProjectedPath)
    : HARBOUR_LOCATIONS;

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      <DisasterNavHeader
        activeTab="exposure"
        title="Exposure & Impact Assessment"
        subtitle="Evaluate critical harbour infrastructure, at-sea craft presence, and estimated impact arrival timelines."
        showBackButton={true}
        backHref="/dashboard/disaster-management"
      />

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Back Link & Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Link
              href="/dashboard/disaster-management"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 hover:text-rose-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Back to Disaster Management</span>
            </Link>

            {/* Hazard Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-dark-muted">Active Event:</span>
              <select
                value={selectedHazardId}
                onChange={(e) => setSelectedHazardId(e.target.value)}
                className="text-xs bg-white border border-border rounded-lg px-2.5 py-1 font-bold text-dark-text focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              >
                {ACTIVE_HAZARDS.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.severity.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Key Impact Overview Counters (3-Stat Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stat 1: Harbours in Projected Path */}
            <div className="bg-white border border-border rounded-2xl p-5 shadow-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-dark-muted flex items-center gap-1.5">
                  <Anchor className="w-3.5 h-3.5 text-orange-600" />
                  Harbours in Projected Path
                </span>
                <span className="text-[10px] font-bold text-orange-800 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                  High Vulnerability
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-dark-text">
                  {EXPOSURE_DATA.harboursInPath}
                </span>
                <span className="text-xs text-dark-muted font-medium">
                  of {EXPOSURE_DATA.harboursTotal} coastal fishing harbours
                </span>
              </div>
              <p className="text-[11px] text-dark-muted">
                Directly intersected by the current cyclone cone of uncertainty.
              </p>
            </div>

            {/* Stat 2: Estimated At-Sea Activity (Clearly labeled as Simulated) */}
            <div className="bg-white border border-border rounded-2xl p-5 shadow-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-dark-muted flex items-center gap-1.5">
                  <Ship className="w-3.5 h-3.5 text-blue-600" />
                  Estimated At-Sea Vessels
                </span>
                <span className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                  Simulated Data
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-dark-text">
                  ~{EXPOSURE_DATA.estimatedAtSeaVessels}
                </span>
                <span className="text-xs text-dark-muted font-medium">
                  crafts in projected zones
                </span>
              </div>
              <p className="text-[11px] text-dark-muted">
                Model estimate based on historical departure density logs.
              </p>
            </div>

            {/* Stat 3: Estimated Time to Impact */}
            <div className="bg-white border border-border rounded-2xl p-5 shadow-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-dark-muted flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-600" />
                  Estimated Time-to-Impact
                </span>
                <span className="text-[10px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                  Evacuation Window
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-dark-text">
                  {EXPOSURE_DATA.estimatedTimeToImpact}
                </span>
              </div>
              <p className="text-[11px] text-dark-muted">
                Window for fishing craft recall and coastal evacuation protocols.
              </p>
            </div>
          </div>

          {/* Main 2-Column Section: Exposure Map + Impacted Harbours */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Map Showing Path Overlay & Harbour Locations (7 Cols) */}
            <div className="lg:col-span-7 bg-white border border-border rounded-2xl p-5 shadow-card space-y-4 flex flex-col">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-700">
                    <MapPinned className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-dark-text">
                      Projected Impact Zone &amp; Harbour Infrastructure
                    </h3>
                    <p className="text-[11px] text-dark-muted">
                      Shared National Harbour Reference Dataset Layer
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setFilterPathOnly(!filterPathOnly)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                    filterPathOnly
                      ? "bg-orange-50 text-orange-800 border-orange-200"
                      : "bg-gray-50 text-dark-muted border-border hover:bg-gray-100"
                  }`}
                >
                  <Filter className="w-3 h-3" />
                  <span>{filterPathOnly ? "Showing Path Only" : "Show All Harbours"}</span>
                </button>
              </div>

              {/* Visual Map with Harbours and Projected Hazard Swath */}
              <div className="relative w-full h-80 bg-slate-950 rounded-xl overflow-hidden border border-border flex items-center justify-center">
                {/* SVG Coastline & Geo Coordinates Simulation */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="expGrid" width="35" height="35" patternUnits="userSpaceOnUse">
                      <path d="M 35 0 L 0 0 0 35" fill="none" stroke="#334155" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#expGrid)" />

                  {/* Impact Zone Cone Corridor */}
                  <path
                    d="M 280 280 L 150 140 L 220 80 L 380 200 Z"
                    fill="rgba(249, 115, 22, 0.2)"
                    stroke="rgba(249, 115, 22, 0.6)"
                    strokeWidth="1.5"
                    strokeDasharray="6 3"
                  />

                  {/* Danger Zone Heat Gradient */}
                  <circle cx="200" cy="120" r="60" fill="rgba(239, 68, 68, 0.15)" />
                </svg>

                {/* Harbour Markers on Map */}
                <div className="relative z-10 w-full h-full p-6 flex flex-col justify-between pointer-events-none">
                  {/* Top-Right Impact Zone Tag */}
                  <div className="self-end bg-slate-900/90 border border-orange-500/50 text-orange-300 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md pointer-events-auto">
                    ⚠️ High Exposure Swath (Bay of Bengal)
                  </div>

                  {/* Middle Harbour Pins */}
                  <div className="space-y-2 pointer-events-auto">
                    <div className="inline-flex items-center gap-1.5 bg-slate-900/90 border border-orange-400 text-white px-2.5 py-1 rounded-md text-[11px] font-semibold">
                      <Anchor className="w-3.5 h-3.5 text-orange-400" />
                      <span>Visakhapatnam (In Path)</span>
                    </div>
                    <br />
                    <div className="inline-flex items-center gap-1.5 bg-slate-900/90 border border-orange-400 text-white px-2.5 py-1 rounded-md text-[11px] font-semibold">
                      <Anchor className="w-3.5 h-3.5 text-orange-400" />
                      <span>Gopalpur Port (In Path)</span>
                    </div>
                    <br />
                    <div className="inline-flex items-center gap-1.5 bg-slate-900/90 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-md text-[11px]">
                      <Anchor className="w-3.5 h-3.5 text-slate-400" />
                      <span>Chennai Harbour (Outside Cone)</span>
                    </div>
                  </div>

                  {/* Bottom Legend */}
                  <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-2 text-[10px] text-slate-300 flex items-center gap-3 pointer-events-auto">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Harbour In Projected Path
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Harbour Outside Path
                    </span>
                  </div>
                </div>
              </div>

              {/* Mandatory Simulated Data Disclaimer */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold text-amber-950">
                    Demonstration &amp; Simulation Notice
                  </div>
                  <p className="text-amber-900 leading-relaxed">
                    At-sea activity data is simulated for demonstration purposes. Do not present or treat vessel counts as real-time AIS transponder telemetry.
                  </p>
                </div>
              </div>
            </div>

            {/* Impacted Harbours Detail List (5 Cols) */}
            <div className="lg:col-span-5 bg-white border border-border rounded-2xl p-5 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-dark-text">
                  Harbour Infrastructure Roster
                </h3>
                <span className="text-[11px] text-dark-muted font-mono">
                  {displayedHarbours.length} harbours listed
                </span>
              </div>

              <div className="space-y-2.5">
                {displayedHarbours.map((harbour) => {
                  return (
                    <div
                      key={harbour.id}
                      className={`p-3 rounded-xl border transition-all space-y-1.5 ${
                        harbour.inProjectedPath
                          ? "bg-orange-50/50 border-orange-200"
                          : "bg-white border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Anchor
                            className={`w-4 h-4 ${
                              harbour.inProjectedPath ? "text-orange-600" : "text-dark-light"
                            }`}
                          />
                          <span className="text-xs font-bold text-dark-text">
                            {harbour.name}
                          </span>
                        </div>

                        {harbour.inProjectedPath ? (
                          <span className="text-[10px] font-bold text-orange-800 bg-orange-100 border border-orange-200 px-2 py-0.5 rounded-full uppercase">
                            In Path
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-dark-muted bg-gray-50 px-2 py-0.5 rounded-full">
                            Clear
                          </span>
                        )}
                      </div>

                      <div className="text-[10px] text-dark-muted flex items-center justify-between">
                        <span>District: <strong className="text-dark-text">{harbour.district}, {harbour.state}</strong></span>
                        <span>Capacity: <strong className="text-dark-text">{harbour.capacity}</strong></span>
                      </div>

                      <div className="text-[10px] text-dark-muted font-mono">
                        Coordinates: {harbour.coordinates.lat}°N, {harbour.coordinates.lon}°E
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
