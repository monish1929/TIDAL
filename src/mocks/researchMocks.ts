// Research Analytics Mock Data
// All values are raw observations — no verdicts, no recommendations.
// Every data point includes: source, timestamp, and dataClass (live | forecast | historical).

export type DataClass = "live" | "forecast" | "historical";

export interface ResearchDataPoint {
  date: string;           // ISO date or display string
  value: number;
  source: string;
  timestamp: string;      // when this observation was recorded/retrieved
  dataClass: DataClass;
  unit: string;
}

export interface ResearchVariable {
  id: string;
  label: string;
  unit: string;
  color: string;          // chart line/area color
}

export interface PredefinedRegion {
  id: string;
  name: string;
  coordinates: [number, number]; // [lat, lon]
  description: string;
}

export interface ZoneScanResult {
  zoneId: string;
  zoneName: string;
  currentValue: number;
  baselineValue: number;
  zScore: number;
  unit: string;
  source: string;
  timestamp: string;
  dataClass: DataClass;
}

export interface UserDataset {
  id: string;
  name: string;
  fileName: string;
  rowCount: number;
  dateRange: string;
  variableName: string;
  status: "ready" | "mapping_required" | "error";
  uploadedAt: string;
  columns: string[];
}

// ─── AVAILABLE VARIABLES ────────────────────────────────────────────
export const RESEARCH_VARIABLES: ResearchVariable[] = [
  { id: "sst",          label: "Sea Surface Temperature (SST)",  unit: "°C",     color: "#ef4444" },
  { id: "chlorophyll",  label: "Chlorophyll-a Concentration",     unit: "mg/m³",  color: "#22c55e" },
  { id: "wind_speed",   label: "Surface Wind Speed",             unit: "kts",    color: "#f59e0b" },
  { id: "wave_height",  label: "Significant Wave Height",        unit: "m",      color: "#3b82f6" },
  { id: "current_speed",label: "Ocean Current Speed",            unit: "m/s",    color: "#8b5cf6" },
  { id: "tide_level",   label: "Tide Level",                     unit: "m",      color: "#06b6d4" },
];

// ─── PREDEFINED REGIONS ─────────────────────────────────────────────
export const PREDEFINED_REGIONS: PredefinedRegion[] = [
  { id: "gulf_mannar",       name: "Gulf of Mannar",              coordinates: [9.15, 79.10],  description: "Biosphere reserve, SE India" },
  { id: "palk_strait",       name: "Palk Strait",                 coordinates: [9.80, 79.60],  description: "Shallow strait, India-Sri Lanka" },
  { id: "chennai_coast",     name: "Chennai Coastal Waters",      coordinates: [13.08, 80.30], description: "Bay of Bengal, Tamil Nadu" },
  { id: "kochi_coast",       name: "Kochi Coastal Zone",          coordinates: [9.97, 76.26],  description: "Arabian Sea, Kerala" },
  { id: "visakhapatnam",     name: "Visakhapatnam Offshore",      coordinates: [17.69, 83.35], description: "Central Bay of Bengal" },
  { id: "andaman_waters",    name: "Andaman Sea (Port Blair)",    coordinates: [11.63, 92.73], description: "Andaman & Nicobar region" },
  { id: "lakshadweep",       name: "Lakshadweep Sea",             coordinates: [10.57, 72.64], description: "Arabian Sea atoll region" },
  { id: "sundarbans_delta",  name: "Sundarbans Delta",            coordinates: [21.94, 88.89], description: "Ganges-Brahmaputra delta" },
];

// ─── HELPER: Generate 30-day date sequence ──────────────────────────
function generateDates(startDate: string, days: number): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

const DATES_30D = generateDates("2024-07-01", 30);

// ─── DATASET 1: SST Single-Mode (Gulf of Mannar, 30 days) ──────────
export const SST_SINGLE_MODE_DATA: ResearchDataPoint[] = DATES_30D.map((date, i) => ({
  date,
  value: parseFloat((28.1 + Math.sin(i * 0.3) * 0.8 + (Math.random() - 0.5) * 0.3).toFixed(2)),
  source: "INCOIS_OSF",
  timestamp: `${date}T06:00:00Z`,
  dataClass: "historical" as DataClass,
  unit: "°C",
}));

// ─── DATASET 2: SST + Chlorophyll Overlay ───────────────────────────
export const SST_OVERLAY_DATA: ResearchDataPoint[] = SST_SINGLE_MODE_DATA.map((d) => ({ ...d }));

