"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Calendar,
  ChevronDown,
  Layers,
  BarChart3,
  GitCompareArrows,
  Database,
  MessageSquare,
  Send,
  X,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  RESEARCH_VARIABLES,
  PREDEFINED_REGIONS,
  SST_SINGLE_MODE_DATA,
  SST_OVERLAY_DATA,
  CHLOROPHYLL_OVERLAY_DATA,
  ResearchDataPoint,
  ResearchVariable,
  UserDataset,
} from "@/mocks/researchMocks";

type ExplorerMode = "single" | "overlay" | "compare";

interface DataExplorerProps {
  userDatasets: UserDataset[];
}

export const DataExplorer: React.FC<DataExplorerProps> = ({ userDatasets }) => {
  const [mode, setMode] = useState<ExplorerMode>("single");
  const [selectedVars, setSelectedVars] = useState<string[]>(["sst"]);
  const [region, setRegion] = useState("Gulf of Mannar");
  const [regionSearch, setRegionSearch] = useState("");
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [compareRegion, setCompareRegion] = useState("Palk Strait");
  const [dateFrom, setDateFrom] = useState("2024-07-01");
  const [dateTo, setDateTo] = useState("2024-07-30");
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

  const toggleVar = (id: string) => {
    if (mode === "single") {
      setSelectedVars([id]);
    } else {
      setSelectedVars((prev) =>
        prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
      );
    }
  };

  // Build chart data
  const chartData = useMemo(() => {
    return SST_SINGLE_MODE_DATA.map((pt, i) => {
      const row: any = { date: pt.date.slice(5) };
      if (selectedVars.includes("sst")) {
        row.sst = SST_OVERLAY_DATA[i]?.value ?? pt.value;
      }
      if (selectedVars.includes("chlorophyll")) {
        row.chlorophyll = CHLOROPHYLL_OVERLAY_DATA[i]?.value;
      }
      // For other vars, generate plausible synthetic values
      if (selectedVars.includes("wind_speed"))
        row.wind_speed = parseFloat((12 + Math.sin(i * 0.4) * 4 + (Math.random() - 0.5) * 2).toFixed(1));
      if (selectedVars.includes("wave_height"))
        row.wave_height = parseFloat((1.2 + Math.sin(i * 0.35) * 0.6 + (Math.random() - 0.5) * 0.2).toFixed(2));
      return row;
    });
  }, [selectedVars]);

  const activeVarMeta = allVars.filter((v) => selectedVars.includes(v.id));

  const MODES: { id: ExplorerMode; label: string; icon: React.ReactNode }[] = [
    { id: "single", label: "Single", icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: "overlay", label: "Overlay", icon: <Layers className="w-3.5 h-3.5" /> },
    { id: "compare", label: "Compare", icon: <GitCompareArrows className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── MODE TABS ── */}
      <div className="flex items-center gap-1 p-3 border-b border-border bg-gray-50/50 shrink-0">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              setMode(m.id);
              if (m.id === "single") setSelectedVars((prev) => [prev[0] || "sst"]);
            }}
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

        <span className="ml-auto text-[10px] text-dark-muted italic">
          {mode === "single"
            ? "One variable, one region, one date range"
            : mode === "overlay"
            ? "Multiple variables on the same axis"
            : "Two regions side by side"}
        </span>
      </div>

      {/* ── CONTROL PANEL ── */}
      <div className="p-3 border-b border-border bg-white shrink-0 space-y-3">
        <div className="flex flex-wrap items-end gap-3">
          {/* Variable Picker */}
          <div className="space-y-1 min-w-[200px]">
            <label className="text-[10px] font-bold uppercase tracking-wider text-dark-muted block">
              Variable{mode !== "single" ? "s" : ""}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {allVars.map((v) => {
                const isActive = selectedVars.includes(v.id);
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => toggleVar(v.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                      isActive
                        ? "bg-blue-50 border-primary text-primary font-semibold"
                        : "bg-gray-50 border-border text-dark-muted hover:bg-gray-100"
                    }`}
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-1.5"
                      style={{ backgroundColor: v.color }}
                    />
                    {v.label.split("(")[0].trim()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          {/* Region Selector */}
          <div className="space-y-1 relative min-w-[180px]">
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
                className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-border bg-white focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
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
                      className={`w-full px-3 py-1.5 text-left text-xs hover:bg-blue-50 transition-colors ${
                        region === r.name ? "bg-blue-50/80 font-semibold text-primary" : "text-dark-text"
                      }`}
                    >
                      <span className="font-medium">{r.name}</span>
                      <span className="text-[10px] text-dark-muted ml-1.5">— {r.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Compare region (Compare mode only) */}
          {mode === "compare" && (
            <div className="space-y-1 min-w-[180px]">
              <label className="text-[10px] font-bold uppercase tracking-wider text-dark-muted block">
                Compare Region
              </label>
              <select
                value={compareRegion}
                onChange={(e) => setCompareRegion(e.target.value)}
                className="h-8 px-2.5 text-xs rounded-lg border border-border bg-white"
              >
                {PREDEFINED_REGIONS.filter((r) => r.name !== region).map((r) => (
                  <option key={r.id} value={r.name}>{r.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Date Range */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-dark-muted block">
              Date Range
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-8 px-2 text-xs rounded-lg border border-border bg-white"
              />
              <span className="text-[10px] text-dark-muted">to</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-8 px-2 text-xs rounded-lg border border-border bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── CHART OUTPUT ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Source & Data Class Header */}
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-primary" />
            <span className="font-bold text-dark-text">
              {region} — {activeVarMeta.map((v) => v.label).join(" + ")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-semibold text-slate-700">
              Historical
            </span>
            <span className="text-[10px] text-dark-muted">
              Source: INCOIS_OSF{selectedVars.includes("chlorophyll") ? " / ISRO_OCM3" : ""}
            </span>
          </div>
        </div>

        {selectedVars.length === 0 ? (
          <div className="bg-white border border-border rounded-xl p-8 text-center space-y-3 shadow-subtle select-none">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-primary mx-auto">
              <Layers className="w-5 h-5" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h4 className="text-xs font-bold text-dark-text">No Variables Selected</h4>
              <p className="text-[11px] text-dark-muted leading-relaxed">
                Choose physical or biological variables above, or click a quick preset below to visualize real-time satellite telemetry.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSelectedVars(["sst"])}
                className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-semibold shadow-subtle transition-all"
              >
                + Sea Surface Temp (SST)
              </button>
              <button
                type="button"
                onClick={() => setSelectedVars(["chlorophyll"])}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-subtle transition-all"
              >
                + Chlorophyll-a
              </button>
              <button
                type="button"
                onClick={() => setSelectedVars(["wind_speed", "wave_height"])}
                className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-primary text-xs font-semibold shadow-subtle transition-all"
              >
                + Wind &amp; Wave Overlay
              </button>
            </div>
          </div>
        ) : mode === "compare" ? (
          /* COMPARE MODE: Two side-by-side charts */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[region, compareRegion].map((reg, idx) => (
              <div key={reg} className="bg-white border border-border rounded-xl shadow-subtle p-4 space-y-2">
                <div className="text-xs font-semibold text-dark-text">{reg}</div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.map((d, i) => ({
                      ...d,
                      // Offset second region values slightly for visual difference
                      ...(idx === 1 && selectedVars[0]
                        ? { [selectedVars[0]]: (d[selectedVars[0]] || 0) + (Math.random() - 0.3) * 0.5 }
                        : {}),
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px", borderColor: "#e2e8f0" }} />
                      {activeVarMeta.map((v) => (
                        <Area
                          key={v.id}
                          type="monotone"
                          dataKey={v.id}
                          stroke={v.color}
                          fill={v.color}
                          fillOpacity={0.1}
                          strokeWidth={2}
                          name={`${v.label} (${v.unit})`}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* SINGLE + OVERLAY MODE: Shared chart */
          <div className="bg-white border border-border rounded-xl shadow-subtle p-4 space-y-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  {selectedVars.length > 1 && (
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  )}
                  <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px", borderColor: "#e2e8f0" }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  {activeVarMeta.map((v, i) => (
                    <Line
                      key={v.id}
                      type="monotone"
                      dataKey={v.id}
                      stroke={v.color}
                      strokeWidth={2}
                      dot={false}
                      yAxisId={i === 0 ? "left" : selectedVars.length > 1 ? "right" : "left"}
                      name={`${v.label} (${v.unit})`}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Data Point Table (latest 5) */}
        <div className="bg-white border border-border rounded-xl shadow-subtle overflow-hidden">
          <div className="px-3 py-2 bg-gray-50 border-b border-border text-[10px] font-bold uppercase tracking-wider text-dark-muted">
            Recent Observations (Latest 5)
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-gray-50/50">
                <th className="px-3 py-1.5 text-left font-semibold text-dark-muted">Date</th>
                <th className="px-3 py-1.5 text-left font-semibold text-dark-muted">Variable</th>
                <th className="px-3 py-1.5 text-right font-semibold text-dark-muted">Value</th>
                <th className="px-3 py-1.5 text-left font-semibold text-dark-muted">Source</th>
                <th className="px-3 py-1.5 text-left font-semibold text-dark-muted">Class</th>
              </tr>
            </thead>
            <tbody>
              {SST_SINGLE_MODE_DATA.slice(-5).reverse().map((pt, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-gray-50/50">
                  <td className="px-3 py-1.5 font-mono text-dark-text">{pt.date}</td>
                  <td className="px-3 py-1.5 text-dark-text">SST</td>
                  <td className="px-3 py-1.5 text-right font-semibold text-dark-text">{pt.value} {pt.unit}</td>
                  <td className="px-3 py-1.5 text-dark-muted">{pt.source}</td>
                  <td className="px-3 py-1.5">
                    <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[9px] font-semibold text-slate-700 capitalize">
                      {pt.dataClass}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            placeholder="e.g. 'What's the confidence on this SST reading?' — compound questions → Main Chat"
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
