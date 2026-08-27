"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Sunrise,
  Waves,
  Wind,
  Compass,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { VoicePlaybackButton } from "./voice-playback-button";
import {
  FISHING_TIMING_TODAY,
  FISHING_TIMING_TOMORROW,
  FishingTimingWindow,
} from "@/mocks/fishingMocks";

export const FishingTimingView: React.FC = () => {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<"today" | "tomorrow">("today");

  const data: FishingTimingWindow =
    selectedDay === "today" ? FISHING_TIMING_TODAY : FISHING_TIMING_TOMORROW;

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
          {/* Simple Date Switcher */}
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
            textToSpeak={data.audioNarration}
            label="Listen"
            size="md"
          />
        </div>
      </div>

      {/* ── 1. RECOMMENDED WINDOW BANNER (CLEAN STATUS & TYPOGRAPHY) ── */}
      <div className="w-full bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 shrink-0">
            <Sunrise className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                Recommended Window
              </span>
              <span className="text-xs text-dark-muted font-medium">
                Day: <strong>{selectedDay === "today" ? "Today" : "Tomorrow"}</strong>
              </span>
            </div>

            {/* Standard Headline Scale (24-28px / font-weight 700) */}
            <h1 className="text-xl sm:text-2xl font-bold text-dark-text tracking-tight">
              {data.bestWindow}: Good Time to Go
            </h1>

            <p className="text-xs sm:text-sm font-medium text-dark-muted mt-1 max-w-2xl">
              {data.reason}
            </p>
          </div>
        </div>

        {/* Quick Departure Stat Card */}
        <div className="bg-gray-50 rounded-xl p-3.5 border border-border shadow-subtle shrink-0 min-w-[180px] space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-dark-muted">
            <Clock className="w-3.5 h-3.5 text-dark-muted" />
            <span>Optimal Departure</span>
          </div>
          <div className="text-lg font-bold text-dark-text">
            {data.quickMetrics.idealDeparture}
          </div>
          <div className="text-[11px] text-dark-muted font-medium pt-1 border-t border-gray-200/60">
            High tide at {data.quickMetrics.highTideTime}
          </div>
        </div>
      </div>

      {/* ── 2. VISUAL TIME BLOCKS (GENUINE STATUS COLORS: SUITABLE / CAUTION / AVOID) ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-dark-muted">
            Hourly Safety Windows ({selectedDay === "today" ? "Today" : "Tomorrow"})
          </span>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Suitable
            </span>
            <span className="flex items-center gap-1.5 text-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Caution
            </span>
            <span className="flex items-center gap-1.5 text-rose-800">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Avoid
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.timeBlocks.map((block, i) => {
            const isSuitable = block.rating === "SUITABLE";
            const isCaution = block.rating === "CAUTION";

            return (
              <div
                key={i}
                className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  isSuitable
                    ? "border-emerald-300 shadow-subtle"
                    : isCaution
                    ? "border-amber-300 shadow-subtle"
                    : "border-rose-300 shadow-subtle"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                          isSuitable
                            ? "bg-emerald-100 border-emerald-200 text-emerald-700"
                            : isCaution
                            ? "bg-amber-100 border-amber-200 text-amber-700"
                            : "bg-rose-100 border-rose-200 text-rose-700"
                        }`}
                      >
                        {isSuitable && <CheckCircle2 className="w-5 h-5" />}
                        {isCaution && <AlertTriangle className="w-5 h-5" />}
                        {!isSuitable && !isCaution && <XCircle className="w-5 h-5" />}
                      </div>

                      <div>
                        <span className="text-base font-bold text-dark-text block">
                          {block.timeRange}
                        </span>
                        <span
                          className={`text-xs font-bold uppercase px-2 py-0.5 rounded-md inline-block mt-0.5 border ${
                            isSuitable
                              ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                              : isCaution
                              ? "bg-amber-100 text-amber-900 border-amber-300"
                              : "bg-rose-100 text-rose-900 border-rose-300"
                          }`}
                        >
                          {block.ratingLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simple Supporting Factors Rows */}
                <div className="mt-3 pt-2.5 border-t border-gray-100 grid grid-cols-3 gap-2 text-xs font-medium text-dark-muted">
                  <div className="flex items-center gap-1.5">
                    <Waves className="w-3.5 h-3.5 text-dark-muted shrink-0" />
                    <span>{block.waveDesc}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-dark-muted shrink-0" />
                    <span>{block.windDesc}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-dark-muted shrink-0" />
                    <span>{block.tideDesc}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── FOOTER: SOURCE ATTRIBUTION ── */}
      <div className="bg-white rounded-xl p-3.5 border border-border flex flex-wrap items-center justify-between gap-3 text-xs text-dark-muted select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Source: <strong>INCOIS High-Resolution Tidal &amp; Swell Forecast Model</strong></span>
        </div>
        <span>Calculated for Pamban &amp; Rameswaram Fishery Sector</span>
      </div>
    </div>
  );
};
