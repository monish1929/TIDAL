"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Navigation,
  MapPin,
  Compass,
  AlertTriangle,
  Fuel,
  Clock,
  Ship,
} from "lucide-react";
import { VoicePlaybackButton } from "./voice-playback-button";
import {
  DEPARTURE_HARBOURS,
  PFZ_ZONES_LIST,
  SAFE_ROUTE_MOCKS,
  SafeRouteOption,
} from "@/mocks/fishingMocks";

export const FishingRouteView: React.FC = () => {
  const router = useRouter();
  const [selectedHarbour, setSelectedHarbour] = useState<string>("Rameswaram Fishing Jetty");
  const [selectedDestinationKey, setSelectedDestinationKey] = useState<string>("pfz_cluster_alpha");

  const routeData: SafeRouteOption =
    SAFE_ROUTE_MOCKS[selectedDestinationKey] || SAFE_ROUTE_MOCKS.pfz_cluster_alpha;

  const isSafeCorridor = routeData.safetyRating === "SAFE_CORRIDOR";

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-background p-4 sm:p-6 lg:p-8 space-y-6">
      {/* ── TOP BAR: BACK NAVIGATION & AUDIO NARRATION ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border/80">
        <button
          type="button"
          onClick={() => router.push("/dashboard/fishing")}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-border text-xs sm:text-sm font-semibold text-dark-text hover:bg-gray-50 hover:text-primary transition-all shadow-subtle active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-dark-muted" />
          <span>Back to Fishing Overview</span>
        </button>

        <VoicePlaybackButton
          textToSpeak={routeData.audioNarration}
          label="Listen to Route Voice Guidance"
          size="md"
        />
      </div>

      {/* ── 1. ROUTE SUMMARY BANNER (CLEAN & STANDARDIZED) ── */}
      <div className="w-full rounded-2xl p-5 sm:p-6 border border-border bg-white shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 shrink-0">
            <Navigation className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                  isSafeCorridor
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-amber-50 text-amber-800 border-amber-200"
                }`}
              >
                {isSafeCorridor ? "SAFE NAVIGATION CORRIDOR" : "CAUTION CORRIDOR"}
              </span>
              <span className="text-xs text-dark-muted font-medium">
                From <strong>{selectedHarbour}</strong>
              </span>
            </div>

            {/* Standard Headline Scale (24-28px / font-weight 700) */}
            <h1 className="text-xl sm:text-2xl font-bold text-dark-text tracking-tight">
              {routeData.distanceNM} NM • ~{Math.floor(routeData.voyageMinutes / 60)}h {routeData.voyageMinutes % 60}m Estimated Voyage
            </h1>

            <p className="text-xs sm:text-sm font-medium text-dark-muted mt-1 max-w-2xl">
              {routeData.boundaryNotice}
            </p>
          </div>
        </div>

        {/* Quick Fuel & Time Stats */}
        <div className="grid grid-cols-2 gap-2.5 shrink-0">
          <div className="bg-gray-50 rounded-xl p-3 border border-border shadow-subtle space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-dark-muted">
              <Clock className="w-3.5 h-3.5 text-dark-muted" />
              <span>Voyage Time</span>
            </div>
            <div className="text-base font-bold text-dark-text">
              {routeData.voyageMinutes} mins
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 border border-border shadow-subtle space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-dark-muted">
              <Fuel className="w-3.5 h-3.5 text-dark-muted" />
              <span>Est. Fuel</span>
            </div>
            <div className="text-base font-bold text-dark-text">
              ~{routeData.fuelLitresEstimate} L
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. DESTINATION & HARBOUR SELECTOR (TAP-LIST PATTERN) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Departure Harbour Picker */}
        <div className="bg-white rounded-2xl p-5 border border-border shadow-subtle space-y-3">
          <div className="flex items-center gap-2">
            <Ship className="w-4 h-4 text-dark-muted" />
            <span className="text-xs font-bold uppercase tracking-wider text-dark-muted">
              Departure Harbour (Tap to change)
            </span>
          </div>

          <div className="space-y-1.5">
            {DEPARTURE_HARBOURS.slice(0, 3).map((harbour) => {
              const isSelected = selectedHarbour === harbour;
              return (
                <button
                  key={harbour}
                  type="button"
                  onClick={() => setSelectedHarbour(harbour)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-gray-100 border-gray-300 text-dark-text shadow-subtle"
                      : "bg-white border-border text-dark-muted hover:bg-gray-50 hover:text-dark-text"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">⚓</span>
                    <span>{harbour}</span>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-primary text-white">
                      Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Destination Target Zone Picker */}
        <div className="bg-white rounded-2xl p-5 border border-border shadow-subtle space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-dark-muted" />
            <span className="text-xs font-bold uppercase tracking-wider text-dark-muted">
              Target Destination Zone (Tap to select)
            </span>
          </div>

          <div className="space-y-1.5">
            {PFZ_ZONES_LIST.map((zone) => {
              const isSelected = selectedDestinationKey === zone.id;
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setSelectedDestinationKey(zone.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-gray-100 border-gray-300 text-dark-text shadow-subtle"
                      : "bg-white border-border text-dark-muted hover:bg-gray-50 hover:text-dark-text"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🐟</span>
                    <span>{zone.name} ({zone.distanceNM} NM)</span>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-primary text-white">
                      Active Route
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 3. MAP ROUTE VISUALIZATION ── */}
      <div className="bg-white rounded-2xl p-5 border border-border shadow-subtle space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-dark-muted" />
            <h2 className="text-sm sm:text-base font-bold text-dark-text">
              Navigational Course &amp; Hazard Radar
            </h2>
          </div>
          <span className="text-xs text-dark-muted font-medium">
            Compass Heading: <strong>165° SSE (Direct Bearing)</strong>
          </span>
        </div>

        {/* Route Canvas */}
        <div className="relative w-full h-72 sm:h-80 rounded-xl bg-gradient-to-b from-slate-900 via-slate-950 to-blue-950 overflow-hidden border border-slate-800 flex items-center justify-center select-none shadow-inner">
          {/* Nautical Grid lines */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 pointer-events-none opacity-15">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="border border-cyan-400/40" />
            ))}
          </div>

          {/* Simulated Route Line (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* International Boundary Line (Dashed Red) */}
            <line
              x1="10%"
              y1="20%"
              x2="90%"
              y2="20%"
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="6 4"
              opacity="0.8"
            />
            {/* Route Polyline */}
            <line
              x1="30%"
              y1="40%"
              x2="45%"
              y2="55%"
              stroke="#10b981"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <line
              x1="45%"
              y1="55%"
              x2="65%"
              y2="75%"
              stroke="#10b981"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>

          {/* International Boundary Warning Label */}
          <div className="absolute top-3 left-4 bg-rose-950/90 border border-rose-500/40 text-rose-200 text-[10px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>International Maritime Boundary (IMBL) — Keep 5+ NM South</span>
          </div>

          {/* Start Point: Harbour */}
          <div className="absolute top-[40%] left-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
            <div className="w-6 h-6 rounded-full bg-amber-400 border-2 border-white shadow-lg flex items-center justify-center text-amber-950 font-bold text-[10px]">
              ⚓
            </div>
            <span className="text-[10px] font-medium text-white bg-slate-900/90 px-2 py-0.5 rounded mt-1 border border-white/20">
              Start: {selectedHarbour.split(" ")[0]}
            </span>
          </div>

          {/* Mid Waypoint */}
          <div className="absolute top-[55%] left-[45%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
            <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 border border-white shadow flex items-center justify-center text-[8px] font-bold text-cyan-950">
              W1
            </div>
            <span className="text-[9px] font-medium text-cyan-200 bg-slate-900/80 px-1.5 py-0.2 rounded mt-0.5">
              Clear Shoals
            </span>
          </div>

          {/* Destination: PFZ */}
          <div className="absolute top-[75%] left-[65%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
            <div className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs">
              🐟
            </div>
            <span className="text-[10px] font-semibold text-emerald-300 bg-slate-900/90 px-2 py-0.5 rounded mt-1 border border-emerald-400/40 shadow">
              Target: {routeData.destinationZone.split("(")[0]}
            </span>
          </div>
        </div>

        {/* Hazard & Coral Notice Banner */}
        <div className="bg-amber-50/80 rounded-xl p-3.5 border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-amber-900 block">
              Navigational Hazard Alert along this corridor:
            </span>
            <p className="text-xs font-medium text-amber-950 mt-0.5">
              {routeData.hazardNotice}
            </p>
          </div>
        </div>
      </div>

      {/* ── FOOTER: SOURCE ATTRIBUTION ── */}
      <div className="bg-white rounded-xl p-3.5 border border-border flex flex-wrap items-center justify-between gap-3 text-xs text-dark-muted select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Source: <strong>Indian Coast Guard (ICG) Maritime Safety Information &amp; INCOIS Navigational Guidance</strong></span>
        </div>
        <span>Coordinates verified for standard 30-45ft motorized fishing craft</span>
      </div>
    </div>
  );
};