export const CHLOROPHYLL_OVERLAY_DATA: ResearchDataPoint[] = DATES_30D.map((date, i) => ({
  date,
  value: parseFloat((0.35 + Math.sin(i * 0.25 + 1.2) * 0.15 + (Math.random() - 0.5) * 0.05).toFixed(3)),
  source: "ISRO_OCM3",
  timestamp: `${date}T10:30:00Z`,
  dataClass: "historical" as DataClass,
  unit: "mg/m³",
}));

// ─── DATASET 3: SST Trend/Anomaly with Flagged Period ──────────────
export interface AnomalyDataPoint extends ResearchDataPoint {
  baseline: number;       // seasonal mean
  zScore: number;         // deviation from baseline in standard deviations
  isFlagged: boolean;     // exceeds threshold
}

export const SST_ANOMALY_DATA: AnomalyDataPoint[] = DATES_30D.map((date, i) => {
  const baseline = 28.3 + Math.sin((i / 30) * Math.PI) * 0.4;
  // Inject an anomalous warming event on days 15-20
  const isAnomalyPeriod = i >= 14 && i <= 19;
  const anomalyBoost = isAnomalyPeriod ? 1.8 + Math.random() * 0.4 : 0;
  const noise = (Math.random() - 0.5) * 0.3;
  const actual = baseline + noise + anomalyBoost;
  const stdDev = 0.45;
  const zScore = (actual - baseline) / stdDev;

  return {
    date,
    value: parseFloat(actual.toFixed(2)),
    baseline: parseFloat(baseline.toFixed(2)),
    zScore: parseFloat(zScore.toFixed(2)),
    isFlagged: Math.abs(zScore) > 2.0,
    source: "INCOIS_OSF",
    timestamp: `${date}T06:00:00Z`,
    dataClass: "historical" as DataClass,
    unit: "°C",
  };
});

// Historical marine alert markers that overlay on the anomaly chart
export interface AlertMarker {
  date: string;
  label: string;
  type: "cyclone_warning" | "high_wave_alert" | "fishing_ban" | "heatwave_advisory";
}

export const HISTORICAL_ALERT_MARKERS: AlertMarker[] = [
  { date: "2024-07-08", label: "High Wave Alert (IMD)", type: "high_wave_alert" },
  { date: "2024-07-16", label: "Marine Heatwave Advisory", type: "heatwave_advisory" },
  { date: "2024-07-22", label: "Fishing Ban Period Begins", type: "fishing_ban" },
];

// ─── DATASET 4: Zone Scan Results (8 zones, pre-computed) ───────────
const RAW_ZONE_RESULTS: ZoneScanResult[] = [
  { zoneId: "gulf_mannar",     zoneName: "Gulf of Mannar",           currentValue: 30.1,  baselineValue: 28.3, zScore: 4.0,  unit: "°C", source: "INCOIS_OSF",   timestamp: "2024-07-18T06:00:00Z", dataClass: "historical" as DataClass },
  { zoneId: "palk_strait",     zoneName: "Palk Strait",              currentValue: 29.6,  baselineValue: 28.5, zScore: 2.4,  unit: "°C", source: "INCOIS_OSF",   timestamp: "2024-07-18T06:00:00Z", dataClass: "historical" as DataClass },
  { zoneId: "lakshadweep",     zoneName: "Lakshadweep Sea",          currentValue: 29.8,  baselineValue: 28.8, zScore: 2.2,  unit: "°C", source: "ISRO_EOS",     timestamp: "2024-07-18T10:00:00Z", dataClass: "historical" as DataClass },
  { zoneId: "chennai_coast",   zoneName: "Chennai Coastal Waters",   currentValue: 29.2,  baselineValue: 28.6, zScore: 1.3,  unit: "°C", source: "INCOIS_OSF",   timestamp: "2024-07-18T06:00:00Z", dataClass: "historical" as DataClass },
  { zoneId: "andaman_waters",  zoneName: "Andaman Sea (Port Blair)", currentValue: 28.9,  baselineValue: 28.4, zScore: 1.1,  unit: "°C", source: "ISRO_EOS",     timestamp: "2024-07-18T10:00:00Z", dataClass: "historical" as DataClass },
  { zoneId: "kochi_coast",     zoneName: "Kochi Coastal Zone",       currentValue: 27.8,  baselineValue: 27.5, zScore: 0.7,  unit: "°C", source: "INCOIS_OSF",   timestamp: "2024-07-18T06:00:00Z", dataClass: "historical" as DataClass },
  { zoneId: "visakhapatnam",   zoneName: "Visakhapatnam Offshore",   currentValue: 28.4,  baselineValue: 28.2, zScore: 0.4,  unit: "°C", source: "INCOIS_OSF",   timestamp: "2024-07-18T06:00:00Z", dataClass: "historical" as DataClass },
  { zoneId: "sundarbans_delta",zoneName: "Sundarbans Delta",         currentValue: 28.0,  baselineValue: 28.1, zScore: -0.2, unit: "°C", source: "IMD_BULLETIN", timestamp: "2024-07-18T08:00:00Z", dataClass: "historical" as DataClass },
];

