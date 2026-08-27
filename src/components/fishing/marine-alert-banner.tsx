"use client";

import React from "react";
import { AlertTriangle, ShieldCheck, Waves, Info } from "lucide-react";
import { ACTIVE_MARINE_ALERT, MarineAlertBannerData } from "@/mocks/fishingMocks";
import { VoicePlaybackButton } from "./voice-playback-button";

interface MarineAlertBannerProps {
  alertData?: MarineAlertBannerData;
}

export const MarineAlertBanner: React.FC<MarineAlertBannerProps> = ({
  alertData = ACTIVE_MARINE_ALERT,
}) => {
  if (!alertData || !alertData.hasActiveAlert) {
    return (
      <div className="w-full bg-emerald-50/90 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200">
                Sea Status Clear
              </span>
              <span className="text-xs text-emerald-700 font-medium">
                No active storm or high swell warnings in your sector
              </span>
            </div>
            <p className="text-sm font-semibold text-emerald-950 mt-0.5">
              Normal coastal fishing conditions active for Gulf of Mannar & Palk Bay.
            </p>
          </div>
        </div>

        <VoicePlaybackButton
          textToSpeak="No active weather warnings. Sea conditions are normal in your fishing sector."
          label="Listen"
          size="sm"
        />
      </div>
    );
  }

  const isRose = alertData.severity === "rose";

  return (
    <div
      role="alert"
      className={`w-full rounded-2xl p-4 sm:p-5 border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-subtle transition-all ${
        isRose
          ? "bg-rose-50 border-rose-300 text-rose-950"
          : "bg-amber-50/95 border-amber-300 text-amber-950"
      }`}
    >
      <div className="flex items-start sm:items-center gap-3.5">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
            isRose
              ? "bg-rose-100 border-rose-300 text-rose-700"
              : "bg-amber-100 border-amber-300 text-amber-700"
          }`}
        >
          <AlertTriangle className="w-6 h-6 animate-pulse" />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span
              className={`text-xs font-extrabold uppercase tracking-wide px-2.5 py-0.5 rounded-md border ${
                isRose
                  ? "bg-rose-200/80 text-rose-900 border-rose-300"
                  : "bg-amber-200/80 text-amber-900 border-amber-300"
              }`}
            >
              {alertData.badgeText}
            </span>
            <span className="text-xs font-semibold opacity-75">
              {alertData.validity}
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-dark-text tracking-tight">
            {alertData.title}
          </h2>
          <p className="text-sm font-medium text-dark-text/90 mt-0.5">
            {alertData.message}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start md:self-center shrink-0">
        <VoicePlaybackButton
          textToSpeak={alertData.audioText}
          label="Listen to Alert"
          size="md"
          className={
            isRose
              ? "border-rose-300 text-rose-900 hover:bg-rose-100"
              : "border-amber-300 text-amber-900 hover:bg-amber-100"
          }
        />
      </div>
    </div>
  );
};
