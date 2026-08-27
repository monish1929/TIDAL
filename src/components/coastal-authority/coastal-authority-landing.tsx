"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  GitCompareArrows,
  FileText,
  ArrowRight,
  Shield,
  AlertTriangle,
  Waves,
  Wind,
  Zap,
  Info,
  Clock,
} from "lucide-react";
import { CoastalNavHeader } from "./coastal-nav-header";
import {
  REGION_HAZARD_OVERVIEWS,
  ZONE_COMPARISON_DATA,
  DISTRICT_BRIEFING,
  SEVERITY_CONFIG,
} from "@/mocks/coastalAuthorityMocks";

export const CoastalAuthorityLanding: React.FC = () => {
  const router = useRouter();

  // Preview data
  const defaultOverview = REGION_HAZARD_OVERVIEWS["gulf_mannar"];
  const flaggedZoneCount = ZONE_COMPARISON_DATA.filter((z) => z.flagged).length;
  const severityStyle = SEVERITY_CONFIG[defaultOverview.overallStatus];

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      <CoastalNavHeader
        activeTab="overview"
        title="Coastal Authority Workspace"
        subtitle="Region-wide hazard monitoring, zone comparison, and jurisdiction briefing for coastal governance officers."
      />

      <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
        {/* Intro Banner */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-teal-900 via-teal-950 to-slate-900 rounded-2xl p-6 lg:p-8 text-white shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="max-w-2xl space-y-3 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold">
                <Shield className="w-3.5 h-3.5" />
                <span>Coastal Governance &amp; Jurisdiction Management</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
                Coastal Authority Command Center
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Monitor hazard conditions across your jurisdiction, compare risk across zones, and generate briefing reports for upward reporting. Boundary monitoring is available via the dedicated Zone &amp; Boundary Watch section.
              </p>
            </div>
          </div>
        </div>

        {/* 3 PRIMARY SUMMARY CARDS */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* 1. JURISDICTION HAZARD OVERVIEW CARD */}
          <div
            onClick={() => router.push("/dashboard/coastal-authority/overview")}
            className="bg-white border border-border hover:border-teal-500/50 hover:shadow-lg rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer group space-y-5"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 group-hover:scale-105 transition-transform">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className={`text-[10px] font-bold ${severityStyle.color} ${severityStyle.bg} ${severityStyle.border} border px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                  {severityStyle.label}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-dark-text group-hover:text-teal-700 transition-colors">
                  Jurisdiction Hazard Overview
                </h3>
                <p className="text-xs text-dark-muted mt-1 leading-relaxed">
                  Region-wide hazard and condition status across your coastal jurisdiction.
                </p>
              </div>

              {/* Live Preview */}
              <div className="bg-gray-50/90 rounded-xl p-3.5 border border-border/80 space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-dark-text flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    {defaultOverview.regionName}
                  </span>
                  <span className={`text-[10px] font-bold ${severityStyle.color} ${severityStyle.bg} ${severityStyle.border} border px-1.5 py-0.5 rounded`}>
                    {defaultOverview.activeAlertCount} Active Alerts
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  {defaultOverview.hazards.map((h) => {
                    const hStyle = SEVERITY_CONFIG[h.severity];
                    return (
                      <div key={h.type} className={`p-1.5 ${hStyle.bg} ${hStyle.border} border rounded text-center`}>
                        <span className="text-dark-muted block">{h.label}</span>
                        <span className={`font-bold ${hStyle.color}`}>
                          {h.value}{h.unit ? ` ${h.unit}` : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-bold text-teal-700 group-hover:translate-x-0.5 transition-transform">
              <span>Open Hazard Overview</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* 2. ZONE COMPARISON CARD */}
          <div
            onClick={() => router.push("/dashboard/coastal-authority/compare")}
            className="bg-white border border-border hover:border-cyan-500/50 hover:shadow-lg rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer group space-y-5"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 group-hover:scale-105 transition-transform">
                  <GitCompareArrows className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {flaggedZoneCount} Flagged
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-dark-text group-hover:text-cyan-700 transition-colors">
                  Zone Comparison
                </h3>
                <p className="text-xs text-dark-muted mt-1 leading-relaxed">
                  Compare hazard risk across multiple zones in your jurisdiction side by side.
                </p>
              </div>

              {/* Live Preview */}
              <div className="bg-gray-50/90 rounded-xl p-3.5 border border-border/80 space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-dark-text flex items-center gap-1.5">
                    <GitCompareArrows className="w-3.5 h-3.5 text-cyan-600" />
                    Multi-Zone Risk Scan
                  </span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                    {flaggedZoneCount} zones flagged elevated
                  </span>
                </div>

                <div className="space-y-1.5">
                  {ZONE_COMPARISON_DATA.slice(0, 3).map((z) => {
                    const riskColor = z.riskScore >= 60 ? "text-rose-700 bg-rose-50" : z.riskScore >= 40 ? "text-amber-700 bg-amber-50" : "text-emerald-700 bg-emerald-50";
                    return (
                      <div key={z.zoneId} className="flex items-center justify-between p-1.5 bg-white border border-border rounded text-[10px]">
                        <span className="font-semibold text-dark-text truncate">{z.zoneName}</span>
                        <span className={`font-bold px-1.5 py-0.5 rounded ${riskColor}`}>
                          Risk: {z.riskScore}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-bold text-cyan-700 group-hover:translate-x-0.5 transition-transform">
              <span>Launch Zone Comparison</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* 3. DISTRICT BRIEFING CARD */}
          <div
            onClick={() => router.push("/dashboard/coastal-authority/briefing")}
            className="bg-white border border-border hover:border-slate-500/50 hover:shadow-lg rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer group space-y-5"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  2 days ago
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-dark-text group-hover:text-slate-700 transition-colors">
                  District Briefing
                </h3>
                <p className="text-xs text-dark-muted mt-1 leading-relaxed">
                  Generate a summary report of hazards, incidents, and conditions for reporting upward.
                </p>
              </div>

              {/* Live Preview */}
              <div className="bg-gray-50/90 rounded-xl p-3.5 border border-border/80 space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-dark-text flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    Last Generated Report
                  </span>
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded">
                    {DISTRICT_BRIEFING.totalAlerts} alerts
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-1.5 bg-white border border-border rounded text-center">
                    <span className="text-dark-muted block">Alert Count</span>
                    <span className="font-bold text-dark-text">{DISTRICT_BRIEFING.totalAlerts}</span>
                  </div>
                  <div className="p-1.5 bg-white border border-border rounded text-center">
                    <span className="text-dark-muted block">Boundary Incidents</span>
                    <span className="font-bold text-dark-text">{DISTRICT_BRIEFING.boundaryIncidents}</span>
                  </div>
                </div>

                <div className="text-[10px] text-dark-muted flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" />
                  <span>Period: {DISTRICT_BRIEFING.periodStart} — {DISTRICT_BRIEFING.periodEnd}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:translate-x-0.5 transition-transform">
              <span>Generate District Briefing</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white border border-border rounded-xl p-4 flex items-start gap-3 shadow-subtle">
            <div className="p-2 rounded-lg bg-teal-50 text-teal-700 border border-teal-100 shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div className="text-xs space-y-1">
              <h4 className="font-bold text-dark-text">
                Coastal Authority Workspace Scope
              </h4>
              <p className="text-dark-muted leading-relaxed">
                This workspace provides current-state hazard monitoring and spatial comparison tools. For boundary and restricted-zone monitoring, use the <a href="/dashboard?scope=zones" className="text-primary font-semibold hover:underline">Zone &amp; Boundary Watch</a> section. For historical trend analysis and multi-month comparisons, use <a href="/dashboard/research" className="text-primary font-semibold hover:underline">Research Analytics</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