export const ZONE_SCAN_RESULTS: ZoneScanResult[] = [...RAW_ZONE_RESULTS].sort(
  (a, b) => Math.abs(b.zScore) - Math.abs(a.zScore)
);

// ─── DATASET 5: Sample My Data Dataset ──────────────────────────────
export const SAMPLE_USER_DATASET: UserDataset = {
  id: "user_ds_001",
  name: "Coastal SST Survey — Field Campaign 2024",
  fileName: "coastal_sst_field_2024.csv",
  rowCount: 142,
  dateRange: "2024-06-15 to 2024-07-25",
  variableName: "Field SST (Coastal Survey)",
  status: "ready",
  uploadedAt: "2024-08-10T14:30:00Z",
  columns: ["date", "latitude", "longitude", "sst_celsius", "station_id"],
};

// Sample format CSV content for download link
export const SAMPLE_CSV_CONTENT = `date,latitude,longitude,value,variable_name
2024-07-01,9.15,79.10,28.4,SST
2024-07-01,9.16,79.11,28.5,SST
2024-07-02,9.15,79.10,28.3,SST
2024-07-02,9.16,79.11,28.6,SST
2024-07-03,9.15,79.10,28.7,SST`;

// ─── CORRELATION MOCK DATA ──────────────────────────────────────────
export interface CorrelationResult {
  lag: number;            // days
  coefficient: number;    // Pearson r
}

export const SST_CHLOROPHYLL_CORRELATION: CorrelationResult[] = [
  { lag: 0, coefficient: 0.42 },
  { lag: 1, coefficient: 0.48 },
  { lag: 2, coefficient: 0.55 },
  { lag: 3, coefficient: 0.71 },
  { lag: 4, coefficient: 0.78 },
  { lag: 5, coefficient: 0.82 },
  { lag: 6, coefficient: 0.79 },
  { lag: 7, coefficient: 0.73 },
  { lag: 8, coefficient: 0.64 },
  { lag: 9, coefficient: 0.51 },
  { lag: 10, coefficient: 0.39 },
];

// ─── ZONE DETAIL EXTENDED DATA GENERATOR ────────────────────────────
export interface ZoneDetailData {
  zoneId: string;
  zoneName: string;
  coordinates: [number, number];
  description: string;
  currentValue: number;
  baselineValue: number;
  zScore: number;
  unit: string;
  source: string;
  timestamp: string;
  dataClass: DataClass;
  anomalySeries: AnomalyDataPoint[];
  alerts: AlertMarker[];
  variableMiniSeries: {
    sst: { value: number; unit: string; source: string; timestamp: string; data: { date: string; value: number }[] };
    chlorophyll: { value: number; unit: string; source: string; timestamp: string; data: { date: string; value: number }[] };
    windSpeed: { value: number; unit: string; source: string; timestamp: string; data: { date: string; value: number }[] };
    waveHeight: { value: number; unit: string; source: string; timestamp: string; data: { date: string; value: number }[] };
    currentSpeed: { value: number; unit: string; source: string; timestamp: string; data: { date: string; value: number }[] };
    tideLevel: { value: number; unit: string; source: string; timestamp: string; data: { date: string; value: number }[] };
  };
  rawObservationRecords: {
    date: string;
    timestamp: string;
    sst: number;
    baselineSST: number;
    zScore: number;
    chlorophyll: number;
    windSpeed: number;
    waveHeight: number;
    currentSpeed: number;
    tideLevel: number;
    source: string;
    dataClass: DataClass;
  }[];
}

