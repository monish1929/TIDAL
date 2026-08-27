"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Download,
  Calendar,
  AlertTriangle,
  ShieldAlert,
  Waves,
  Wind,
  Zap,
  CloudLightning,
  Clock,
  ExternalLink,
  Printer,
  CheckCircle2,
  Share2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CoastalNavHeader } from "./coastal-nav-header";
import {
  DISTRICT_BRIEFING,
  SEVERITY_CONFIG,
  HazardType,
} from "@/mocks/coastalAuthorityMocks";

export const DistrictBriefing: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "14d" | "30d">("7d");
  const [exportedSuccess, setExportedSuccess] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportedSuccess(true);
      setTimeout(() => setExportedSuccess(false), 4000);
    }, 800);
  };

  const getHazardTypeIcon = (type: HazardType) => {
    switch (type) {
      case "wave":
        return <Waves className="w-3.5 h-3.5 text-blue-500" />;
      case "wind":
        return <Wind className="w-3.5 h-3.5 text-amber-500" />;
      case "cyclone":
        return <Zap className="w-3.5 h-3.5 text-rose-500" />;
      case "lightning":
        return <CloudLightning className="w-3.5 h-3.5 text-indigo-500" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      <CoastalNavHeader
        activeTab="briefing"
        title="District Briefing Generator"
        subtitle="Upward administrative reporting summary on hazard frequency, zone alerts, and boundary proximity incidents."
        showBackButton={true}
        backHref="/dashboard/coastal-authority"
      />

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Top Back Link & Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Link
              href="/dashboard/coastal-authority"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Back to Coastal Authority</span>
            </Link>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-border text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedPeriod("7d")}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    selectedPeriod === "7d"
                      ? "bg-white text-dark-text shadow-subtle font-semibold"
                      : "text-dark-muted hover:text-dark-text"
                  }`}
                >
                  Last 7 Days
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPeriod("14d")}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    selectedPeriod === "14d"
                      ? "bg-white text-dark-text shadow-subtle font-semibold"
                      : "text-dark-muted hover:text-dark-text"
                  }`}
                >
                  Last 14 Days
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPeriod("30d")}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    selectedPeriod === "30d"
                      ? "bg-white text-dark-text shadow-subtle font-semibold"
                      : "text-dark-muted hover:text-dark-text"
                  }`}
                >
                  Last 30 Days
                </button>
              </div>

              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="bg-teal-700 hover:bg-teal-800 text-white text-xs h-8 px-3 gap-1.5 shadow-subtle"
              >
                {isExporting ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>Export Briefing (PDF)</span>
              </Button>
            </div>
          </div>

          {/* Export Success Notification */}
          {exportedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between shadow-subtle animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  District Briefing report generated and exported as <strong>TIDAL_District_Briefing_Report.pdf</strong>
                </span>
              </div>
              <span className="text-[10px] text-emerald-700 font-mono">Completed</span>
            </div>
          )}

          {/* Printable / Formal Report Paper Container */}
          <div className="bg-white border border-border rounded-2xl shadow-card p-6 lg:p-8 space-y-6">
            {/* Formal Report Header */}
            <div className="border-b border-border pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold uppercase tracking-wider">
                  Official Administrative Briefing
                </div>
                <h2 className="text-xl font-bold text-dark-text">
                  Coastal Jurisdiction Marine Hazard Briefing
                </h2>
                <p className="text-xs text-dark-muted">
                  Report Period: {DISTRICT_BRIEFING.periodStart} to {DISTRICT_BRIEFING.periodEnd} (7-Day Rolling Summary)
                </p>
              </div>

              <div className="text-right space-y-0.5">
                <div className="text-[11px] font-mono text-dark-muted">
                  Report Ref: TIDAL-CR-2024-07
                </div>
                <div className="text-[11px] text-dark-muted flex items-center md:justify-end gap-1">
                  <Clock className="w-3 h-3 text-dark-light" />
                  Generated: {new Date(DISTRICT_BRIEFING.generatedAt).toLocaleDateString()} at {new Date(DISTRICT_BRIEFING.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST
                </div>
              </div>
            </div>

            {/* Key Metric Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 border border-border rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-dark-muted flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Total Hazard Alerts
                </span>
                <div className="text-2xl font-bold font-mono text-dark-text">
                  {DISTRICT_BRIEFING.totalAlerts}
                </div>
                <span className="text-[10px] text-dark-muted">
                  Across 8 monitored jurisdictional coastal sectors
                </span>
              </div>

              <div className="p-4 bg-gray-50 border border-border rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-dark-muted flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  Boundary Proximity Incidents
                </span>
                <div className="text-2xl font-bold font-mono text-dark-text">
                  {DISTRICT_BRIEFING.boundaryIncidents}
                </div>
                <span className="text-[10px] text-dark-muted">
                  Vessels detected near international or MPA boundaries
                </span>
              </div>

              <div className="p-4 bg-gray-50 border border-border rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-dark-muted flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-teal-600" />
                  Primary Hazard Type
                </span>
                <div className="text-2xl font-bold text-dark-text">
                  Wave Swell
                </div>
                <span className="text-[10px] text-dark-muted">
                  Accounted for 36% of all issued advisories
                </span>
              </div>
            </div>

            {/* Top Affected Zones Breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-dark-text">
                Top Affected Jurisdictional Zones
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-gray-50/75 text-dark-muted font-bold">
                      <th className="py-2.5 px-3">Zone / Sector</th>
                      <th className="py-2.5 px-3">Alert Count</th>
                      <th className="py-2.5 px-3">Max Severity</th>
                      <th className="py-2.5 px-3 text-right">Primary Driver</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {DISTRICT_BRIEFING.topAffectedZones.map((zone, idx) => {
                      const sevStyle = SEVERITY_CONFIG[zone.severity];
                      return (
                        <tr key={idx} className="hover:bg-gray-50/50">
                          <td className="py-2.5 px-3 font-semibold text-dark-text">
                            {zone.zoneName}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold">
                            {zone.alertCount} alerts
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${sevStyle.bg} ${sevStyle.color} ${sevStyle.border} border`}>
                              {sevStyle.label}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right text-dark-muted">
                            {idx === 0 ? "High Swell + Lightning" : idx === 1 ? "Rough Sea Advisory" : "Coastal Wind Surge"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Hazard Distribution Breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-dark-text">
                Hazard Type Distribution (Period Total)
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {DISTRICT_BRIEFING.hazardBreakdown.map((item) => (
                  <div key={item.type} className="p-3 bg-white border border-border rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-dark-text capitalize flex items-center gap-1.5">
                        {getHazardTypeIcon(item.type)}
                        {item.type}
                      </span>
                      <span className="text-xs font-mono font-bold text-dark-text">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-teal-600 h-1.5 rounded-full"
                        style={{ width: `${(item.count / DISTRICT_BRIEFING.totalAlerts) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Boundary Proximity Context Link */}
            <div className="p-3.5 bg-rose-50/50 border border-rose-100 rounded-xl text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-bold text-rose-950">
                  Boundary Proximity Incident Records
                </div>
                <p className="text-rose-900 leading-relaxed">
                  Incident metrics shown above are aggregated from live geofencing alarms. For individual vessel telemetry and detailed radar track logs, access the{" "}
                  <Link href="/dashboard?scope=zones" className="font-semibold text-rose-950 underline hover:text-black">
                    Zone &amp; Boundary Watch section
                  </Link>.
                </p>
              </div>
            </div>
          </div>

          {/* Research Analytics Routing Anchor (Strict Requirement) */}
          <div className="p-4 bg-gradient-to-r from-indigo-50/80 to-blue-50/80 border border-indigo-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-subtle">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-950">
                  Need Climatological Anomaly Scans or Multi-Month Historical Trends?
                </span>
                <span className="text-[10px] font-bold bg-indigo-200/80 text-indigo-900 px-2 py-0.5 rounded-full">
                  Research Analytics
                </span>
              </div>
              <p className="text-xs text-indigo-900/80">
                For detailed historical trends, seasonal SST baseline anomalies, and multi-month comparisons, use the dedicated Research Analytics workspace.
              </p>
            </div>

            <Link
              href="/dashboard/research"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-[9px] text-xs font-medium transition-colors border border-indigo-200 bg-white text-indigo-900 hover:bg-indigo-50 h-8 px-3 shrink-0 gap-1.5 shadow-subtle select-none"
            >
              <span>Launch Research Analytics</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
