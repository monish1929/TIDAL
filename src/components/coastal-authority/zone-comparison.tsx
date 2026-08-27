"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  GitCompareArrows,
  AlertTriangle,
  Waves,
  Wind,
  Zap,
  CloudLightning,
  Shield,
  CheckSquare,
  Square,
  Info,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CoastalNavHeader } from "./coastal-nav-header";
import {
  ZONE_COMPARISON_DATA,
  ZoneRiskComparison,
  SEVERITY_CONFIG,
  SeverityLevel,
} from "@/mocks/coastalAuthorityMocks";

export const ZoneComparison: React.FC = () => {
  const [selectedZoneIds, setSelectedZoneIds] = useState<string[]>([
    "gulf_mannar",
    "chennai_coast",
    "palk_strait",
  ]);

  const toggleZone = (zoneId: string) => {
    if (selectedZoneIds.includes(zoneId)) {
      if (selectedZoneIds.length <= 2) {
        // Keep at least 2 zones for comparison
        return;
      }
      setSelectedZoneIds(selectedZoneIds.filter((id) => id !== zoneId));
    } else {
      setSelectedZoneIds([...selectedZoneIds, zoneId]);
    }
  };

  const comparedZones = useMemo(() => {
    return ZONE_COMPARISON_DATA.filter((z) => selectedZoneIds.includes(z.zoneId));
  }, [selectedZoneIds]);

  // Determine highest risk zone among selected
  const highestRiskScore = useMemo(() => {
    return Math.max(...comparedZones.map((z) => z.riskScore), 0);
  }, [comparedZones]);

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      <CoastalNavHeader
        activeTab="compare"
        title="Zone Hazard Comparison"
        subtitle="Side-by-side spatial risk comparison across jurisdictional zones at the current point in time."
        showBackButton={true}
        backHref="/dashboard/coastal-authority"
      />

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Back Link & Query Classification Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <Link
              href="/dashboard/coastal-authority"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Back to Coastal Authority</span>
            </Link>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cyan-50 border border-cyan-200 rounded-lg text-[11px] text-cyan-900 font-medium">
              <GitCompareArrows className="w-3.5 h-3.5 text-cyan-700" />
              <span>Spatial Cross-Zone Query (Instant Real-Time State)</span>
            </div>
          </div>

          {/* Multi-Zone Selection Control */}
          <div className="bg-white border border-border rounded-xl p-4 shadow-subtle space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-dark-muted flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-teal-600" />
                  Select Zones to Compare ({selectedZoneIds.length} Selected)
                </h3>
                <p className="text-xs text-dark-muted mt-0.5">
                  Toggle zones to include in the side-by-side risk assessment (minimum 2).
                </p>
              </div>

              <div className="text-[11px] text-dark-muted">
                Showing {comparedZones.length} of {ZONE_COMPARISON_DATA.length} available zones
              </div>
            </div>

            {/* Zone Pills Multi-Select */}
            <div className="flex flex-wrap gap-2 pt-1">
              {ZONE_COMPARISON_DATA.map((z) => {
                const isSelected = selectedZoneIds.includes(z.zoneId);
                return (
                  <button
                    key={z.zoneId}
                    type="button"
                    onClick={() => toggleZone(z.zoneId)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-2 transition-all ${
                      isSelected
                        ? "bg-teal-50 border-teal-300 text-teal-950 font-semibold shadow-subtle"
                        : "bg-white border-border text-dark-muted hover:border-gray-300 hover:text-dark-text"
                    }`}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-3.5 h-3.5 text-teal-600" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-dark-light" />
                    )}
                    <span>{z.zoneName}</span>
                    <span className="text-[10px] text-dark-muted font-mono">
                      ({z.riskScore})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comparison Cards Grid (Side-by-Side) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {comparedZones.map((z) => {
              const isHighest = z.riskScore === highestRiskScore && z.riskScore > 30;
              const riskColor =
                z.riskScore >= 60
                  ? "text-rose-700 bg-rose-50 border-rose-200"
                  : z.riskScore >= 40
                  ? "text-amber-700 bg-amber-50 border-amber-200"
                  : "text-emerald-700 bg-emerald-50 border-emerald-200";

              return (
                <div
                  key={z.zoneId}
                  className={`bg-white border rounded-2xl p-5 shadow-card space-y-4 transition-all duration-200 ${
                    isHighest
                      ? "border-rose-300 ring-2 ring-rose-200/60"
                      : "border-border hover:border-gray-300"
                  }`}
                >
                  {/* Zone Header */}
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-dark-text">{z.zoneName}</h4>
                      <p className="text-[11px] text-dark-muted">
                        {z.activeAlerts} active alerts in sector
                      </p>
                    </div>

                    {isHighest && (
                      <span className="text-[10px] font-bold text-rose-800 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        Highest Risk
                      </span>
                    )}
                  </div>

                  {/* Aggregate Risk Score Gauge */}
                  <div className="p-3 bg-gray-50 border border-border rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-dark-muted block">
                        Composite Risk Index
                      </span>
                      <span className="text-xs text-dark-muted">0 (Safe) to 100 (Severe)</span>
                    </div>

                    <div className={`px-3 py-1 rounded-lg border font-mono font-bold text-base ${riskColor}`}>
                      {z.riskScore} / 100
                    </div>
                  </div>

                  {/* Matrix of Sub-Hazard Conditions */}
                  <div className="space-y-2 text-xs">
                    <div className="text-[11px] font-bold text-dark-text uppercase tracking-wider">
                      Hazard Factor Status
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-white border border-border rounded-lg flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-dark-muted text-[11px]">
                          <Waves className="w-3.5 h-3.5 text-blue-500" />
                          Wave
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${SEVERITY_CONFIG[z.waveStatus].bg} ${SEVERITY_CONFIG[z.waveStatus].color}`}>
                          {z.waveStatus}
                        </span>
                      </div>

                      <div className="p-2 bg-white border border-border rounded-lg flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-dark-muted text-[11px]">
                          <Wind className="w-3.5 h-3.5 text-amber-500" />
                          Wind
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${SEVERITY_CONFIG[z.windStatus].bg} ${SEVERITY_CONFIG[z.windStatus].color}`}>
                          {z.windStatus}
                        </span>
                      </div>

                      <div className="p-2 bg-white border border-border rounded-lg flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-dark-muted text-[11px]">
                          <Zap className="w-3.5 h-3.5 text-rose-500" />
                          Cyclone
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${SEVERITY_CONFIG[z.cycloneStatus].bg} ${SEVERITY_CONFIG[z.cycloneStatus].color}`}>
                          {z.cycloneStatus}
                        </span>
                      </div>

                      <div className="p-2 bg-white border border-border rounded-lg flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-dark-muted text-[11px]">
                          <CloudLightning className="w-3.5 h-3.5 text-indigo-500" />
                          Lightning
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${SEVERITY_CONFIG[z.lightningStatus].bg} ${SEVERITY_CONFIG[z.lightningStatus].color}`}>
                          {z.lightningStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Guidance */}
                  <div className="pt-2 border-t border-border/70 text-[11px] text-dark-muted leading-relaxed">
                    {z.riskScore >= 60
                      ? "High hazard conditions present. Elevated monitoring advised."
                      : z.riskScore >= 40
                      ? "Moderate caution indicated. Monitor afternoon wave swell."
                      : "Favorable conditions. Standard operational state."}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Structured Comparative Table View */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-dark-text">
              Comprehensive Jurisdiction Risk Matrix
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-gray-50/75 text-dark-muted font-bold">
                    <th className="py-2.5 px-3">Zone Name</th>
                    <th className="py-2.5 px-3">Risk Score</th>
                    <th className="py-2.5 px-3">Wave Status</th>
                    <th className="py-2.5 px-3">Wind Status</th>
                    <th className="py-2.5 px-3">Cyclone Status</th>
                    <th className="py-2.5 px-3">Lightning</th>
                    <th className="py-2.5 px-3">Active Alerts</th>
                    <th className="py-2.5 px-3 text-right">Advisory Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {comparedZones.map((z) => {
                    const isHighest = z.riskScore === highestRiskScore && z.riskScore > 30;
                    return (
                      <tr
                        key={z.zoneId}
                        className={`hover:bg-gray-50/50 transition-colors ${
                          isHighest ? "bg-rose-50/30" : ""
                        }`}
                      >
                        <td className="py-2.5 px-3 font-semibold text-dark-text">
                          {z.zoneName}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold">
                          {z.riskScore}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${SEVERITY_CONFIG[z.waveStatus].bg} ${SEVERITY_CONFIG[z.waveStatus].color}`}>
                            {z.waveStatus}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${SEVERITY_CONFIG[z.windStatus].bg} ${SEVERITY_CONFIG[z.windStatus].color}`}>
                            {z.windStatus}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${SEVERITY_CONFIG[z.cycloneStatus].bg} ${SEVERITY_CONFIG[z.cycloneStatus].color}`}>
                            {z.cycloneStatus}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${SEVERITY_CONFIG[z.lightningStatus].bg} ${SEVERITY_CONFIG[z.lightningStatus].color}`}>
                            {z.lightningStatus}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-medium text-dark-text">
                          {z.activeAlerts}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {isHighest ? (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                              Elevated Action
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-dark-muted">
                              Normal
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Architectural Note: Spatial comparison distinction */}
          <div className="p-4 bg-white border border-border rounded-xl flex items-start gap-3 shadow-subtle">
            <div className="p-2 rounded-lg bg-teal-50 text-teal-700 border border-teal-100 shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div className="text-xs space-y-1">
              <h4 className="font-bold text-dark-text">
                Spatial vs. Climatological Comparison Distinction
              </h4>
              <p className="text-dark-muted leading-relaxed">
                This table performs a spatial comparison (same point in time across multiple geographic zones) as a standard operational query. For longitudinal temporal comparisons across historical months or seasons, navigate to{" "}
                <Link href="/dashboard/research/explorer" className="text-primary font-semibold hover:underline">
                  Research Analytics → Data Explorer
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