export function getZoneDetailData(zoneId: string): ZoneDetailData {
  const scanResult = ZONE_SCAN_RESULTS.find((z) => z.zoneId === zoneId) || ZONE_SCAN_RESULTS[0];
  const regionMeta = PREDEFINED_REGIONS.find((r) => r.id === zoneId) || {
    id: scanResult.zoneId,
    name: scanResult.zoneName,
    coordinates: [9.15, 79.10] as [number, number],
    description: "Marine observation sector",
  };

  const offset = scanResult.zoneName.length * 0.15;
  const baseTemp = scanResult.baselineValue;

  const dates = generateDates("2024-07-01", 30);
  const isHighAnomaly = Math.abs(scanResult.zScore) >= 2.0;

  const anomalySeries: AnomalyDataPoint[] = dates.map((date, i) => {
    const seasonalBaseline = baseTemp + Math.sin((i / 30) * Math.PI) * 0.35;
    const isAnomalyPeriod = isHighAnomaly && i >= 13 && i <= 19;
    const anomalyBoost = isAnomalyPeriod ? (scanResult.zScore > 0 ? 1.5 + Math.random() * 0.4 : -1.2 - Math.random() * 0.3) : 0;
    const noise = (Math.sin(i * 0.7 + offset) * 0.2);
    const actual = seasonalBaseline + noise + anomalyBoost;
    const stdDev = 0.45;
    const zScoreVal = (actual - seasonalBaseline) / stdDev;

    return {
      date,
      value: parseFloat(actual.toFixed(2)),
      baseline: parseFloat(seasonalBaseline.toFixed(2)),
      zScore: parseFloat(zScoreVal.toFixed(2)),
      isFlagged: Math.abs(zScoreVal) > 2.0,
      source: scanResult.source,
      timestamp: `${date}T06:00:00Z`,
      dataClass: scanResult.dataClass,
      unit: scanResult.unit,
    };
  });

  const alerts: AlertMarker[] = [];
  if (isHighAnomaly) {
    alerts.push({
      date: "2024-07-15",
      label: scanResult.zScore > 0 ? "Thermal Hotspot Advisory" : "Upwelling Cold Anomaly Alert",
      type: "heatwave_advisory",
    });
  }
  if (scanResult.zoneId === "gulf_mannar" || scanResult.zoneId === "palk_strait") {
    alerts.push({
      date: "2024-07-08",
      label: "High Swell Surge Warning (IMD)",
      type: "high_wave_alert",
    });
    alerts.push({
      date: "2024-07-22",
      label: "Seasonal Coral Bleaching Watch",
      type: "heatwave_advisory",
    });
  }

  const sstMini = dates.map((d, i) => ({
    date: d.slice(5),
    value: parseFloat((baseTemp + Math.sin(i * 0.3 + offset) * 0.6 + (i > 14 && isHighAnomaly ? 1.4 : 0)).toFixed(2)),
  }));

  const chlMini = dates.map((d, i) => ({
    date: d.slice(5),
    value: parseFloat((0.38 + Math.sin(i * 0.2 + offset * 2) * 0.12).toFixed(3)),
  }));

  const windMini = dates.map((d, i) => ({
    date: d.slice(5),
    value: parseFloat((11.5 + Math.sin(i * 0.4 + offset) * 3.8 + (Math.sin(i) * 1.5)).toFixed(1)),
  }));

  const waveMini = dates.map((d, i) => ({
    date: d.slice(5),
    value: parseFloat((1.25 + Math.cos(i * 0.35 + offset) * 0.55).toFixed(2)),
  }));

  const currentMini = dates.map((d, i) => ({
    date: d.slice(5),
    value: parseFloat((0.45 + Math.sin(i * 0.28 + offset) * 0.22).toFixed(2)),
  }));

  const tideMini = dates.map((d, i) => ({
    date: d.slice(5),
    value: parseFloat((0.85 + Math.sin(i * 0.9) * 0.45).toFixed(2)),
  }));

  const rawObservationRecords = dates.map((date, i) => ({
    date,
    timestamp: `${date}T${(6 + (i % 8) * 2).toString().padStart(2, "0")}:00:00Z`,
    sst: sstMini[i].value,
    baselineSST: anomalySeries[i].baseline,
    zScore: anomalySeries[i].zScore,
    chlorophyll: chlMini[i].value,
    windSpeed: windMini[i].value,
    waveHeight: waveMini[i].value,
    currentSpeed: currentMini[i].value,
    tideLevel: tideMini[i].value,
    source: scanResult.source,
    dataClass: scanResult.dataClass,
  }));

  return {
    zoneId: scanResult.zoneId,
    zoneName: scanResult.zoneName,
    coordinates: regionMeta.coordinates,
    description: regionMeta.description,
    currentValue: scanResult.currentValue,
    baselineValue: scanResult.baselineValue,
    zScore: scanResult.zScore,
    unit: scanResult.unit,
    source: scanResult.source,
    timestamp: scanResult.timestamp,
    dataClass: scanResult.dataClass,
    anomalySeries,
    alerts,
    variableMiniSeries: {
      sst: {
        value: sstMini[sstMini.length - 1].value,
        unit: "°C",
        source: scanResult.source,
        timestamp: scanResult.timestamp,
        data: sstMini,
      },
      chlorophyll: {
        value: chlMini[chlMini.length - 1].value,
        unit: "mg/m³",
        source: "ISRO_OCM3",
        timestamp: `${dates[dates.length - 1]}T10:30:00Z`,
        data: chlMini,
      },
      windSpeed: {
        value: windMini[windMini.length - 1].value,
        unit: "kts",
        source: "ECMWF_ERA5",
        timestamp: `${dates[dates.length - 1]}T00:00:00Z`,
        data: windMini,
      },
      waveHeight: {
        value: waveMini[waveMini.length - 1].value,
        unit: "m",
        source: "INCOIS_WW3",
        timestamp: `${dates[dates.length - 1]}T06:00:00Z`,
        data: waveMini,
      },
      currentSpeed: {
        value: currentMini[currentMini.length - 1].value,
        unit: "m/s",
        source: "INCOIS_HYCOM",
        timestamp: `${dates[dates.length - 1]}T06:00:00Z`,
        data: currentMini,
      },
      tideLevel: {
        value: tideMini[tideMini.length - 1].value,
        unit: "m",
        source: "Survey_of_India",
        timestamp: `${dates[dates.length - 1]}T12:00:00Z`,
        data: tideMini,
      },
    },
    rawObservationRecords,
  };
}

