// Coastal Authority Mock Data
// Professional/official data with source attribution — matches Research Analytics pattern.
// Reuses PREDEFINED_REGIONS from researchMocks for region/district selection.

import { PREDEFINED_REGIONS, PredefinedRegion } from "./researchMocks";

// Re-export for convenience
export { PREDEFINED_REGIONS };
export type { PredefinedRegion };

// ─── HAZARD TYPES ───────────────────────────────────────────────────
export type HazardType = "wave" | "wind" | "cyclone" | "lightning";
export type SeverityLevel = "low" | "moderate" | "elevated" | "high" | "severe";

export interface HazardStatus {
  type: HazardType;
  label: string;
  severity: SeverityLevel;
  value: string;
  unit: string;
  source: string;
  timestamp: string;
  confidence: number;
}

export interface RegionHazardOverview {
  regionId: string;
  regionName: string;
  overallStatus: SeverityLevel;
  activeAlertCount: number;
  hazards: HazardStatus[];
  lastUpdated: string;
}

export interface ZoneRiskComparison {
  zoneId: string;
  zoneName: string;
  riskScore: number; // 0-100
  waveStatus: SeverityLevel;
  windStatus: SeverityLevel;
  cycloneStatus: SeverityLevel;
  lightningStatus: SeverityLevel;
  activeAlerts: number;
  flagged: boolean;
}

export interface BriefingReport {
  generatedAt: string;
  periodStart: string;
  periodEnd: string;
  totalAlerts: number;
  boundaryIncidents: number;
  topAffectedZones: { zoneName: string; alertCount: number; severity: SeverityLevel }[];
  hazardBreakdown: { type: HazardType; count: number }[];
}

