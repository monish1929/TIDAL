"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Waves,
  Wind,
  Compass,
  Sun,
  Clock,
} from "lucide-react";
import { VoicePlaybackButton } from "./voice-playback-button";
import {
  FISHING_SAFETY_TODAY,
  FISHING_SAFETY_TOMORROW,
  FishingSafetyData,
} from "@/mocks/fishingMocks";

export const FishingSafetyView: React.FC = () => {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<"today" | "tomorrow">("today");

  const data: FishingSafetyData =
    selectedDay === "today" ? FISHING_SAFETY_TODAY : FISHING_SAFETY_TOMORROW;

  const isSafe = data.overallStatus === "SAFE";
  const isCaution = data.overallStatus === "CAUTION";

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-background p-4 sm:p-6 lg:p-8 space-y-6">
      {/* ── TOP BAR: BACK NAVIGATION & SIMPLE DATE SWITCHER ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border/80">
        <button
          type="button"
          onClick={() => router.push("/dashboard/fishing")}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-border text-xs sm:text-sm font-semibold text-dark-text hover:bg-gray-50 hover:text-primary transition-all shadow-subtle active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-dark-muted" />
          <span>Back to Fishing Overview</span>
        </button>

        {/* Simple Date Toggle: Today / Tomorrow only */}
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
            Today (Now)
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
      </div>

      {/* ── 1. UNMISTAKABLE OVERALL VERDICT BANNER (REAL SAFETY COLOR SYSTEM) ── */}
      <div
        className={`w-full rounded-2xl p-5 sm:p-6 border shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all ${
          isSafe
            ? "bg-emerald-50/90 border-emerald-300 text-emerald-950"
            : isCaution
            ? "bg-amber-50/90 border-amber-300 text-amber-950"
            : "bg-rose-50/90 border-rose-300 text-rose-950"
        }`}
      >
        <div className="flex items-start sm:items-center gap-4">
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center shrink-0 border ${
              isSafe
                ? "bg-emerald-500 border-emerald-600 text-white"
                : isCaution
                ? "bg-amber-500 border-amber-600 text-white"
                : "bg-rose-500 border-rose-600 text-white"
            }`}
          >
            {isSafe && <ShieldCheck className="w-8 h-8 sm:w-9 sm:h-9" />}
            {isCaution && <AlertTriangle className="w-8 h-8 sm:w-9 sm:h-9" />}
            {!isSafe && !isCaution && <XCircle className="w-8 h-8 sm:w-9 sm:h-9" />}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                  isSafe
                    ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                    : isCaution
                    ? "bg-amber-100 text-amber-900 border-amber-300"
                    : "bg-rose-100 text-rose-900 border-rose-300"
                }`}
              >
                {data.statusBadgeText}
              </span>
              <span className="text-xs text-dark-muted font-medium">
                Best Window: <strong>{data.bestWindowToday}</strong>
              </span>
            </div>

            {/* Standard Headline Scale (24-28px / font-weight 700) */}
            <h1 className="text-xl sm:text-2xl font-bold text-dark-text tracking-tight">
              {data.overallStatus === "SAFE"
                ? "SAFE TO VENTURE"
                : data.overallStatus === "CAUTION"
                ? "CAUTION: ROUGH BY NOON"
                : "UNSAFE TO VENTURE"}
            </h1>

            <p className="text-xs sm:text-sm font-medium text-dark-text/90 mt-1 max-w-2xl">
              {data.plainExplanation}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2.5 shrink-0">
          <VoicePlaybackButton
            textToSpeak={data.audioNarration}
            label="Listen to Audio"
            size="md"
            className={
              isSafe
                ? "bg-emerald-600 border-emerald-700 text-white hover:bg-emerald-700"
                : isCaution
                ? "bg-amber-600 border-amber-700 text-white hover:bg-amber-700"
                : "bg-rose-600 border-rose-700 text-white hover:bg-rose-700"
            }
          />
          <span className="text-[11px] text-dark-muted font-medium">
            Tamil / Hindi / English voice support
          </span>
        </div>
      </div>

      {/* ── 2. SEA CONDITIONS BREAKDOWN CARDS (NEUTRAL INFORMATIONAL TREATMENT) ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-dark-muted">
            Sea Conditions Breakdown ({selectedDay === "today" ? "Today" : "Tomorrow"})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.conditions.map((item) => {
            const isCautionItem = item.status === "caution";
            const isUnsafeItem = item.status === "unsafe";

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl p-5 border transition-all flex flex-col justify-between ${
                  isUnsafeItem
                    ? "border-rose-300 bg-rose-50/20"
                    : isCautionItem
                    ? "border-amber-300 bg-amber-50/20"
                    : "border-border hover:border-gray-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {/* Neutral Icon Container */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        isUnsafeItem
                          ? "bg-rose-100 border-rose-200 text-rose-700"
                          : isCautionItem
                          ? "bg-amber-100 border-amber-200 text-amber-700"
                          : "bg-gray-100 border-gray-200 text-gray-700"
                      }`}
                    >
                      {item.iconType === "wave" && <Waves className="w-5 h-5" />}
                      {item.iconType === "wind" && <Wind className="w-5 h-5" />}
                      {item.iconType === "current" && <Compass className="w-5 h-5" />}
                      {item.iconType === "sun" && <Sun className="w-5 h-5" />}
                    </div>

                    {/* Neutral Tag for normal readings, Amber/Rose only when safety threshold is crossed */}
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${
                        isUnsafeItem
                          ? "bg-rose-100 text-rose-900 border-rose-200"
                          : isCautionItem
                          ? "bg-amber-100 text-amber-900 border-amber-200"
                          : "bg-gray-100 text-dark-muted border-gray-200"
                      }`}
                    >
                      {item.statusText}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-dark-muted uppercase tracking-wider">
                    {item.label}
                  </span>
                  <div className="text-xl font-bold text-dark-text mt-0.5">
                    {item.value}
                  </div>
                </div>

                <p className="text-xs text-dark-muted mt-3 pt-2.5 border-t border-gray-100">
                  {item.plainDesc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 3. HOURLY SEA CONDITION TIMELINE ── */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-subtle">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-dark-muted" />
            <h2 className="text-sm sm:text-base font-bold text-dark-text tracking-tight">
              Hourly Sea Condition Progression
            </h2>
          </div>
          <span className="text-xs text-dark-muted font-medium">
            Color shows sea safety by hour
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
          {data.hourlyTimeline.map((slot, idx) => {
            const isSlotSafe = slot.status === "safe";
            const isSlotCaution = slot.status === "caution";

            return (
              <div
                key={idx}
                className={`rounded-xl p-3 border text-center flex flex-col justify-between transition-all ${
                  isSlotSafe
                    ? "bg-emerald-50/60 border-emerald-200"
                    : isSlotCaution
                    ? "bg-amber-50/60 border-amber-200"
                    : "bg-rose-50/60 border-rose-200"
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-dark-text block">
                    {slot.hour}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded inline-block mt-1 ${
                      isSlotSafe
                        ? "bg-emerald-200 text-emerald-900"
                        : isSlotCaution
                        ? "bg-amber-200 text-amber-900"
                        : "bg-rose-200 text-rose-900"
                    }`}
                  >
                    {slot.label}
                  </span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-black/5 text-[11px] font-medium text-dark-text/80 space-y-0.5">
                  <div>Wave: {slot.wave}</div>
                  <div>Wind: {slot.wind}</div>
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
          <span>Source: <strong>INCOIS Ocean State Forecast (OSF) &amp; IMD Marine Bulletin</strong></span>
        </div>
        <span>Observation sector: Rameswaram &amp; Gulf of Mannar Coastal Waters</span>
      </div>
    </div>
  );
};