// ─── DATASET PREVIEW ROWS MOCK ──────────────────────────────────────
export interface DatasetColumnMapping {
  date: string;
  latitude: string;
  longitude: string;
  value: string;
  stationId?: string;
}

export interface DatasetDetailData extends UserDataset {
  columnMapping: DatasetColumnMapping;
  usedIn: string[];
  previewRows: Record<string, any>[];
  rawCsvContent: string;
}

export const SAMPLE_DATASET_PREVIEW_ROWS = [
  { row: 1, date: "2024-06-15", latitude: "9.152", longitude: "79.104", sst_celsius: "28.45", station_id: "STN-GOM-01", quality_flag: "PASSED" },
  { row: 2, date: "2024-06-16", latitude: "9.155", longitude: "79.108", sst_celsius: "28.60", station_id: "STN-GOM-01", quality_flag: "PASSED" },
  { row: 3, date: "2024-06-17", latitude: "9.158", longitude: "79.112", sst_celsius: "28.52", station_id: "STN-GOM-01", quality_flag: "PASSED" },
  { row: 4, date: "2024-06-18", latitude: "9.162", longitude: "79.119", sst_celsius: "28.78", station_id: "STN-GOM-02", quality_flag: "PASSED" },
  { row: 5, date: "2024-06-19", latitude: "9.165", longitude: "79.123", sst_celsius: "28.91", station_id: "STN-GOM-02", quality_flag: "PASSED" },
  { row: 6, date: "2024-06-20", latitude: "9.170", longitude: "79.130", sst_celsius: "29.10", station_id: "STN-GOM-02", quality_flag: "PASSED" },
  { row: 7, date: "2024-06-21", latitude: "9.174", longitude: "79.135", sst_celsius: "29.25", station_id: "STN-GOM-03", quality_flag: "PASSED" },
  { row: 8, date: "2024-06-22", latitude: "9.179", longitude: "79.141", sst_celsius: "29.38", station_id: "STN-GOM-03", quality_flag: "PASSED" },
  { row: 9, date: "2024-06-23", latitude: "9.182", longitude: "79.148", sst_celsius: "29.42", station_id: "STN-GOM-03", quality_flag: "PASSED" },
  { row: 10, date: "2024-06-24", latitude: "9.186", longitude: "79.155", sst_celsius: "29.30", station_id: "STN-GOM-03", quality_flag: "PASSED" },
  { row: 11, date: "2024-06-25", latitude: "9.190", longitude: "79.162", sst_celsius: "29.15", station_id: "STN-GOM-04", quality_flag: "PASSED" },
  { row: 12, date: "2024-06-26", latitude: "9.195", longitude: "79.169", sst_celsius: "28.98", station_id: "STN-GOM-04", quality_flag: "PASSED" },
  { row: 13, date: "2024-06-27", latitude: "9.199", longitude: "79.174", sst_celsius: "28.85", station_id: "STN-GOM-04", quality_flag: "PASSED" },
  { row: 14, date: "2024-06-28", latitude: "9.204", longitude: "79.180", sst_celsius: "28.72", station_id: "STN-GOM-04", quality_flag: "PASSED" },
  { row: 15, date: "2024-06-29", latitude: "9.208", longitude: "79.186", sst_celsius: "28.65", station_id: "STN-GOM-05", quality_flag: "PASSED" },
  { row: 16, date: "2024-06-30", latitude: "9.213", longitude: "79.192", sst_celsius: "28.80", station_id: "STN-GOM-05", quality_flag: "PASSED" },
  { row: 17, date: "2024-07-01", latitude: "9.218", longitude: "79.198", sst_celsius: "28.95", station_id: "STN-GOM-05", quality_flag: "PASSED" },
  { row: 18, date: "2024-07-02", latitude: "9.222", longitude: "79.205", sst_celsius: "29.12", station_id: "STN-GOM-05", quality_flag: "PASSED" },
  { row: 19, date: "2024-07-03", latitude: "9.227", longitude: "79.212", sst_celsius: "29.35", station_id: "STN-GOM-06", quality_flag: "PASSED" },
  { row: 20, date: "2024-07-04", latitude: "9.231", longitude: "79.218", sst_celsius: "29.48", station_id: "STN-GOM-06", quality_flag: "PASSED" },
];