// ─── SEVERITY HELPERS ───────────────────────────────────────────────
export const SEVERITY_CONFIG: Record<SeverityLevel, { label: string; color: string; bg: string; border: string }> = {
  low:      { label: "Low",      color: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-200" },
  moderate: { label: "Moderate", color: "text-blue-700",    bg: "bg-blue-50",     border: "border-blue-200" },
  elevated: { label: "Elevated", color: "text-amber-700",   bg: "bg-amber-50",    border: "border-amber-200" },
  high:     { label: "High",     color: "text-orange-700",  bg: "bg-orange-50",   border: "border-orange-200" },
  severe:   { label: "Severe",   color: "text-rose-700",    bg: "bg-rose-50",     border: "border-rose-200" },
};

// ─── REGION HAZARD OVERVIEW DATA ────────────────────────────────────
export const REGION_HAZARD_OVERVIEWS: Record<string, RegionHazardOverview> = {
  gulf_mannar: {
    regionId: "gulf_mannar",
    regionName: "Gulf of Mannar",
    overallStatus: "elevated",
    activeAlertCount: 3,
    hazards: [
      { type: "wave",      label: "Wave Height",        severity: "elevated", value: "2.4",  unit: "m",   source: "INCOIS_OSF",   timestamp: "2024-07-28T06:30:00Z", confidence: 0.92 },
      { type: "wind",      label: "Surface Wind",       severity: "moderate", value: "18",   unit: "kts", source: "IMD_BULLETIN",  timestamp: "2024-07-28T06:00:00Z", confidence: 0.88 },
      { type: "cyclone",   label: "Cyclonic Activity",  severity: "low",      value: "None", unit: "",    source: "IMD_BULLETIN",  timestamp: "2024-07-28T05:30:00Z", confidence: 0.95 },
      { type: "lightning",  label: "Lightning Risk",     severity: "elevated", value: "High", unit: "",    source: "IMD_BULLETIN",  timestamp: "2024-07-28T06:15:00Z", confidence: 0.78 },
    ],
    lastUpdated: "2024-07-28T06:30:00Z",
  },
  palk_strait: {
    regionId: "palk_strait",
    regionName: "Palk Strait",
    overallStatus: "moderate",
    activeAlertCount: 1,
    hazards: [
      { type: "wave",      label: "Wave Height",        severity: "moderate", value: "1.6",  unit: "m",   source: "INCOIS_OSF",   timestamp: "2024-07-28T06:30:00Z", confidence: 0.91 },
      { type: "wind",      label: "Surface Wind",       severity: "low",      value: "12",   unit: "kts", source: "IMD_BULLETIN",  timestamp: "2024-07-28T06:00:00Z", confidence: 0.90 },
      { type: "cyclone",   label: "Cyclonic Activity",  severity: "low",      value: "None", unit: "",    source: "IMD_BULLETIN",  timestamp: "2024-07-28T05:30:00Z", confidence: 0.95 },
      { type: "lightning",  label: "Lightning Risk",     severity: "low",      value: "Low",  unit: "",    source: "IMD_BULLETIN",  timestamp: "2024-07-28T06:15:00Z", confidence: 0.82 },
    ],
    lastUpdated: "2024-07-28T06:30:00Z",
  },
  chennai_coast: {
    regionId: "chennai_coast",
    regionName: "Chennai Coastal Waters",
    overallStatus: "high",
    activeAlertCount: 4,
    hazards: [
      { type: "wave",      label: "Wave Height",        severity: "high",     value: "3.1",  unit: "m",   source: "INCOIS_OSF",   timestamp: "2024-07-28T06:30:00Z", confidence: 0.89 },
      { type: "wind",      label: "Surface Wind",       severity: "high",     value: "28",   unit: "kts", source: "IMD_BULLETIN",  timestamp: "2024-07-28T06:00:00Z", confidence: 0.85 },
      { type: "cyclone",   label: "Cyclonic Activity",  severity: "low",      value: "None", unit: "",    source: "IMD_BULLETIN",  timestamp: "2024-07-28T05:30:00Z", confidence: 0.95 },
      { type: "lightning",  label: "Lightning Risk",     severity: "high",     value: "Very High", unit: "", source: "IMD_BULLETIN", timestamp: "2024-07-28T06:15:00Z", confidence: 0.80 },
    ],
    lastUpdated: "2024-07-28T06:30:00Z",
  },
  kochi_coast: {
    regionId: "kochi_coast",
    regionName: "Kochi Coastal Zone",
    overallStatus: "low",
    activeAlertCount: 0,
    hazards: [
      { type: "wave",      label: "Wave Height",        severity: "low",      value: "0.8",  unit: "m",   source: "INCOIS_OSF",   timestamp: "2024-07-28T06:30:00Z", confidence: 0.94 },
      { type: "wind",      label: "Surface Wind",       severity: "low",      value: "8",    unit: "kts", source: "IMD_BULLETIN",  timestamp: "2024-07-28T06:00:00Z", confidence: 0.92 },
      { type: "cyclone",   label: "Cyclonic Activity",  severity: "low",      value: "None", unit: "",    source: "IMD_BULLETIN",  timestamp: "2024-07-28T05:30:00Z", confidence: 0.96 },
      { type: "lightning",  label: "Lightning Risk",     severity: "low",      value: "Low",  unit: "",    source: "IMD_BULLETIN",  timestamp: "2024-07-28T06:15:00Z", confidence: 0.88 },
    ],
    lastUpdated: "2024-07-28T06:30:00Z",
  },
};

// ─── ZONE COMPARISON DATA ───────────────────────────────────────────
export const ZONE_COMPARISON_DATA: ZoneRiskComparison[] = [
  { zoneId: "gulf_mannar",    zoneName: "Gulf of Mannar",         riskScore: 62, waveStatus: "elevated", windStatus: "moderate",  cycloneStatus: "low", lightningStatus: "elevated", activeAlerts: 3, flagged: true },
  { zoneId: "palk_strait",    zoneName: "Palk Strait",            riskScore: 38, waveStatus: "moderate", windStatus: "low",       cycloneStatus: "low", lightningStatus: "low",      activeAlerts: 1, flagged: false },
  { zoneId: "chennai_coast",  zoneName: "Chennai Coastal Waters", riskScore: 78, waveStatus: "high",     windStatus: "high",      cycloneStatus: "low", lightningStatus: "high",     activeAlerts: 4, flagged: true },
  { zoneId: "kochi_coast",    zoneName: "Kochi Coastal Zone",     riskScore: 15, waveStatus: "low",      windStatus: "low",       cycloneStatus: "low", lightningStatus: "low",      activeAlerts: 0, flagged: false },
  { zoneId: "visakhapatnam",  zoneName: "Visakhapatnam Offshore", riskScore: 44, waveStatus: "moderate", windStatus: "elevated",  cycloneStatus: "low", lightningStatus: "moderate", activeAlerts: 2, flagged: false },
  { zoneId: "andaman_waters", zoneName: "Andaman Sea (Port Blair)", riskScore: 55, waveStatus: "elevated", windStatus: "moderate", cycloneStatus: "low", lightningStatus: "elevated", activeAlerts: 2, flagged: true },
  { zoneId: "lakshadweep",    zoneName: "Lakshadweep Sea",        riskScore: 22, waveStatus: "low",      windStatus: "low",       cycloneStatus: "low", lightningStatus: "moderate", activeAlerts: 0, flagged: false },
  { zoneId: "sundarbans_delta", zoneName: "Sundarbans Delta",     riskScore: 48, waveStatus: "moderate", windStatus: "moderate",  cycloneStatus: "low", lightningStatus: "elevated", activeAlerts: 2, flagged: false },
];

// ─── DISTRICT BRIEFING DATA ────────────────────────────────────────
export const DISTRICT_BRIEFING: BriefingReport = {
  generatedAt: "2024-07-26T10:00:00Z",
  periodStart: "2024-07-21",
  periodEnd: "2024-07-28",
  totalAlerts: 14,
  boundaryIncidents: 6,
  topAffectedZones: [
    { zoneName: "Chennai Coastal Waters", alertCount: 4, severity: "high" },
    { zoneName: "Gulf of Mannar",         alertCount: 3, severity: "elevated" },
    { zoneName: "Visakhapatnam Offshore", alertCount: 2, severity: "moderate" },
    { zoneName: "Andaman Sea (Port Blair)", alertCount: 2, severity: "elevated" },
    { zoneName: "Sundarbans Delta",       alertCount: 2, severity: "moderate" },
  ],
  hazardBreakdown: [
    { type: "wave",      count: 5 },
    { type: "wind",      count: 4 },
    { type: "lightning",  count: 3 },
    { type: "cyclone",   count: 2 },
  ],
};
