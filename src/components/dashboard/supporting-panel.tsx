"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Map as MapIcon,
  BarChart3,
  Layers,
  ChevronRight,
  Maximize2,
  Minimize2,
  Navigation,
  Compass,
  AlertTriangle,
  Anchor,
  Info,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DecisionResponse, TimeSeriesPoint, MapFeature } from "@/types/decision";

interface SupportingPanelProps {
  activeDecision: DecisionResponse;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const SupportingPanel: React.FC<SupportingPanelProps> = ({
  activeDecision,
  isOpen,
  onToggleOpen,
}) => {
  const [activeTab, setActiveTab] = useState<"map" | "charts" | "evidence">("map");
  const [selectedMapFeature, setSelectedMapFeature] = useState<MapFeature | null>(null);

  const timeSeries = activeDecision.timeSeriesData || [
    { time: "05:00", waveHeight: 1.1, windSpeed: 11, sst: 28.3 },
    { time: "08:00", waveHeight: 1.2, windSpeed: 12, sst: 28.5 },
    { time: "11:00", waveHeight: 1.4, windSpeed: 14, sst: 28.7 },
    { time: "14:00", waveHeight: 2.1, windSpeed: 19, sst: 29.0 },
    { time: "17:00", waveHeight: 2.6, windSpeed: 24, sst: 28.9 },
    { time: "20:00", waveHeight: 2.2, windSpeed: 18, sst: 28.6 },
  ];

  const mapFeatures: MapFeature[] = activeDecision.mapFeatures || [
    {
      id: "pfz_1",
      type: "PFZ_POINT",
      name: "High Chlorophyll PFZ Zone",
      coordinates: [79.42, 9.18],
      properties: { sst: "28.4°C", confidence: "96%" },
    },
    {
      id: "port_1",
      type: "PORT",
      name: "Departure Landing Jetty",
      coordinates: [79.31, 9.28],
      properties: { harbor: "Rameswaram" },
    },
    {
      id: "hazard_1",
      type: "HAZARD_ZONE",
      name: "Afternoon Wave Swell Area",
      coordinates: [79.6, 9.1],
      properties: { waveHeight: "2.4m" },
    },
  ];

  if (!isOpen) {
    return null;
  }

  return (
    <aside className="w-full xl:w-[420px] 2xl:w-[460px] shrink-0 bg-surface border-l border-border h-full flex flex-col justify-between overflow-hidden select-none z-20">
      {/* 1. PANEL HEADER & TAB SWITCHER */}
      <div className="p-3 border-b border-border bg-gray-50/70 shrink-0">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dark-muted">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>Supporting Marine Visualizer</span>
          </div>

          <button
            type="button"
            onClick={onToggleOpen}
            className="p-1 text-dark-muted hover:text-dark-text hover:bg-gray-200/60 rounded-md transition-colors"
            title="Collapse panel"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="grid grid-cols-3 p-0.5 bg-gray-200/70 rounded-lg border border-gray-300/60 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("map")}
            className={`py-1.5 rounded-md font-medium flex items-center justify-center gap-1 transition-all ${
              activeTab === "map"
                ? "bg-white text-dark-text shadow-subtle font-semibold"
                : "text-dark-muted hover:text-dark-text"
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>GIS Map</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("charts")}
            className={`py-1.5 rounded-md font-medium flex items-center justify-center gap-1 transition-all ${
              activeTab === "charts"
                ? "bg-white text-dark-text shadow-subtle font-semibold"
                : "text-dark-muted hover:text-dark-text"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Forecast</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("evidence")}
            className={`py-1.5 rounded-md font-medium flex items-center justify-center gap-1 transition-all ${
              activeTab === "evidence"
                ? "bg-white text-dark-text shadow-subtle font-semibold"
                : "text-dark-muted hover:text-dark-text"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Beliefs</span>
          </button>
        </div>
      </div>

      {/* 2. TAB CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: GIS MAP CANVAS */}
        {activeTab === "map" && (
          <div className="space-y-3">
            {/* Map Canvas Container */}
            <div className="relative w-full h-64 sm:h-72 rounded-xl bg-slate-900 border border-border overflow-hidden shadow-card flex flex-col justify-between p-3 text-white">
              {/* Clean Marine Cartography Background Pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent pointer-events-none" />

              {/* Map Layer Controls overlay */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800/90 border border-slate-700/80 rounded-md text-[11px] font-medium backdrop-blur-sm">
                  <Compass className="w-3.5 h-3.5 text-blue-400" />
                  <span>Gulf of Mannar / Palk Strait</span>
                </div>

                <Badge variant="blue" className="text-[10px] bg-blue-600/90 border-0">
                  MapLibre Vector Layer
                </Badge>
              </div>

              {/* Interactive Map Feature Pins */}
              <div className="relative z-10 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {mapFeatures.map((feat) => {
                    const isSelected = selectedMapFeature?.id === feat.id;
                    return (
                      <div
                        key={feat.id}
                        onClick={() => setSelectedMapFeature(feat)}
                        className={`p-2 rounded-lg border cursor-pointer transition-all backdrop-blur-md ${
                          isSelected
                            ? "bg-blue-600/80 border-blue-400 ring-1 ring-blue-300"
                            : feat.type === "PFZ_POINT"
                            ? "bg-emerald-950/80 border-emerald-600/60 hover:bg-emerald-900/90"
                            : feat.type === "HAZARD_ZONE"
                            ? "bg-rose-950/80 border-rose-600/60 hover:bg-rose-900/90"
                            : "bg-slate-800/80 border-slate-700 hover:bg-slate-700/90"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          {feat.type === "PFZ_POINT" ? (
                            <Anchor className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : feat.type === "HAZARD_ZONE" ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          ) : (
                            <Navigation className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          )}
                          <span className="font-semibold text-[11px] truncate">
                            {feat.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-300 block mt-0.5 font-mono">
                          [{feat.coordinates[1]}° N, {feat.coordinates[0]}° E]
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Selected Map Feature Details Card */}
            {selectedMapFeature ? (
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-blue-950">
                  <span>{selectedMapFeature.name}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-900 rounded">
                    {selectedMapFeature.type.replace(/_/g, " ")}
                  </span>
                </div>
                <p className="text-[11px] text-blue-900/90">
                  Coordinates: {selectedMapFeature.coordinates[1]}° N,{" "}
                  {selectedMapFeature.coordinates[0]}° E
                </p>
                <div className="pt-1 text-[11px] text-dark-muted">
                  {JSON.stringify(selectedMapFeature.properties)}
                </div>
              </div>
            ) : (
              <div className="p-2.5 bg-gray-50 border border-border rounded-lg text-xs text-dark-muted flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-dark-light shrink-0" />
                <span>Tap any pin on the map to inspect telemetry details.</span>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FORECAST CHARTS */}
        {activeTab === "charts" && (
          <div className="space-y-4">
            <div className="p-3 bg-white border border-border rounded-xl shadow-subtle space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-dark-text">
                  Significant Wave Height Forecast (m)
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold">
                  Threshold: 1.5m
                </span>
              </div>

              <div className="h-44 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeries}>
                    <defs>
                      <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 10, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 3]}
                      tick={{ fontSize: 10, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#e2e8f0",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                    />
                    <ReferenceLine
                      y={1.5}
                      stroke="#ef4444"
                      strokeDasharray="3 3"
                      label={{
                        value: "Limit (1.5m)",
                        fill: "#ef4444",
                        fontSize: 9,
                        position: "insideTopRight",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="waveHeight"
                      stroke="#2563EB"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#waveGradient)"
                      name="Wave Height (m)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-3 bg-white border border-border rounded-xl shadow-subtle space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-dark-text">
                  Surface Wind Velocity (Knots)
                </span>
                <span className="text-[10px] text-dark-muted">IMD Model</span>
              </div>

              <div className="h-36 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeries}>
                    <defs>
                      <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 10, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 30]}
                      tick={{ fontSize: 10, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#e2e8f0",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="windSpeed"
                      stroke="#d97706"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#windGradient)"
                      name="Wind (Knots)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RAW EVIDENCE INSPECTOR */}
        {activeTab === "evidence" && (
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-dark-muted block">
              Active Marine Belief Registry
            </span>

            <div className="space-y-2">
              {activeDecision.keyEvidence.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 bg-white border border-border rounded-lg text-xs space-y-1.5 shadow-subtle"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-dark-text">{ev.label}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {Math.round(ev.confidence * 100)}% Confidence
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-dark-muted text-[11px]">
                    <span>
                      Observed:{" "}
                      <strong className="text-dark-text">
                        {String(ev.value)} {ev.unit}
                      </strong>
                    </span>
                    <span>{ev.timestamp}</span>
                  </div>
                  <div className="text-[10px] text-primary font-semibold">
                    Source: {ev.source}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. PANEL FOOTER */}
      <div className="p-3 border-t border-border bg-gray-50 text-[11px] text-dark-muted flex items-center justify-between shrink-0">
        <span>Linked to Active Copilot Decision</span>
        <span className="font-mono text-[10px]">TIDAL v0.1</span>
      </div>
    </aside>
  );
};
