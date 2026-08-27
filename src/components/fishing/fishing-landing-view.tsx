"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  MapPin,
  Clock,
  Compass,
  ArrowRight,
  Fish,
  Waves,
  Sunrise,
  Anchor,
  Navigation,
} from "lucide-react";
import { MarineAlertBanner } from "./marine-alert-banner";
import { VoicePlaybackButton } from "./voice-playback-button";
import {
  ACTIVE_MARINE_ALERT,
  FISHING_SAFETY_TODAY,
  PFZ_ZONES_LIST,
  FISHING_TIMING_TODAY,
  SAFE_ROUTE_MOCKS,
} from "@/mocks/fishingMocks";

export const FishingLandingView: React.FC = () => {
  const router = useRouter();

  const closestZone = PFZ_ZONES_LIST.find((z) => z.isClosest) || PFZ_ZONES_LIST[0];
  const defaultRoute = SAFE_ROUTE_MOCKS.pfz_cluster_alpha;

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-background p-4 sm:p-6 lg:p-8 space-y-6">
      {/* ── HEADER BANNER: FISHING INTELLIGENCE TITLE & INTRO ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 shadow-subtle shrink-0">
            <Anchor className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-dark-text tracking-tight">
                Fishing Intelligence
              </h1>
              <span className="text-xs font-semibold text-dark-muted bg-gray-100 border border-gray-200 px-2.5 py-0.5 rounded-md">
                Harbour: Rameswaram
              </span>
            </div>
            <p className="text-xs sm:text-sm text-dark-muted font-medium mt-0.5">
              Daily safety guidance, potential fishing zones, best voyage timing &amp; safe navigation routes.
            </p>
          </div>
        </div>

        <VoicePlaybackButton
          textToSpeak="Welcome to Fishing Intelligence. Check if sea is safe, find high fish zones, see best time to start boat, or plan safe route."
          label="Listen to Summary"
          size="md"
        />
      </div>

      {/* ── 1. PERSISTENT MARINE ALERTS BANNER (ALWAYS VISIBLE AT TOP) ── */}
      <MarineAlertBanner alertData={ACTIVE_MARINE_ALERT} />

      {/* ── 2. EXACTLY 4 LARGE TAPPABLE CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* CARD 1: "IS IT SAFE?" — Genuine Safety Status */}
        <button
          type="button"
          onClick={() => router.push("/dashboard/fishing/safety")}
          className="group text-left bg-white rounded-2xl p-6 border border-border hover:border-gray-300 hover:shadow-subtle transition-all active:scale-[0.99] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>

              {/* Status Badge: Emerald (Genuinely Safe) */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 uppercase tracking-wider shrink-0 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {FISHING_SAFETY_TODAY.overallStatus} NOW
              </span>
            </div>

            <h2 className="text-lg font-bold text-dark-text tracking-tight group-hover:text-primary transition-colors">
              Is It Safe to Go?
            </h2>
            <p className="text-sm font-normal text-dark-muted mt-1">
              Check wave height, wind speed, water current, and safe return hours.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Waves className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-semibold text-emerald-950 truncate">
                {FISHING_SAFETY_TODAY.headline} (Wave 1.1m)
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-border flex items-center justify-center text-dark-muted group-hover:text-dark-text group-hover:bg-gray-100 transition-all shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>

        {/* CARD 2: "FISHING ZONES" — Neutral Informational */}
        <button
          type="button"
          onClick={() => router.push("/dashboard/fishing/zones")}
          className="group text-left bg-white rounded-2xl p-6 border border-border hover:border-gray-300 hover:shadow-subtle transition-all active:scale-[0.99] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>

              {/* Informational Badge: Neutral */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 border border-gray-200 text-xs font-semibold text-dark-muted shrink-0 whitespace-nowrap">
                <Fish className="w-3.5 h-3.5" />
                {PFZ_ZONES_LIST.length} Zones Active
              </span>
            </div>

            <h2 className="text-lg font-bold text-dark-text tracking-tight group-hover:text-primary transition-colors">
              Potential Fishing Zones
            </h2>
            <p className="text-sm font-normal text-dark-muted mt-1">
              Satellite-detected fish hotspots (PFZ) with high tuna &amp; mackerel catch.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Fish className="w-4 h-4 text-dark-muted shrink-0" />
              <span className="text-xs font-semibold text-dark-text truncate">
                Nearest: {closestZone.distanceNM} NM ({closestZone.catchRatingText})
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-border flex items-center justify-center text-dark-muted group-hover:text-dark-text group-hover:bg-gray-100 transition-all shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>

        {/* CARD 3: "BEST TIME TO GO" — Neutral Informational */}
        <button
          type="button"
          onClick={() => router.push("/dashboard/fishing/timing")}
          className="group text-left bg-white rounded-2xl p-6 border border-border hover:border-gray-300 hover:shadow-subtle transition-all active:scale-[0.99] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 shrink-0">
                <Clock className="w-6 h-6" />
              </div>

              {/* Informational Badge: Neutral */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 border border-gray-200 text-xs font-semibold text-dark-muted shrink-0 whitespace-nowrap">
                <Sunrise className="w-3.5 h-3.5" />
                Best Window
              </span>
            </div>

            <h2 className="text-lg font-bold text-dark-text tracking-tight group-hover:text-primary transition-colors">
              Best Time to Go
            </h2>
            <p className="text-sm font-normal text-dark-muted mt-1">
              Hourly daylight timeline with smooth tide windows and calm wave periods.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Clock className="w-4 h-4 text-dark-muted shrink-0" />
              <span className="text-xs font-semibold text-dark-text truncate">
                Today: {FISHING_TIMING_TODAY.bestWindow}
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-border flex items-center justify-center text-dark-muted group-hover:text-dark-text group-hover:bg-gray-100 transition-all shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>

        {/* CARD 4: "SAFE ROUTE" — Neutral Informational */}
        <button
          type="button"
          onClick={() => router.push("/dashboard/fishing/route")}
          className="group text-left bg-white rounded-2xl p-6 border border-border hover:border-gray-300 hover:shadow-subtle transition-all active:scale-[0.99] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 shrink-0">
                <Navigation className="w-6 h-6" />
              </div>

              {/* Informational Badge: Neutral */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 border border-gray-200 text-xs font-semibold text-dark-muted shrink-0 whitespace-nowrap">
                <Compass className="w-3.5 h-3.5" />
                Safe Corridor
              </span>
            </div>

            <h2 className="text-lg font-bold text-dark-text tracking-tight group-hover:text-primary transition-colors">
              Safe Navigation Route
            </h2>
            <p className="text-sm font-normal text-dark-muted mt-1">
              Direct compass heading avoiding shallow shoals &amp; international maritime boundaries.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Navigation className="w-4 h-4 text-dark-muted shrink-0" />
              <span className="text-xs font-semibold text-dark-text truncate">
                Route ready • {defaultRoute.distanceNM} NM ({Math.floor(defaultRoute.voyageMinutes / 60)}h {defaultRoute.voyageMinutes % 60}m)
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-border flex items-center justify-center text-dark-muted group-hover:text-dark-text group-hover:bg-gray-100 transition-all shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>
      </div>

      {/* ── FOOTER: SOURCE ATTRIBUTION & PLAIN LANGUAGE BADGE ── */}
      <div className="bg-white rounded-2xl p-4 border border-border flex flex-wrap items-center justify-between gap-3 text-xs text-dark-muted select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Operational Data Sources: <strong>INCOIS (OSF &amp; PFZ)</strong>, <strong>IMD Marine</strong>, <strong>ISRO Oceansat</strong></span>
        </div>
        <span className="text-dark-muted font-medium">Updated 15 mins ago • Synchronized for Rameswaram Sector</span>
      </div>
    </div>
  );
};