export function getDatasetDetailData(datasetId: string, customDatasets: UserDataset[] = []): DatasetDetailData {
  const found = customDatasets.find((d) => d.id === datasetId) || (datasetId === SAMPLE_USER_DATASET.id ? SAMPLE_USER_DATASET : null);
  const base = found || {
    ...SAMPLE_USER_DATASET,
    id: datasetId,
    name: "Custom Research Ingested Dataset",
    fileName: `dataset_${datasetId.slice(-4)}.csv`,
  };

  const columnMapping: DatasetColumnMapping = {
    date: base.columns.find((c) => ["date", "datetime", "timestamp", "time"].includes(c.toLowerCase())) || "date",
    latitude: base.columns.find((c) => ["latitude", "lat", "y"].includes(c.toLowerCase())) || "latitude",
    longitude: base.columns.find((c) => ["longitude", "lon", "lng", "x"].includes(c.toLowerCase())) || "longitude",
    value: base.columns.find((c) => ["sst_celsius", "value", "measurement", "sst", "temperature"].includes(c.toLowerCase())) || base.columns[3] || "value",
    stationId: base.columns.find((c) => ["station_id", "station", "id", "stn"].includes(c.toLowerCase())) || "station_id",
  };

  const previewRows = SAMPLE_DATASET_PREVIEW_ROWS.map((r, i) => {
    const rowObj: Record<string, any> = { row: i + 1 };
    base.columns.forEach((col) => {
      if (col === "date") rowObj[col] = r.date;
      else if (col === "latitude") rowObj[col] = r.latitude;
      else if (col === "longitude") rowObj[col] = r.longitude;
      else if (col === "station_id") rowObj[col] = r.station_id;
      else if (col === "sst_celsius" || col === "value") rowObj[col] = r.sst_celsius;
      else rowObj[col] = `val_${i + 1}`;
    });
    return rowObj;
  });

  const rawCsvContent = [
    base.columns.join(","),
    ...previewRows.map((r) => base.columns.map((c) => r[c] ?? "").join(",")),
  ].join("\n");

  return {
    ...base,
    columnMapping,
    usedIn: [
      "Data Explorer (Available as selectable variable across Single, Overlay & Compare modes)",
      "Statistical Analysis (Baseline anomaly computation & lag cross-correlation)",
      "Research Multi-Source Blended Data Export Engine",
    ],
    previewRows,
    rawCsvContent,
  };
}

