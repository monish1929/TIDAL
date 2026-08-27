"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Layers,
  BarChart3,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  Activity,
  AlertTriangle,
  Database,
  Calendar,
  Sparkles,
  Info,
  Droplets,
  Wind,
  Waves,
  Compass,
} from "lucide-react";

import {
  SST_SINGLE_MODE_DATA,
  ZONE_SCAN_RESULTS,
  SST_CHLOROPHYLL_CORRELATION,
  SAMPLE_USER_DATASET,
  UserDataset,
} from "@/mocks/researchMocks";
import { getStoredUserDatasets } from "@/lib/storage";
import { ResearchNavHeader } from "./research-nav-header";

export const ResearchLandingView: React.FC = () => {
  const router = useRouter();
  const [datasets, setDatasets] = useState<UserDataset[]>([SAMPLE_USER_DATASET]);

  useEffect(() => {
    const stored = getStoredUserDatasets();
    if (stored && stored.length > 0) {
      setDatasets(stored);
    }
  }, []);

  // Mini sparkline data for Data Explorer Card
  const sstSparkline = SST_SINGLE_MODE_DATA.map((d) => ({
    date: d.date.slice(5),
    value: d.value,
  }));

  // Most extreme anomaly zone for Statistical Analysis Card
  const topAnomalyZone = ZONE_SCAN_RESULTS[0];

  // Correlation preview for Statistical Analysis Card
  const corrMiniData = SST_CHLOROPHYLL_CORRELATION.slice(0, 6);

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* ── TOP HEADER / RESEARCH CONTEXT BANNER ── */}
      <ResearchNavHeader
        activeTab="overview"
        title="Research Analytics Workspace"
        subtitle="Explore raw multi-source oceanographic observations, compute climatological anomalies, and manage custom field datasets."
        datasetCount={datasets.length}
      />

      {/* ── MAIN LANDING CONTENT ── */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
        {/* Intro Banner */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl p-6 lg:p-8 text-white shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="max-w-2xl space-y-3 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Deep Marine Science &amp; Oceanographic Workspace</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
                Multi-Sensor Marine Intelligence &amp; Analytics
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Direct observational data access without automated decision collapsing. Inspect high-resolution satellite telemetry, perform statistical scans, and merge custom in-situ survey records.
              </p>
            </div>
          </div>
        </div>

        {/* ── THE 3 PRIMARY SUMMARY CARDS ── */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ── 1. DATA EXPLORER SUMMARY CARD ── */}
          <div
            onClick={() => router.push("/dashboard/research/explorer")}
            className="bg-white border border-border hover:border-primary/50 hover:shadow-lg rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer group space-y-5"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  3 Modes
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-dark-text group-hover:text-primary transition-colors">
                  Data Explorer
                </h3>
                <p className="text-xs text-dark-muted mt-1 leading-relaxed">
                  Explore raw marine variables — SST, chlorophyll, wind, wave, and more, over time and region.
                </p>
              </div>

              {/* Live Preview Component */}
              <div className="bg-gray-50/90 rounded-xl p-3.5 border border-border/80 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-dark-text flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-rose-500" />
                    SST Telemetry (Gulf of Mannar)
                  </span>
                  <span className="font-mono font-bold text-dark-text">
                    {sstSparkline[sstSparkline.length - 1].value} °C
                  </span>
                </div>

                {/* Mini Sparkline (Lightweight SVG) */}
                <div className="h-16 w-full flex items-center">
                  <svg className="w-full h-14 overflow-visible" viewBox="0 0 300 50" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="landingSstGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity="0.25" />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0,38 Q 30,35 60,32 T 120,24 T 180,18 T 240,28 T 300,12 L 300,50 L 0,50 Z"
                      fill="url(#landingSstGrad)"
                    />
                    <path
                      d="M 0,38 Q 30,35 60,32 T 120,24 T 180,18 T 240,28 T 300,12"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="300" cy="12" r="3.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                  </svg>
                </div>

                {/* Variable Pills */}
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="text-[9px] font-semibold bg-white border border-border px-1.5 py-0.5 rounded text-dark-muted">
                    SST (°C)
                  </span>
                  <span className="text-[9px] font-semibold bg-white border border-border px-1.5 py-0.5 rounded text-dark-muted">
                    Chlorophyll-a
                  </span>
                  <span className="text-[9px] font-semibold bg-white border border-border px-1.5 py-0.5 rounded text-dark-muted">
                    Wind &amp; Wave
                  </span>
                  <span className="text-[9px] font-semibold bg-white border border-border px-1.5 py-0.5 rounded text-dark-muted">
                    Current &amp; Tide
                  </span>
                </div>
              </div>
            </div>

            {/* Card Action Link */}
            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform">
              <span>Launch Data Explorer</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* ── 2. STATISTICAL ANALYSIS SUMMARY CARD ── */}
          <div
            onClick={() => router.push("/dashboard/research/statistics")}
            className="bg-white border border-border hover:border-amber-500/50 hover:shadow-lg rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer group space-y-5"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Anomaly Detection
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-dark-text group-hover:text-amber-700 transition-colors">
                  Statistical Analysis
                </h3>
                <p className="text-xs text-dark-muted mt-1 leading-relaxed">
                  Detect anomalies, correlations, and scan zones for unusual conditions.
                </p>
              </div>

              {/* Live Preview Component */}
              <div className="bg-gray-50/90 rounded-xl p-3.5 border border-border/80 space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-dark-text flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    Top Active Anomaly Scan
                  </span>
                  <span className="text-[10px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                    z = +{topAnomalyZone.zScore.toFixed(1)}
                  </span>
                </div>

                <div className="p-2 bg-rose-50/60 border border-rose-100 rounded-lg">
                  <div className="text-xs font-bold text-rose-950">
                    {topAnomalyZone.zoneName}
                  </div>
                  <div className="text-[10px] text-rose-800 mt-0.5">
                    Observed: <strong>{topAnomalyZone.currentValue}°C</strong> (Baseline: {topAnomalyZone.baselineValue}°C)
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-1.5 bg-white border border-border rounded text-center">
                    <span className="text-dark-muted block">Optimal Lag</span>
                    <span className="font-bold text-dark-text">5 Days (r=0.82)</span>
                  </div>
                  <div className="p-1.5 bg-white border border-border rounded text-center">
                    <span className="text-dark-muted block">Zones Tracked</span>
                    <span className="font-bold text-dark-text">8 Sectors</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Action Link */}
            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:translate-x-0.5 transition-transform">
              <span>Launch Statistical Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* ── 3. MY DATA SUMMARY CARD ── */}
          <div
            onClick={() => router.push("/dashboard/research/data")}
            className="bg-white border border-border hover:border-emerald-500/50 hover:shadow-lg rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer group space-y-5"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {datasets.length} Active
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-dark-text group-hover:text-emerald-700 transition-colors">
                  My Data
                </h3>
                <p className="text-xs text-dark-muted mt-1 leading-relaxed">
                  Upload and manage your own field datasets.
                </p>
              </div>

              {/* Live Preview Component */}
              <div className="bg-gray-50/90 rounded-xl p-3.5 border border-border/80 space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-dark-text flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-emerald-600" />
                    Latest Survey Dataset
                  </span>
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                    Ready
                  </span>
                </div>

                <div className="p-2 bg-white border border-border rounded-lg space-y-1">
                  <div className="text-xs font-bold text-dark-text truncate">
                    {datasets[0]?.name || "Coastal SST Field Campaign"}
                  </div>
                  <div className="text-[10px] text-dark-muted font-mono">
                    {datasets[0]?.fileName || "coastal_sst_field_2024.csv"} • {datasets[0]?.rowCount || 142} rows
                  </div>
                </div>

                <div className="text-[10px] text-dark-muted flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  <span>Integrated in Data Explorer &amp; Statistical Scans</span>
                </div>
              </div>
            </div>

            {/* Card Action Link */}
            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
              <span>Manage Custom Datasets</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* ── FOOTER PHILOSOPHY / METHODOLOGY NOTE ── */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white border border-border rounded-xl p-4 flex items-start gap-3 shadow-subtle">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div className="text-xs space-y-1">
              <h4 className="font-bold text-dark-text">
                TIDAL Research Mode Architectural Principle
              </h4>
              <p className="text-dark-muted leading-relaxed">
                Unlike operational fisherman briefings which summarize complex ocean dynamics into risk advisories, Research Analytics components expose raw multi-sensor telemetry with timestamp and source attribution intact. No verdicts or recommendations are computed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
