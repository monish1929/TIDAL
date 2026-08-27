"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Layers,
  Download,
  AlertTriangle,
  Info,
  TrendingUp,
  Activity,
  Wind,
  Waves,
  Compass,
  Droplets,
  ExternalLink,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Legend,
} from "recharts";
import {
  getZoneDetailData,
  ZoneDetailData,
  HISTORICAL_ALERT_MARKERS,
} from "@/mocks/researchMocks";

interface ZoneDetailViewProps {
  zoneId: string;
  onBack?: () => void;
}

export const ZoneDetailView: React.FC<ZoneDetailViewProps> = ({
  zoneId,
  onBack,
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const zoneData: ZoneDetailData = useMemo(() => {
    return getZoneDetailData(zoneId);
  }, [zoneId]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/dashboard/research/statistics");
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Date",
      "Timestamp",
      "Observed_SST_Celsius",
      "Baseline_SST_Celsius",
      "zScore",
      "Chlorophyll_mg_m3",
      "Wind_Speed_kts",
      "Wave_Height_m",
      "Current_Speed_m_s",
      "Tide_Level_m",
      "Data_Class",
      "Source",
    ];

    const rows = zoneData.rawObservationRecords.map((r) => [
      r.date,
      r.timestamp,
      r.sst,
      r.baselineSST,
      r.zScore,
      r.chlorophyll,
      r.windSpeed,
      r.waveHeight,
      r.currentSpeed,
      r.tideLevel,
      r.dataClass,
      r.source,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zone_${zoneData.zoneId}_raw_data.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered raw records
  const filteredRecords = useMemo(() => {
    if (!searchTerm) return zoneData.rawObservationRecords;
    return zoneData.rawObservationRecords.filter(
      (r) =>
        r.date.includes(searchTerm) ||
        r.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.dataClass.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [zoneData, searchTerm]);

  // Anomaly chart prepared data
  const anomalyChartData = useMemo(() => {
    return zoneData.anomalySeries.map((pt) => ({
      date: pt.date.slice(5),
      fullDate: pt.date,
      actual: pt.value,
      baseline: pt.baseline,
      zScore: pt.zScore,
      isFlagged: pt.isFlagged,
    }));
  }, [zoneData]);

  // Find flagged anomaly period boundaries
  const flaggedStart = zoneData.anomalySeries.find((pt) => pt.isFlagged)?.date.slice(5);
  const flaggedEnd = [...zoneData.anomalySeries].reverse().find((pt) => pt.isFlagged)?.date.slice(5);

  const flaggedCount = zoneData.anomalySeries.filter((pt) => pt.isFlagged).length;

  const severityColor =
    Math.abs(zoneData.zScore) >= 3.0
      ? "bg-rose-50 text-rose-800 border-rose-200"
      : Math.abs(zoneData.zScore) >= 2.0
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-background p-4 lg:p-6 space-y-6">
      {/* ── TOP BREADCRUMB & BACK NAVIGATION ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 shrink-0">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-border text-xs font-semibold text-dark-text hover:bg-gray-50 hover:text-primary transition-colors shadow-subtle"
        >
          <ArrowLeft className="w-4 h-4 text-dark-muted" />
          <span>Back to Statistical Analysis Scan</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="text-xs h-8 gap-1.5 bg-white"
          >
            <Download className="w-3.5 h-3.5 text-primary" />
            <span>Export Zone CSV</span>
          </Button>
        </div>
      </div>

      {/* ── ZONE HEADER CARD ── */}
      <div className="bg-white border border-border rounded-xl shadow-subtle p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-bold text-dark-text tracking-tight">
                {zoneData.zoneName}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${severityColor}`}
              >
                z = {zoneData.zScore > 0 ? "+" : ""}
                {zoneData.zScore.toFixed(1)}{" "}
                {Math.abs(zoneData.zScore) >= 3.0
                  ? "• Extreme Deviation"
                  : Math.abs(zoneData.zScore) >= 2.0
                  ? "• Moderate Anomaly"
                  : "• Baseline Range"}
              </span>
              <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-semibold text-slate-700 uppercase tracking-wider">
                {zoneData.dataClass}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-dark-muted">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span className="font-mono">
                  {zoneData.coordinates[0].toFixed(2)}° N,{" "}
                  {zoneData.coordinates[1].toFixed(2)}° E
                </span>
              </span>
              <span>•</span>
              <span>{zoneData.description}</span>
              <span>•</span>
              <span>Source: <strong>{zoneData.source}</strong></span>
              <span>•</span>
              <span>Observed: {zoneData.timestamp}</span>
            </div>
          </div>

          {/* Key Metrics Quick Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50/80 p-3 rounded-xl border border-border shrink-0">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">
                Observed SST
              </div>
              <div className="text-sm font-bold text-dark-text mt-0.5">
                {zoneData.currentValue} {zoneData.unit}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">
                Baseline SST
              </div>
              <div className="text-sm font-bold text-dark-muted mt-0.5">
                {zoneData.baselineValue} {zoneData.unit}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">
                Anomaly Delta
              </div>
              <div className="text-sm font-bold text-rose-600 mt-0.5">
                {zoneData.currentValue - zoneData.baselineValue > 0 ? "+" : ""}
                {(zoneData.currentValue - zoneData.baselineValue).toFixed(2)} {zoneData.unit}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">
                Flagged Days
              </div>
              <div className="text-sm font-bold text-dark-text mt-0.5">
                {flaggedCount} / 30
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 1: FULL TREND / ANOMALY CHART ── */}
      <div className="bg-white border border-border rounded-xl shadow-subtle p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-dark-text flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              SST Anomaly vs Seasonal Baseline Time-Series
            </h2>
            <p className="text-xs text-dark-muted mt-0.5">
              30-day temporal progression comparing daily observed SST with 10-year climatological baseline. Shaded band indicates |z| &gt; 2.0.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-dark-muted font-medium bg-gray-50 border border-border px-2.5 py-1 rounded-lg">
            <span className="flex items-center gap-1.5 text-dark-text">
              <span className="w-3.5 h-0.5 bg-rose-500 rounded inline-block" />
              Solid: <strong>Observed SST (Empirical)</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3.5 h-0.5 border-b-2 border-dashed border-slate-500 inline-block" />
              Dashed: <strong>Hypothesized Baseline</strong>
            </span>
            {flaggedStart && flaggedEnd && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 text-rose-800">
                  <span className="w-2.5 h-2.5 bg-rose-100 border border-rose-300 rounded-sm inline-block" />
                  <strong>Hypothesized Anomaly (|z| &gt; 2)</strong>
                </span>
              </>
            )}
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={anomalyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fontSize: 10, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                unit="°C"
              />
              <Tooltip
                contentStyle={{
                  fontSize: "11px",
                  borderRadius: "8px",
                  borderColor: "#e2e8f0",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                formatter={(value: any, name: any) => [
                  `${Number(value).toFixed(2)}°C`,
                  name === "actual" ? "Observed SST" : "Seasonal Baseline",
                ]}
                labelFormatter={(label) => `Date: 2024-${label}`}
              />
              {/* Flagged anomaly period shading */}
              {flaggedStart && flaggedEnd && (
                <ReferenceArea
                  x1={flaggedStart}
                  x2={flaggedEnd}
                  fill="#fee2e2"
                  fillOpacity={0.4}
                  stroke="#f87171"
                  strokeDasharray="3 3"
                />
              )}
              {/* Historical Alert Markers */}
              {zoneData.alerts.map((alert) => (
                <ReferenceLine
                  key={alert.date}
                  x={alert.date.slice(5)}
                  stroke="#e11d48"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: alert.label,
                    position: "top",
                    fill: "#e11d48",
                    fontSize: 9,
                    fontWeight: "bold",
                  }}
                />
              ))}
              <Line
                type="monotone"
                dataKey="baseline"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Seasonal Baseline (Hypothesized)"
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ r: 2.5, fill: "#ef4444" }}
                name="Observed SST (Empirical In-Situ)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Anomaly Alerts List if any */}
        {zoneData.alerts.length > 0 && (
          <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-3 space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              Historical Marine Alert Markers in this Sector
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {zoneData.alerts.map((alert) => (
                <div
                  key={alert.date}
                  className="flex items-center justify-between px-3 py-1.5 bg-white border border-rose-100 rounded-lg text-xs"
                >
                  <div className="font-semibold text-rose-950">{alert.label}</div>
                  <div className="font-mono text-[10px] text-rose-700">{alert.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── SECTION 2: RAW MULTI-VARIABLE MINI-CHARTS (DATA EXPLORER SINGLE MODE) ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-dark-text flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              Raw Multi-Sensor Oceanographic Variables ({zoneData.zoneName})
            </h2>
            <p className="text-xs text-dark-muted mt-0.5">
              Independent raw parameters — strictly observational, no aggregated risk score or collapse.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. SST Mini Card */}
          <div className="bg-white border border-border rounded-xl shadow-subtle p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">
                  Sea Surface Temperature
                </span>
                <div className="text-xl font-bold text-dark-text mt-0.5">
                  {zoneData.variableMiniSeries.sst.value} {zoneData.variableMiniSeries.sst.unit}
                </div>
              </div>
              <span className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
                <Droplets className="w-4 h-4" />
              </span>
            </div>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={zoneData.variableMiniSeries.sst.data}>
                  <defs>
                    <linearGradient id="gradSst" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 2" stroke="#f8fafc" />
                  <XAxis dataKey="date" hide />
                  <YAxis domain={["auto", "auto"]} hide />
                  <Tooltip
                    contentStyle={{ fontSize: "10px", borderRadius: "6px" }}
                    formatter={(v: any) => [`${v} °C`, "SST"]}
                  />
                  <Area type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={1.5} fill="url(#gradSst)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-[10px] text-dark-muted pt-1 border-t border-border/60">
              <span>Source: {zoneData.variableMiniSeries.sst.source}</span>
              <span>{zoneData.variableMiniSeries.sst.timestamp.slice(0, 10)}</span>
            </div>
          </div>

          {/* 2. Chlorophyll Mini Card */}
          <div className="bg-white border border-border rounded-xl shadow-subtle p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">
                  Chlorophyll-a Concentration
                </span>
                <div className="text-xl font-bold text-emerald-700 mt-0.5">
                  {zoneData.variableMiniSeries.chlorophyll.value} {zoneData.variableMiniSeries.chlorophyll.unit}
                </div>
              </div>
              <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Activity className="w-4 h-4" />
              </span>
            </div>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={zoneData.variableMiniSeries.chlorophyll.data}>
                  <defs>
                    <linearGradient id="gradChl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 2" stroke="#f8fafc" />
                  <XAxis dataKey="date" hide />
                  <YAxis domain={["auto", "auto"]} hide />
                  <Tooltip
                    contentStyle={{ fontSize: "10px", borderRadius: "6px" }}
                    formatter={(v: any) => [`${v} mg/m³`, "Chlorophyll-a"]}
                  />
                  <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={1.5} fill="url(#gradChl)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-[10px] text-dark-muted pt-1 border-t border-border/60">
              <span>Source: {zoneData.variableMiniSeries.chlorophyll.source}</span>
              <span>{zoneData.variableMiniSeries.chlorophyll.timestamp.slice(0, 10)}</span>
            </div>
          </div>

          {/* 3. Surface Wind Speed Mini Card */}
          <div className="bg-white border border-border rounded-xl shadow-subtle p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">
                  Surface Wind Speed
                </span>
                <div className="text-xl font-bold text-amber-700 mt-0.5">
                  {zoneData.variableMiniSeries.windSpeed.value} {zoneData.variableMiniSeries.windSpeed.unit}
                </div>
              </div>
              <span className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                <Wind className="w-4 h-4" />
              </span>
            </div>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={zoneData.variableMiniSeries.windSpeed.data}>
                  <defs>
                    <linearGradient id="gradWind" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 2" stroke="#f8fafc" />
                  <XAxis dataKey="date" hide />
                  <YAxis domain={["auto", "auto"]} hide />
                  <Tooltip
                    contentStyle={{ fontSize: "10px", borderRadius: "6px" }}
                    formatter={(v: any) => [`${v} kts`, "Wind Speed"]}
                  />
                  <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={1.5} fill="url(#gradWind)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-[10px] text-dark-muted pt-1 border-t border-border/60">
              <span>Source: {zoneData.variableMiniSeries.windSpeed.source}</span>
              <span>{zoneData.variableMiniSeries.windSpeed.timestamp.slice(0, 10)}</span>
            </div>
          </div>

          {/* 4. Wave Height Mini Card */}
          <div className="bg-white border border-border rounded-xl shadow-subtle p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">
                  Significant Wave Height
                </span>
                <div className="text-xl font-bold text-blue-700 mt-0.5">
                  {zoneData.variableMiniSeries.waveHeight.value} {zoneData.variableMiniSeries.waveHeight.unit}
                </div>
              </div>
              <span className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                <Waves className="w-4 h-4" />
              </span>
            </div>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={zoneData.variableMiniSeries.waveHeight.data}>
                  <defs>
                    <linearGradient id="gradWave" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 2" stroke="#f8fafc" />
                  <XAxis dataKey="date" hide />
                  <YAxis domain={["auto", "auto"]} hide />
                  <Tooltip
                    contentStyle={{ fontSize: "10px", borderRadius: "6px" }}
                    formatter={(v: any) => [`${v} m`, "Wave Height"]}
                  />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={1.5} fill="url(#gradWave)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-[10px] text-dark-muted pt-1 border-t border-border/60">
              <span>Source: {zoneData.variableMiniSeries.waveHeight.source}</span>
              <span>{zoneData.variableMiniSeries.waveHeight.timestamp.slice(0, 10)}</span>
            </div>
          </div>

          {/* 5. Ocean Current Mini Card */}
          <div className="bg-white border border-border rounded-xl shadow-subtle p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">
                  Ocean Current Speed
                </span>
                <div className="text-xl font-bold text-purple-700 mt-0.5">
                  {zoneData.variableMiniSeries.currentSpeed.value} {zoneData.variableMiniSeries.currentSpeed.unit}
                </div>
              </div>
              <span className="p-2 rounded-lg bg-purple-50 text-purple-600 border border-purple-100">
                <Compass className="w-4 h-4" />
              </span>
            </div>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={zoneData.variableMiniSeries.currentSpeed.data}>
                  <defs>
                    <linearGradient id="gradCurr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 2" stroke="#f8fafc" />
                  <XAxis dataKey="date" hide />
                  <YAxis domain={["auto", "auto"]} hide />
                  <Tooltip
                    contentStyle={{ fontSize: "10px", borderRadius: "6px" }}
                    formatter={(v: any) => [`${v} m/s`, "Current Speed"]}
                  />
                  <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={1.5} fill="url(#gradCurr)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-[10px] text-dark-muted pt-1 border-t border-border/60">
              <span>Source: {zoneData.variableMiniSeries.currentSpeed.source}</span>
              <span>{zoneData.variableMiniSeries.currentSpeed.timestamp.slice(0, 10)}</span>
            </div>
          </div>

          {/* 6. Tide Level Mini Card */}
          <div className="bg-white border border-border rounded-xl shadow-subtle p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">
                  Tide Level (Hydrographic)
                </span>
                <div className="text-xl font-bold text-cyan-700 mt-0.5">
                  {zoneData.variableMiniSeries.tideLevel.value} {zoneData.variableMiniSeries.tideLevel.unit}
                </div>
              </div>
              <span className="p-2 rounded-lg bg-cyan-50 text-cyan-600 border border-cyan-100">
                <Activity className="w-4 h-4" />
              </span>
            </div>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={zoneData.variableMiniSeries.tideLevel.data}>
                  <defs>
                    <linearGradient id="gradTide" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 2" stroke="#f8fafc" />
                  <XAxis dataKey="date" hide />
                  <YAxis domain={["auto", "auto"]} hide />
                  <Tooltip
                    contentStyle={{ fontSize: "10px", borderRadius: "6px" }}
                    formatter={(v: any) => [`${v} m`, "Tide Level"]}
                  />
                  <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={1.5} fill="url(#gradTide)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-[10px] text-dark-muted pt-1 border-t border-border/60">
              <span>Source: {zoneData.variableMiniSeries.tideLevel.source}</span>
              <span>{zoneData.variableMiniSeries.tideLevel.timestamp.slice(0, 10)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 3: RAW OBSERVATION DATA TABLE ── */}
      <div className="bg-white border border-border rounded-xl shadow-subtle overflow-hidden space-y-0">
        <div className="px-5 py-3.5 bg-gray-50 border-b border-border flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-dark-text uppercase tracking-wider">
              Raw Zone Multi-Sensor Records ({filteredRecords.length} Rows)
            </h3>
            <p className="text-[11px] text-dark-muted mt-0.5">
              Complete sensor telemetry logs with explicit source attribution and data class.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark-muted" />
              <input
                type="text"
                placeholder="Filter by date, source..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 pl-8 pr-3 text-xs rounded-lg border border-border bg-white focus:border-primary outline-none w-48"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-gray-50/95 backdrop-blur-sm z-10">
              <tr className="border-b border-border text-dark-muted font-bold text-[11px]">
                <th className="px-3.5 py-2.5 text-left">Date / Timestamp</th>
                <th className="px-3.5 py-2.5 text-right">Observed SST</th>
                <th className="px-3.5 py-2.5 text-right">Baseline</th>
                <th className="px-3.5 py-2.5 text-right">z-Score</th>
                <th className="px-3.5 py-2.5 text-right">Chlorophyll</th>
                <th className="px-3.5 py-2.5 text-right">Wind</th>
                <th className="px-3.5 py-2.5 text-right">Wave</th>
                <th className="px-3.5 py-2.5 text-right">Current</th>
                <th className="px-3.5 py-2.5 text-right">Tide</th>
                <th className="px-3.5 py-2.5 text-left">Data Class</th>
                <th className="px-3.5 py-2.5 text-left">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredRecords.map((r) => {
                const isFlagged = Math.abs(r.zScore) >= 2.0;
                return (
                  <tr
                    key={r.date}
                    className={`hover:bg-gray-50/80 transition-colors ${
                      isFlagged ? "bg-rose-50/30 font-medium" : ""
                    }`}
                  >
                    <td className="px-3.5 py-2 font-mono text-dark-text text-[11px]">
                      {r.timestamp}
                    </td>
                    <td className="px-3.5 py-2 text-right font-bold text-dark-text">
                      {r.sst.toFixed(2)} °C
                    </td>
                    <td className="px-3.5 py-2 text-right text-dark-muted">
                      {r.baselineSST.toFixed(2)} °C
                    </td>
                    <td className="px-3.5 py-2 text-right">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          Math.abs(r.zScore) >= 3.0
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : Math.abs(r.zScore) >= 2.0
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {r.zScore > 0 ? "+" : ""}
                        {r.zScore.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-3.5 py-2 text-right font-mono text-emerald-700">
                      {r.chlorophyll.toFixed(3)}
                    </td>
                    <td className="px-3.5 py-2 text-right font-mono text-amber-700">
                      {r.windSpeed.toFixed(1)} kts
                    </td>
                    <td className="px-3.5 py-2 text-right font-mono text-blue-700">
                      {r.waveHeight.toFixed(2)} m
                    </td>
                    <td className="px-3.5 py-2 text-right font-mono text-purple-700">
                      {r.currentSpeed.toFixed(2)} m/s
                    </td>
                    <td className="px-3.5 py-2 text-right font-mono text-cyan-700">
                      {r.tideLevel.toFixed(2)} m
                    </td>
                    <td className="px-3.5 py-2">
                      <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[9px] font-semibold text-slate-700 uppercase">
                        {r.dataClass}
                      </span>
                    </td>
                    <td className="px-3.5 py-2 text-dark-muted font-mono text-[10px]">
                      {r.source}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-gray-50 border-t border-border flex items-center justify-between text-[11px] text-dark-muted">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            <span>
              All 30 daily observations are displayed without reduction. No safe/unsafe verdicts are computed.
            </span>
          </div>
          <span>Showing {filteredRecords.length} records</span>
        </div>
      </div>
    </div>
  );
};
