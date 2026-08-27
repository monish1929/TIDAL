"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  GitBranch,
  TableProperties,
  MessageSquare,
  Send,
  AlertTriangle,
  Info,
  ArrowUpDown,
  Search,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  ScatterChart,
  Scatter,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  RESEARCH_VARIABLES,
  PREDEFINED_REGIONS,
  SST_ANOMALY_DATA,
  HISTORICAL_ALERT_MARKERS,
  SST_CHLOROPHYLL_CORRELATION,
  ZONE_SCAN_RESULTS,
  AnomalyDataPoint,
  UserDataset,
} from "@/mocks/researchMocks";

type AnalysisMode = "trend_anomaly" | "correlation_lag" | "scan";

interface StatisticalAnalysisProps {
  userDatasets: UserDataset[];
}

export const StatisticalAnalysis: React.FC<StatisticalAnalysisProps> = ({
  userDatasets,
}) => {
  const router = useRouter();
  const [mode, setMode] = useState<AnalysisMode>("trend_anomaly");
  const [selectedVar, setSelectedVar] = useState("sst");
  const [selectedVar2, setSelectedVar2] = useState("chlorophyll");
  const [region, setRegion] = useState("Gulf of Mannar");
  const [regionSearch, setRegionSearch] = useState("");
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [lagOffset, setLagOffset] = useState(5);
  const [localQuery, setLocalQuery] = useState("");

  const filteredRegions = useMemo(() => {
    if (!regionSearch) return PREDEFINED_REGIONS;
    return PREDEFINED_REGIONS.filter((r) =>
      r.name.toLowerCase().includes(regionSearch.toLowerCase())
    );
  }, [regionSearch]);

  const allVars = useMemo(() => {
    const base = [...RESEARCH_VARIABLES];
    userDatasets
      .filter((d) => d.status === "ready")
      .forEach((d) => {
        base.push({
          id: `user_${d.id}`,
          label: d.variableName,
          unit: "custom",
          color: "#a855f7",
        });
      });
    return base;
  }, [userDatasets]);

  // Anomaly chart data (memoized)
  const anomalyChartData = useMemo(
    () =>
      SST_ANOMALY_DATA.map((pt) => ({
        date: pt.date.slice(5),
        fullDate: pt.date,
        actual: pt.value,
        baseline: pt.baseline,
        zScore: pt.zScore,
        isFlagged: pt.isFlagged,
      })),
    []
  );

  // Find flagged anomaly period boundaries for ReferenceArea (memoized)
  const flaggedStart = useMemo(
    () => SST_ANOMALY_DATA.find((pt) => pt.isFlagged)?.date.slice(5),
    []
  );
  const flaggedEnd = useMemo(
    () => [...SST_ANOMALY_DATA].reverse().find((pt) => pt.isFlagged)?.date.slice(5),
    []
  );

  // Optimal correlation (memoized)
  const optimalCorr = useMemo(
    () =>
      SST_CHLOROPHYLL_CORRELATION.reduce((best, c) =>
        Math.abs(c.coefficient) > Math.abs(best.coefficient) ? c : best
      ),
    []
  );

  const MODES: { id: AnalysisMode; label: string; icon: React.ReactNode }[] = [
    { id: "trend_anomaly", label: "Trend / Anomaly", icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: "correlation_lag", label: "Correlation / Lag", icon: <GitBranch className="w-3.5 h-3.5" /> },
    { id: "scan", label: "Multi-Zone Scan", icon: <TableProperties className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── MODE TABS ── */}
      <div className="flex items-center gap-1 p-3 border-b border-border bg-gray-50/50 shrink-0">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              mode === m.id
                ? "bg-white border border-border text-dark-text shadow-subtle font-semibold"
                : "text-dark-muted hover:text-dark-text hover:bg-gray-100"
            }`}
          >
            {m.icon}
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* ── CONTROL PANEL ── */}
      <div className="p-3 border-b border-border bg-white shrink-0">
        <div className="flex flex-wrap items-end gap-3">
          {/* Variable 1 */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-dark-muted block">
              {mode === "correlation_lag" ? "Variable A" : "Variable"}
            </label>
            <select
              value={selectedVar}
              onChange={(e) => setSelectedVar(e.target.value)}
              className="h-8 px-2.5 text-xs rounded-lg border border-border bg-white min-w-[160px]"
            >
              {allVars.map((v) => (
                <option key={v.id} value={v.id}>{v.label}</option>
              ))}
            </select>
          </div>

          {/* Variable 2 (Correlation mode) */}
          {mode === "correlation_lag" && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-dark-muted block">
                Variable B
              </label>
              <select
                value={selectedVar2}
                onChange={(e) => setSelectedVar2(e.target.value)}
                className="h-8 px-2.5 text-xs rounded-lg border border-border bg-white min-w-[160px]"
              >
                {allVars.filter((v) => v.id !== selectedVar).map((v) => (
                  <option key={v.id} value={v.id}>{v.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Region */}
          {mode !== "scan" && (
            <div className="space-y-1 relative min-w-[170px]">
              <label className="text-[10px] font-bold uppercase tracking-wider text-dark-muted block">
                Region
              </label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark-muted" />
                <input
                  type="text"
                  value={regionSearch || region}
                  onChange={(e) => {
                    setRegionSearch(e.target.value);
                    setShowRegionDropdown(true);
                  }}
                  onFocus={() => setShowRegionDropdown(true)}
                  className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-border bg-white focus:border-primary outline-none"
                  placeholder="Search regions..."
                />
                {showRegionDropdown && filteredRegions.length > 0 && (
                  <div className="absolute z-30 top-full mt-1 w-full bg-white border border-border rounded-lg shadow-dropdown max-h-40 overflow-y-auto py-1">
                    {filteredRegions.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setRegion(r.name);
                          setRegionSearch("");
                          setShowRegionDropdown(false);
                        }}
                        className={`w-full px-3 py-1.5 text-left text-xs hover:bg-blue-50 ${
                          region === r.name ? "bg-blue-50/80 font-semibold text-primary" : ""
                        }`}
                      >
                        {r.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Lag Slider (Correlation mode) */}
          {mode === "correlation_lag" && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-dark-muted block">
                Lag Offset: {lagOffset} days
              </label>
              <input
                type="range"
                min={0}
                max={10}
                value={lagOffset}
                onChange={(e) => setLagOffset(parseInt(e.target.value))}
                className="w-32 h-8 accent-primary"
              />
            </div>
          )}
        </div>
      </div>

      {/* ── OUTPUT AREA ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ─── TREND / ANOMALY ─── */}
        {mode === "trend_anomaly" && (
          <>
            {/* Data class & Source badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-dark-text">
                  SST vs Seasonal Baseline — {region}
                </span>
                <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-semibold text-slate-700">
                  Historical Telemetry
                </span>
              </div>

              {/* Explicit Empirical vs Hypothesized Legend Pill (Requirement 5) */}
              <div className="flex items-center gap-3 text-[10px] text-dark-muted font-medium bg-gray-50 border border-border px-2.5 py-1 rounded-lg">
                <div className="flex items-center gap-1.5 text-dark-text">
                  <span className="w-3.5 h-0.5 bg-rose-500 inline-block rounded" />
                  <span>Solid: <strong>Empirical In-Situ</strong></span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-3.5 h-0.5 border-b-2 border-dashed border-slate-500 inline-block" />
                  <span>Dashed: <strong>Hypothesized Baseline</strong></span>
                </div>
              </div>
            </div>

            {/* Main Anomaly Chart */}
            <div className="bg-white border border-border rounded-xl shadow-subtle p-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={anomalyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ fontSize: "11px", borderRadius: "8px", borderColor: "#e2e8f0" }}
                      formatter={(value: any, name: any) => [
                        `${Number(value).toFixed(2)}°C`,
                        name === "actual" ? "Observed SST (Empirical)" : "Seasonal Baseline (Hypothesized)",
                      ]}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    {/* Flagged anomaly period shading */}
                    {flaggedStart && flaggedEnd && (
                      <ReferenceArea
                        x1={flaggedStart}
                        x2={flaggedEnd}
                        fill="#fecaca"
                        fillOpacity={0.3}
                        stroke="#ef4444"
                        strokeDasharray="3 3"
                      />
                    )}
                    {/* Alert markers */}
                    {HISTORICAL_ALERT_MARKERS.map((marker) => (
                      <ReferenceLine
                        key={marker.date}
                        x={marker.date.slice(5)}
                        stroke={
                          marker.type === "heatwave_advisory" ? "#ef4444" :
                          marker.type === "high_wave_alert" ? "#f59e0b" : "#6b7280"
                        }
                        strokeDasharray="4 4"
                        strokeWidth={1.5}
                        label={{
                          value: marker.label,
                          position: "top",
                          fill: "#64748b",
                          fontSize: 8,
                        }}
                      />
                    ))}
                    <Line type="monotone" dataKey="baseline" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Seasonal Baseline (Hypothesized)" />
                    <Line type="monotone" dataKey="actual" stroke="#ef4444" strokeWidth={2.5} dot={false} name="Observed SST (Empirical)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Flagged Periods Summary */}
            <div className="bg-white border border-border rounded-xl shadow-subtle p-3 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-dark-muted flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  <span>Statistically Flagged Anomaly Periods (|z| &gt; 2.0)</span>
                </div>
                <span className="text-[9px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                  Hypothesized Outlier Zone
                </span>
              </div>
              <div className="space-y-1">
                {SST_ANOMALY_DATA.filter((pt) => pt.isFlagged).map((pt) => (
                  <div
                    key={pt.date}
                    className="flex items-center justify-between px-3 py-1.5 bg-rose-50/60 border border-rose-100 rounded-lg text-xs"
                  >
                    <span className="font-mono text-dark-text">{pt.date}</span>
                    <span className="text-dark-text">
                      Observed: <strong>{pt.value}°C</strong> vs Baseline: {pt.baseline}°C
                    </span>
                    <span className="font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded text-[10px]">
                      z = {pt.zScore > 0 ? "+" : ""}{pt.zScore}
                    </span>
                    <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[9px] font-semibold text-slate-700">
                      {pt.dataClass}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ─── CORRELATION / LAG ─── */}
        {mode === "correlation_lag" && (
          <>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-dark-text">
                {allVars.find((v) => v.id === selectedVar)?.label} vs{" "}
                {allVars.find((v) => v.id === selectedVar2)?.label} — {region}
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-semibold text-slate-700">
                  Historical
                </span>
              </div>
            </div>

            {/* Correlation Coefficient at Each Lag */}
            <div className="bg-white border border-border rounded-xl shadow-subtle p-4">
              <div className="text-xs font-semibold text-dark-text mb-2">
                Pearson Correlation Coefficient by Lag Offset
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SST_CHLOROPHYLL_CORRELATION}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="lag"
                      tick={{ fontSize: 10, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                      label={{ value: "Lag (days)", position: "bottom", fontSize: 10, fill: "#64748b", offset: -5 }}
                    />
                    <YAxis
                      domain={[0, 1]}
                      tick={{ fontSize: 10, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{ fontSize: "11px", borderRadius: "8px", borderColor: "#e2e8f0" }}
                      formatter={(value: any) => [`r = ${Number(value).toFixed(2)}`, "Correlation"]}
                    />
                    <Bar
                      dataKey="coefficient"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      name="Pearson r"
                    />
                    <ReferenceLine y={0.7} stroke="#22c55e" strokeDasharray="4 4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Computed Results Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white border border-border rounded-xl shadow-subtle p-3 text-center">
                <div className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">
                  Optimal Lag
                </div>
                <div className="text-2xl font-bold text-primary mt-1">
                  {optimalCorr.lag} days
                </div>
              </div>
              <div className="bg-white border border-border rounded-xl shadow-subtle p-3 text-center">
                <div className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">
                  Peak Correlation (r)
                </div>
                <div className="text-2xl font-bold text-emerald-700 mt-1">
                  {optimalCorr.coefficient.toFixed(2)}
                </div>
              </div>
              <div className="bg-white border border-border rounded-xl shadow-subtle p-3 text-center">
                <div className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">
                  Current Lag Selection
                </div>
                <div className="text-2xl font-bold text-dark-text mt-1">
                  r = {(SST_CHLOROPHYLL_CORRELATION.find((c) => c.lag === lagOffset)?.coefficient || 0).toFixed(2)}
                </div>
                <div className="text-[10px] text-dark-muted mt-0.5">at {lagOffset}-day offset</div>
              </div>
            </div>
          </>
        )}

        {/* ─── MULTI-ZONE SCAN (TABLE, NOT CHART) ─── */}
        {mode === "scan" && (
          <>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-dark-text">
                SST Anomaly Scan — All Predefined Zones (Sorted by |z-score|)
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-semibold text-slate-700">
                  Historical
                </span>
                <span className="text-[10px] text-dark-muted">
                  Answers: "Where should I be looking?"
                </span>
              </div>
            </div>

            <div className="bg-white border border-border rounded-xl shadow-subtle overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-gray-50">
                    <th className="px-3 py-2 text-left font-bold text-dark-muted">#</th>
                    <th className="px-3 py-2 text-left font-bold text-dark-muted">Zone</th>
                    <th className="px-3 py-2 text-right font-bold text-dark-muted">Current</th>
                    <th className="px-3 py-2 text-right font-bold text-dark-muted">Baseline</th>
                    <th className="px-3 py-2 text-right font-bold text-dark-muted">
                      <span className="flex items-center justify-end gap-1">
                        z-score
                        <ArrowUpDown className="w-3 h-3" />
                      </span>
                    </th>
                    <th className="px-3 py-2 text-left font-bold text-dark-muted">Source</th>
                    <th className="px-3 py-2 text-left font-bold text-dark-muted">Class</th>
                    <th className="px-3 py-2 text-center font-bold text-dark-muted w-16">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {ZONE_SCAN_RESULTS.map((zone, i) => {
                    const severity =
                      Math.abs(zone.zScore) >= 3.0
                        ? "bg-rose-50 text-rose-800 border-rose-200"
                        : Math.abs(zone.zScore) >= 2.0
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-gray-50 text-dark-text border-border";
                    return (
                      <tr
                        key={zone.zoneId}
                        onClick={() => router.push(`/dashboard/research/zone/${zone.zoneId}`)}
                        className={`border-b border-border/50 hover:bg-blue-50/60 cursor-pointer transition-colors group ${
                          Math.abs(zone.zScore) >= 2.0 ? "bg-rose-50/20" : ""
                        }`}
                        title={`Click to view deep analytical detail for ${zone.zoneName}`}
                      >
                        <td className="px-3 py-2 text-dark-muted font-mono">{i + 1}</td>
                        <td className="px-3 py-2 font-semibold text-dark-text group-hover:text-primary transition-colors">
                          <div className="flex items-center gap-1.5">
                            <span>{zone.zoneName}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-right font-bold text-dark-text">
                          {zone.currentValue} {zone.unit}
                        </td>
                        <td className="px-3 py-2 text-right text-dark-muted">
                          {zone.baselineValue} {zone.unit}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${severity}`}
                          >
                            {zone.zScore > 0 ? "+" : ""}{zone.zScore.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-dark-muted text-[10px]">{zone.source}</td>
                        <td className="px-3 py-2">
                          <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[9px] font-semibold text-slate-700 capitalize">
                            {zone.dataClass}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className="inline-flex items-center justify-center p-1 rounded-md text-dark-muted group-hover:text-primary group-hover:bg-blue-100/70 transition-colors">
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-dark-muted px-1">
              <Info className="w-3 h-3 shrink-0" />
              <span>
                Zones with |z| ≥ 2.0 are highlighted. This table identifies
                regions warranting further investigation — it does not provide
                an interpretation or recommendation.
              </span>
            </div>
          </>
        )}
      </div>

      {/* ── LOCAL QUERY FIELD ── */}
      <div className="p-3 border-t border-border bg-white shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[10px] text-dark-muted shrink-0">
            <MessageSquare className="w-3 h-3" />
            <span>Focused query:</span>
          </div>
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="e.g. 'What z-score threshold is standard for marine SST?' — compound questions → Main Chat"
            className="flex-1 h-7 px-2.5 text-[11px] rounded-md border border-border bg-gray-50 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
          />
          <Button size="sm" className="h-7 px-2.5 text-[10px]" disabled={!localQuery.trim()}>
            <Send className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
