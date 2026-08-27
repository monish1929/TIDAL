"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Radar,
  MapPinned,
  Languages,
  ArrowRight,
  Siren,
  AlertTriangle,
  Anchor,
  Cloud,
  Info,
  CircleDot,
} from "lucide-react";
import { DisasterNavHeader } from "./disaster-nav-header";
import {
  ACTIVE_HAZARDS,
  HAZARD_SEVERITY_CONFIG,
  EXPOSURE_DATA,
  HARBOUR_LOCATIONS,
} from "@/mocks/disasterManagementMocks";

export const DisasterManagementLanding: React.FC = () => {
  const router = useRouter();

  const activeHazard = ACTIVE_HAZARDS[0];
  const severityStyle = activeHazard
    ? HAZARD_SEVERITY_CONFIG[activeHazard.severity]
    : null;

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      <DisasterNavHeader
        activeTab="overview"
        title="Disaster Management Workspace"
        subtitle="Active hazard tracking, exposure assessment, and multilingual alert preparation for disaster response officers."
      />

      <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
        {/* Intro Banner */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-rose-900 via-rose-950 to-slate-900 rounded-2xl p-6 lg:p-8 text-white shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="max-w-2xl space-y-3 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-semibold">
                <Siren className="w-3.5 h-3.5" />
                <span>Emergency Response &amp; Hazard Operations</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
                Disaster Management Command Center
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Track active cyclones and storms, assess harbour and vessel exposure, and prepare multilingual alerts for affected regions. All advisory data sourced from IMD bulletins with explicit timestamps.
              </p>
            </div>
          </div>
        </div>

        {/* 3 PRIMARY SUMMARY CARDS */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* 1. ACTIVE HAZARD TRACKER CARD */}
          <div
            onClick={() => router.push("/dashboard/disaster-management/tracker")}
            className="bg-white border border-border hover:border-rose-500/50 hover:shadow-lg rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer group space-y-5"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 group-hover:scale-105 transition-transform">
                  <Radar className="w-6 h-6" />
                </div>
                {activeHazard && severityStyle ? (
                  <span className={`text-[10px] font-bold ${severityStyle.color} ${severityStyle.bg} ${severityStyle.border} border px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                    {severityStyle.label}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    All Clear
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-dark-text group-hover:text-rose-700 transition-colors">
                  Active Hazard Tracker
                </h3>
                <p className="text-xs text-dark-muted mt-1 leading-relaxed">
                  Track current cyclone/storm status, severity, and timing.
                </p>
              </div>

              {/* Live Preview */}
              <div className="bg-gray-50/90 rounded-xl p-3.5 border border-border/80 space-y-2.5">
                {activeHazard ? (
                  <>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-dark-text flex items-center gap-1.5">
                        <Cloud className="w-3.5 h-3.5 text-rose-500" />
                        {activeHazard.name}
                      </span>
                      <span className={`text-[10px] font-bold ${severityStyle!.color} ${severityStyle!.bg} ${severityStyle!.border} border px-1.5 py-0.5 rounded`}>
                        {activeHazard.windSpeed.split("(")[0].trim()}
                      </span>
                    </div>

                    <div className="p-2 bg-rose-50/60 border border-rose-100 rounded-lg">
                      <div className="text-xs font-bold text-rose-950">
                        {activeHazard.type.charAt(0).toUpperCase() + activeHazard.type.slice(1)} — {activeHazard.severity.charAt(0).toUpperCase() + activeHazard.severity.slice(1)} Level
                      </div>
                      <div className="text-[10px] text-rose-800 mt-0.5">
                        Estimated landfall: <strong>{activeHazard.estimatedLandfall}</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="p-1.5 bg-white border border-border rounded text-center">
                        <span className="text-dark-muted block">Timeline</span>
                        <span className="font-bold text-dark-text">{activeHazard.estimatedTimeline}</span>
                      </div>
                      <div className="p-1.5 bg-white border border-border rounded text-center">
                        <span className="text-dark-muted block">Pressure</span>
                        <span className="font-bold text-dark-text">{activeHazard.pressure}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <CircleDot className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-800">No active hazards detected</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-bold text-rose-700 group-hover:translate-x-0.5 transition-transform">
              <span>Open Hazard Tracker</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* 2. EXPOSURE & IMPACT ASSESSMENT CARD */}
          <div
            onClick={() => router.push("/dashboard/disaster-management/exposure")}
            className="bg-white border border-border hover:border-orange-500/50 hover:shadow-lg rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer group space-y-5"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-700 group-hover:scale-105 transition-transform">
                  <MapPinned className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-orange-800 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {EXPOSURE_DATA.harboursInPath} in Path
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-dark-text group-hover:text-orange-700 transition-colors">
                  Exposure &amp; Impact Assessment
                </h3>
                <p className="text-xs text-dark-muted mt-1 leading-relaxed">
                  Assess which harbours, zones, and activity fall within a hazard&apos;s projected impact path.
                </p>
              </div>

              {/* Live Preview */}
              <div className="bg-gray-50/90 rounded-xl p-3.5 border border-border/80 space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-dark-text flex items-center gap-1.5">
                    <Anchor className="w-3.5 h-3.5 text-orange-600" />
                    Harbour Exposure Scan
                  </span>
                  <span className="text-[10px] font-bold text-orange-800 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded">
                    {EXPOSURE_DATA.harboursInPath} / {EXPOSURE_DATA.harboursTotal}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {EXPOSURE_DATA.impactedHarbours.slice(0, 3).map((h) => (
                    <div key={h.id} className="flex items-center justify-between p-1.5 bg-orange-50/60 border border-orange-100 rounded text-[10px]">
                      <span className="font-semibold text-dark-text truncate">{h.name}</span>
                      <span className="font-bold text-orange-700">{h.district}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-bold text-orange-700 group-hover:translate-x-0.5 transition-transform">
              <span>Open Exposure Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* 3. ALERT DRAFTING STUDIO CARD */}
          <div
            onClick={() => router.push("/dashboard/disaster-management/alerts")}
            className="bg-white border border-border hover:border-violet-500/50 hover:shadow-lg rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer group space-y-5"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-700 group-hover:scale-105 transition-transform">
                  <Languages className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Multi-Lingual
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-dark-text group-hover:text-violet-700 transition-colors">
                  Alert Drafting Studio
                </h3>
                <p className="text-xs text-dark-muted mt-1 leading-relaxed">
                  Generate multilingual alert messages for affected regions.
                </p>
              </div>

              {/* Live Preview */}
              <div className="bg-gray-50/90 rounded-xl p-3.5 border border-border/80 space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-dark-text flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 text-violet-600" />
                    Latest Draft
                  </span>
                  <span className="text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-1.5 py-0.5 rounded">
                    Draft Ready
                  </span>
                </div>

                <div className="p-2 bg-violet-50/60 border border-violet-100 rounded-lg">
                  <div className="text-xs font-bold text-violet-950">
                    Cyclone Advisory
                  </div>
                  <div className="text-[10px] text-violet-800 mt-0.5">
                    Languages: Tamil + Hindi + English
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-0.5">
                  <span className="text-[9px] font-semibold bg-white border border-border px-1.5 py-0.5 rounded text-dark-muted">English</span>
                  <span className="text-[9px] font-semibold bg-white border border-border px-1.5 py-0.5 rounded text-dark-muted">தமிழ்</span>
                  <span className="text-[9px] font-semibold bg-white border border-border px-1.5 py-0.5 rounded text-dark-muted">हिन्दी</span>
                  <span className="text-[9px] font-semibold bg-white border border-border px-1.5 py-0.5 rounded text-dark-muted">+3 more</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-bold text-violet-700 group-hover:translate-x-0.5 transition-transform">
              <span>Open Alert Studio</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white border border-border rounded-xl p-4 flex items-start gap-3 shadow-subtle">
            <div className="p-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-100 shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div className="text-xs space-y-1">
              <h4 className="font-bold text-dark-text">
                Disaster Management Workspace Scope
              </h4>
              <p className="text-dark-muted leading-relaxed">
                This workspace supports emergency hazard operations with current-state data. All weather bulletins are sourced from IMD with explicit timestamps. For historical analysis and long-term trend computation, use <a href="/dashboard/research" className="text-primary font-semibold hover:underline">Research Analytics</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
