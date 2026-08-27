"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  MapPin,
  AlertTriangle,
  Waves,
  Wind,
  Zap,
  CloudLightning,
  Shield,
  Clock,
  Database,
  CheckCircle2,
  ChevronDown,
  Layers,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CoastalNavHeader } from "./coastal-nav-header";
import {
  PREDEFINED_REGIONS,
  PredefinedRegion,
  REGION_HAZARD_OVERVIEWS,
  SEVERITY_CONFIG,
  HazardStatus,
  SeverityLevel,
} from "@/mocks/coastalAuthorityMocks";

export const JurisdictionOverview: React.FC = () => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>("gulf_mannar");
  const [regionSearch, setRegionSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedRegion = useMemo(() => {
    return (
      PREDEFINED_REGIONS.find((r) => r.id === selectedRegionId) ||
      PREDEFINED_REGIONS[0]
    );
  }, [selectedRegionId]);

  const filteredRegions = useMemo(() => {
    if (!regionSearch.trim()) return PREDEFINED_REGIONS;
    return PREDEFINED_REGIONS.filter(
      (r) =>
        r.name.toLowerCase().includes(regionSearch.toLowerCase()) ||
        r.description.toLowerCase().includes(regionSearch.toLowerCase())
    );
  }, [regionSearch]);

  const overviewData = useMemo(() => {
    return (
      REGION_HAZARD_OVERVIEWS[selectedRegionId] || {
        regionId: selectedRegionId,
        regionName: selectedRegion.name,
        overallStatus: "moderate" as SeverityLevel,
        activeAlertCount: 1,
        hazards: [
          {
            type: "wave",
            label: "Wave Height",
            severity: "moderate",
            value: "1.8",
            unit: "m",
            source: "INCOIS_OSF",
            timestamp: "2024-07-28T06:30:00Z",
            confidence: 0.9,
          },
          {
            type: "wind",
            label: "Surface Wind",
            severity: "low",
            value: "14",
            unit: "kts",
            source: "IMD_BULLETIN",
            timestamp: "2024-07-28T06:00:00Z",
            confidence: 0.88,
          },
          {
            type: "cyclone",
            label: "Cyclonic Activity",
            severity: "low",
            value: "None",
            unit: "",
            source: "IMD_BULLETIN",
            timestamp: "2024-07-28T05:30:00Z",
            confidence: 0.95,
          },
          {
            type: "lightning",
            label: "Lightning Risk",
            severity: "moderate",
            value: "Moderate",
            unit: "",
            source: "IMD_BULLETIN",
            timestamp: "2024-07-28T06:15:00Z",
            confidence: 0.82,
          },
        ] as HazardStatus[],
        lastUpdated: "2024-07-28T06:30:00Z",
      }
    );
  }, [selectedRegionId, selectedRegion]);

  const severityStyle = SEVERITY_CONFIG[overviewData.overallStatus];

  const getHazardIcon = (type: string) => {
    switch (type) {
      case "wave":
        return <Waves className="w-4 h-4 text-blue-600" />;
      case "wind":
        return <Wind className="w-4 h-4 text-amber-600" />;
      case "cyclone":
        return <Zap className="w-4 h-4 text-rose-600" />;
      case "lightning":
        return <CloudLightning className="w-4 h-4 text-indigo-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-dark-muted" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      <CoastalNavHeader
        activeTab="hazard-overview"
        title="Jurisdiction Hazard Overview"
        subtitle="Live multi-sensor hazard status, active alerts, and evidence attribution across coastal regions."
        showBackButton={true}
        backHref="/dashboard/coastal-authority"
      />

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Back Link & Header */}
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard/coastal-authority"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Back to Coastal Authority</span>
            </Link>

            <div className="text-[11px] text-dark-muted flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-dark-light" />
              <span>Last Synchronized: {new Date(overviewData.lastUpdated).toLocaleTimeString()} IST</span>
            </div>
          </div>

          {/* Region / District Search & Autocomplete Selector */}
          <div className="bg-white border border-border rounded-xl p-4 shadow-subtle relative z-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-dark-muted flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  Select Coastal Jurisdiction / District
                </label>
                <p className="text-xs text-dark-muted">
                  Search named coastal boundaries, districts, and maritime operational zones.
                </p>
              </div>

              {/* Autocomplete Input */}
              <div className="relative w-full md:w-80">
                <div className="relative">
                  <Search className="w-4 h-4 text-dark-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search region (e.g. Gulf of Mannar)..."
                    value={regionSearch}
                    onFocus={() => setIsDropdownOpen(true)}
                    onChange={(e) => {
                      setRegionSearch(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    className="w-full pl-9 pr-8 py-2 text-xs bg-gray-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-dark-text"
                  />
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark-text"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Dropdown Options */}
                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-border rounded-xl shadow-dropdown max-h-60 overflow-y-auto py-1 z-30">
                    {filteredRegions.length === 0 ? (
                      <div className="px-3 py-2 text-xs text-dark-muted">No regions matched</div>
                    ) : (
                      filteredRegions.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => {
                            setSelectedRegionId(r.id);
                            setRegionSearch(r.name);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-teal-50/50 transition-colors ${
                            selectedRegionId === r.id
                              ? "bg-teal-50 text-teal-900 font-semibold"
                              : "text-dark-text"
                          }`}
                        >
                          <div>
                            <div className="font-medium">{r.name}</div>
                            <div className="text-[10px] text-dark-muted">{r.description}</div>
                          </div>
                          {selectedRegionId === r.id && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main 2-Column Content: Map Overlay + Summary Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Map Section with Hazard Overlays (7 Cols) */}
            <div className="lg:col-span-7 bg-white border border-border rounded-2xl p-5 shadow-card flex flex-col space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-dark-text">
                      Jurisdiction Map &amp; Hazard Overlay
                    </h3>
                    <p className="text-[11px] text-dark-muted">
                      {selectedRegion.name} • [{selectedRegion.coordinates[0]}°N, {selectedRegion.coordinates[1]}°E]
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold ${severityStyle.color} ${severityStyle.bg} ${severityStyle.border} border px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                  {severityStyle.label} Severity
                </span>
              </div>

              {/* Visual Map Representation with Color-Coded Overlays */}
              <div className="relative w-full h-80 bg-slate-900 rounded-xl overflow-hidden border border-border flex items-center justify-center">
                {/* SVG Bathymetry & Coastal Grid Simulation */}
                <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#38bdf8" strokeWidth="0.5" strokeOpacity="0.4" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  <path
                    d="M 50 200 C 150 180, 250 240, 400 210 C 550 180, 650 220, 800 200"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M 80 120 C 200 90, 320 140, 500 110 C 680 80, 750 130, 850 100"
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="1"
                    strokeOpacity="0.6"
                  />
                </svg>

                {/* Simulated Radar / Hazard Heatmap Overlay */}
                <div
                  className={`absolute w-48 h-48 rounded-full blur-2xl opacity-40 animate-pulse pointer-events-none ${
                    overviewData.overallStatus === "severe" || overviewData.overallStatus === "high"
                      ? "bg-rose-500"
                      : overviewData.overallStatus === "elevated"
                      ? "bg-amber-500"
                      : "bg-teal-500"
                  }`}
                />

                {/* Region Center Point & Markers */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                    <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center border-2 border-white shadow-lg">
                      <MapPin className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white px-3 py-1.5 rounded-lg text-center shadow-md">
                    <div className="text-xs font-bold text-teal-300">{selectedRegion.name}</div>
                    <div className="text-[10px] text-slate-300">
                      Coordinates: {selectedRegion.coordinates[0]}°N, {selectedRegion.coordinates[1]}°E
                    </div>
                  </div>
                </div>

                {/* Map Legend Overlay */}
                <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-sm border border-slate-800 rounded-lg p-2 text-[10px] text-slate-300 space-y-1">
                  <div className="font-semibold text-white">Hazard Overlay Legend</div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Low Hazard
                    <span className="w-2 h-2 rounded-full bg-amber-500 ml-1" /> Elevated Swell
                    <span className="w-2 h-2 rounded-full bg-rose-500 ml-1" /> Severe Warning
                  </div>
                </div>
              </div>

              {/* Cross-Section Guidance Note */}
              <div className="p-3 bg-teal-50/60 border border-teal-100 rounded-xl text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <p className="text-teal-900 leading-relaxed">
                  Hazard layers are updated in real time via satellite telemetry and coastal buoys. For official maritime boundary violations or geofence breaches in this zone, consult{" "}
                  <Link href="/dashboard?scope=zones" className="font-semibold text-teal-800 underline hover:text-teal-950">
                    Zone &amp; Boundary Watch
                  </Link>.
                </p>
              </div>
            </div>

            {/* Summary Panel & Evidence Blocks (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Overall Region Status Card */}
              <div className="bg-white border border-border rounded-2xl p-5 shadow-card space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-sm font-bold text-dark-text">
                    Jurisdiction Hazard Summary
                  </h3>
                  <Badge variant={overviewData.overallStatus === "high" || overviewData.overallStatus === "severe" ? "hazard" : overviewData.overallStatus === "elevated" ? "caution" : "safe"}>
                    {overviewData.activeAlertCount} Active Alerts
                  </Badge>
                </div>

                <div className="p-3.5 bg-gray-50 border border-border rounded-xl space-y-2">
                  <div className="text-xs font-semibold text-dark-muted">Overall Jurisdiction Status</div>
                  <div className="flex items-center gap-2">
                    <span className={`text-base font-bold uppercase ${severityStyle.color}`}>
                      {overviewData.overallStatus} Hazard Level
                    </span>
                  </div>
                  <p className="text-xs text-dark-muted leading-relaxed">
                    {overviewData.overallStatus === "elevated" || overviewData.overallStatus === "high"
                      ? "Elevated wave action and lightning activity detected. Advise non-mechanized craft to hold departure."
                      : "General marine conditions are within normal operational thresholds for coastal navigation."}
                  </p>
                </div>

                {/* Breakdown by Hazard Type */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-dark-text uppercase tracking-wider">
                    Hazard Breakdown by Sensor Type
                  </div>

                  <div className="space-y-2">
                    {overviewData.hazards.map((h) => {
                      const hStyle = SEVERITY_CONFIG[h.severity];
                      return (
                        <div
                          key={h.type}
                          className="p-3 bg-white border border-border hover:border-gray-300 rounded-xl transition-all space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-gray-50 border border-border rounded-lg">
                                {getHazardIcon(h.type)}
                              </div>
                              <div>
                                <div className="text-xs font-bold text-dark-text">{h.label}</div>
                                <div className="text-[10px] text-dark-muted">
                                  Observed: <strong className="text-dark-text">{h.value} {h.unit}</strong>
                                </div>
                              </div>
                            </div>

                            <span className={`text-[10px] font-bold ${hStyle.color} ${hStyle.bg} ${hStyle.border} border px-2 py-0.5 rounded-full uppercase`}>
                              {hStyle.label}
                            </span>
                          </div>

                          {/* Evidence Block: Source / Timestamp / Confidence */}
                          <div className="pt-2 border-t border-border/70 flex items-center justify-between text-[10px] text-dark-muted">
                            <span className="flex items-center gap-1">
                              <Database className="w-3 h-3 text-dark-light" />
                              Source: <strong className="text-dark-text">{h.source}</strong>
                            </span>
                            <span>Confidence: <strong className="text-teal-700">{(h.confidence * 100).toFixed(0)}%</strong></span>
                            <span>{new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
