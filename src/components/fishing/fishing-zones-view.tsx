"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Fish,
  Navigation,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Compass,
} from "lucide-react";
import { VoicePlaybackButton } from "./voice-playback-button";
import { PFZ_ZONES_LIST } from "@/mocks/fishingMocks";

export const FishingZonesView: React.FC = () => {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<"today" | "tomorrow">("today");
  const [expandedZoneId, setExpandedZoneId] = useState<string | null>("pfz_cluster_alpha");
  const [activeZoneId, setActiveZoneId] = useState<string>("pfz_cluster_alpha");

  const toggleExpand = (zoneId: string) => {
    setExpandedZoneId(expandedZoneId === zoneId ? null : zoneId);
    setActiveZoneId(zoneId);
  };

  const selectedZone = PFZ_ZONES_LIST.find((z) => z.id === activeZoneId) || PFZ_ZONES_LIST[0];

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-background p-4 sm:p-6 lg:p-8 space-y-6">
      {/* ── TOP BAR: BACK NAVIGATION & DATE SELECTOR ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border/80">
        <button
          type="button"
          onClick={() => router.push("/dashboard/fishing")}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-border text-xs sm:text-sm font-semibold text-dark-text hover:bg-gray-50 hover:text-primary transition-all shadow-subtle active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-dark-muted" />
          <span>Back to Fishing Overview</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Simple Date Switcher (Today / Tomorrow only) */}
          <div className="flex items-center p-1 bg-gray-100 border border-border rounded-xl gap-1">
            <button
              type="button"
              onClick={() => setSelectedDay("today")}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                selectedDay === "today"
                  ? "bg-white text-dark-text shadow-subtle border border-border"
                  : "text-dark-muted hover:text-dark-text"
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setSelectedDay("tomorrow")}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                selectedDay === "tomorrow"
                  ? "bg-white text-dark-text shadow-subtle border border-border"
                  : "text-dark-muted hover:text-dark-text"
              }`}
            >
              Tomorrow
            </button>
          </div>

          <VoicePlaybackButton
            textToSpeak="Potential Fishing Zones detected by satellite. Nearest zone is Cluster Alpha at 14.8 nautical miles south-south-east with high catch potential for tuna and mackerel."
            label="Listen"
            size="md"
          />
        </div>
      </div>

      {/* ── 1. MAP FRONT AND CENTER SHOWING NEARBY PFZ MARKERS ── */}
      <div className="bg-white rounded-2xl p-5 border border-border shadow-subtle space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 flex items-center justify-center">
              <Fish className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-dark-text tracking-tight">
                Potential Fishing Zones (PFZ) Map
              </h2>
              <p className="text-xs text-dark-muted font-medium">
                Tap on any zone to view distance and plan safe route
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-dark-text bg-gray-100 border border-gray-200 px-3 py-1 rounded-lg">
            Selected: <strong>{selectedZone.name}</strong> ({selectedZone.distanceNM} NM)
          </span>
        </div>

        {/* Visual Map Canvas */}
        <div className="relative w-full h-64 sm:h-80 rounded-xl bg-gradient-to-b from-slate-900 via-slate-950 to-blue-950 overflow-hidden border border-slate-800 flex items-center justify-center select-none shadow-inner">
          {/* Subtle Radar & Distance Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-40 h-40 rounded-full border border-cyan-400/20" />
            <div className="w-64 h-64 rounded-full border border-cyan-400/20" />
            <div className="w-96 h-96 rounded-full border border-cyan-400/15" />
            <div className="absolute w-full h-px bg-cyan-500/20" />
            <div className="absolute h-full w-px bg-cyan-500/20" />
          </div>

          {/* Home Port Marker: Rameswaram */}
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
            <div className="w-6 h-6 rounded-full bg-amber-400 border-2 border-white shadow-lg flex items-center justify-center text-amber-950 font-bold text-[10px]">
              ⚓
            </div>
            <span className="text-[10px] font-semibold text-amber-200 bg-slate-900/90 px-2 py-0.5 rounded mt-1 border border-amber-400/30">
              Rameswaram Jetty
            </span>
          </div>

          {/* PFZ Marker 1: Cluster Alpha (Closest) */}
          <button
            type="button"
            onClick={() => {
              setActiveZoneId("pfz_cluster_alpha");
              setExpandedZoneId("pfz_cluster_alpha");
            }}
            className={`absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 transition-all ${
              activeZoneId === "pfz_cluster_alpha" ? "scale-110" : "hover:scale-105"
            }`}
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 border-2 border-white shadow-xl flex items-center justify-center text-white">
                <Fish className="w-5 h-5" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
            </div>
            <span className="text-[11px] font-bold text-emerald-300 bg-slate-900/95 px-2 py-0.5 rounded-md mt-1 border border-emerald-400/40 shadow">
              Alpha (14.8 NM) ★ Closest
            </span>
          </button>

          {/* PFZ Marker 2: Cluster Beta */}
          <button
            type="button"
            onClick={() => {
              setActiveZoneId("pfz_cluster_beta");
              setExpandedZoneId("pfz_cluster_beta");
            }}
            className={`absolute top-3/4 left-2/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 transition-all ${
              activeZoneId === "pfz_cluster_beta" ? "scale-110" : "hover:scale-105"
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center text-white">
              <Fish className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-semibold text-cyan-200 bg-slate-900/90 px-2 py-0.5 rounded mt-1 border border-blue-400/30 shadow">
              Beta (21.2 NM)
            </span>
          </button>

          {/* PFZ Marker 3: Cluster Gamma */}
          <button
            type="button"
            onClick={() => {
              setActiveZoneId("pfz_cluster_gamma");
              setExpandedZoneId("pfz_cluster_gamma");
            }}
            className={`absolute top-1/4 left-3/4 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 transition-all ${
              activeZoneId === "pfz_cluster_gamma" ? "scale-110" : "hover:scale-105"
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-slate-700 border-2 border-white shadow-xl flex items-center justify-center text-white">
              <Fish className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-semibold text-gray-300 bg-slate-900/90 px-2 py-0.5 rounded mt-1 border border-white/20 shadow">
              Gamma (28.5 NM)
            </span>
          </button>

          {/* Map Compass Badge */}
          <div className="absolute top-3 right-3 bg-slate-900/80 border border-white/20 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-white flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>N ↑ (Palk Bay / Mannar)</span>
          </div>
        </div>
      </div>

      {/* ── 2. ZONE CARDS LIST (DISTANCE, PLAIN CONFIDENCE & EXPANDABLE "WHY THIS ZONE?") ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-dark-muted">
            Available Potential Fishing Zones ({selectedDay === "today" ? "Today" : "Tomorrow"})
          </span>
        </div>

        {PFZ_ZONES_LIST.map((zone) => {
          const isExpanded = expandedZoneId === zone.id;

          return (
            <div
              key={zone.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                zone.isClosest
                  ? "border-emerald-300 shadow-subtle"
                  : "border-border hover:border-gray-300"
              }`}
            >
              {/* Card Header Row */}
              <div
                onClick={() => toggleExpand(zone.id)}
                className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none hover:bg-gray-50/50"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 flex items-center justify-center shrink-0">
                    <Fish className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="text-sm font-bold text-dark-text">
                        {zone.name}
                      </span>
                      {zone.isClosest && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Closest Zone
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 text-xs text-dark-muted font-medium">
                      <span>Distance: <strong className="text-dark-text">{zone.distanceNM} NM</strong></span>
                      <span>•</span>
                      <span>Travel: <strong className="text-dark-text">~{Math.floor(zone.travelTimeMinutes / 60)}h {zone.travelTimeMinutes % 60}m</strong></span>
                      <span>•</span>
                      <span>Heading: <strong className="text-dark-text">{zone.bearingText}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-start sm:self-center">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-dark-text border border-gray-200">
                    {zone.catchRatingText}
                  </span>

                  <button
                    type="button"
                    className="p-1 rounded-lg text-dark-muted hover:text-dark-text hover:bg-gray-100"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expandable "Why this zone?" Section */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 bg-gray-50/60 border-t border-gray-100 space-y-3">
                  <div className="bg-white rounded-xl p-4 border border-border space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-dark-text">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span>Why this zone is recommended:</span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-dark-text">
                      {zone.simplifiedReason}
                    </p>

                    {/* Fish Species Tags */}
                    <div className="pt-2 flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-semibold text-dark-muted mr-1">Expected Fish:</span>
                      {zone.targetFish.map((fish, i) => (
                        <span
                          key={i}
                          className="text-xs font-medium bg-gray-100 text-dark-text border border-gray-200 px-2 py-0.5 rounded"
                        >
                          {fish}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <span className="text-xs text-dark-muted font-medium">
                      Satellite source: {zone.satelliteDataAttribution}
                    </span>

                    <button
                      type="button"
                      onClick={() => router.push("/dashboard/fishing/route")}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-xs sm:text-sm shadow-subtle transition-all active:scale-95"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Plan Safe Route to this Zone →</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── FOOTER: SOURCE ATTRIBUTION ── */}
      <div className="bg-white rounded-xl p-3.5 border border-border flex flex-wrap items-center justify-between gap-3 text-xs text-dark-muted select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Source: <strong>INCOIS Potential Fishing Zone (PFZ) Advisory &amp; Oceansat-3 OCM</strong></span>
        </div>
        <span>Data verified for registered mechanized fishing sector</span>
      </div>
    </div>
  );
};
