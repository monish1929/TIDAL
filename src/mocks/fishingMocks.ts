// Fishing Intelligence Mock Data & Helpers
// Tailored for low-literacy fisherman audience: icon-led, plain language, minimal text

export interface MarineAlertBannerData {
  id: string;
  hasActiveAlert: boolean;
  severity: "rose" | "amber" | "emerald";
  badgeText: string;
  title: string;
  message: string;
  validity: string;
  audioText: string;
}

export const ACTIVE_MARINE_ALERT: MarineAlertBannerData = {
  id: "alert_01",
  hasActiveAlert: true,
  severity: "amber",
  badgeText: "High Swell Advisory",
  title: "Rough Sea Notice for Gulf of Mannar",
  message: "Waves will rise above 2.2m after 1:30 PM today. Venturing in morning is safe — return to harbour before 12:30 PM.",
  validity: "Valid until 6:00 PM IST Today",
  audioText: "Attention fishermen. Waves will rise in the afternoon. Early morning trip is safe. Return before 12:30 PM.",
};

export interface FishingSafetyCondition {
  id: string;
  label: string;
  value: string;
  status: "safe" | "caution" | "unsafe";
  statusText: string;
  plainDesc: string;
  iconType: "wave" | "wind" | "current" | "sun";
}

export interface FishingSafetyData {
  overallStatus: "SAFE" | "CAUTION" | "UNSAFE";
  statusBadgeText: string;
  headline: string;
  plainExplanation: string;
  audioNarration: string;
  bestWindowToday: string;
  conditions: FishingSafetyCondition[];
  hourlyTimeline: {
    hour: string;
    status: "safe" | "caution" | "unsafe";
    wave: string;
    wind: string;
    label: string;
  }[];
}

export const FISHING_SAFETY_TODAY: FishingSafetyData = {
  overallStatus: "SAFE",
  statusBadgeText: "SAFE FOR MORNING VOYAGE",
  headline: "Good conditions until 1:00 PM",
  plainExplanation: "Waves are calm this morning (1.1m). Safe for mechanized trawlers and motorized fiber boats. Return before 1:00 PM before wind speeds increase.",
  audioNarration: "Sea state is safe for fishing this morning. Waves are low at 1.1 meters. Return back to harbour by 1:00 PM.",
  bestWindowToday: "5:00 AM – 11:30 AM",
  conditions: [
    {
      id: "wave",
      label: "Wave Height",
      value: "1.1 – 1.3 m",
      status: "safe",
      statusText: "Calm & Smooth",
      plainDesc: "Low waves, safe for your boat size.",
      iconType: "wave",
    },
    {
      id: "wind",
      label: "Wind Speed",
      value: "11 – 13 kts (WNW)",
      status: "safe",
      statusText: "Light Breeze",
      plainDesc: "Gentle breeze from North-West.",
      iconType: "wind",
    },
    {
      id: "current",
      label: "Ocean Current",
      value: "0.4 m/s (South)",
      status: "safe",
      statusText: "Normal Drift",
      plainDesc: "Mild water drift, nets stay steady.",
      iconType: "current",
    },
    {
      id: "weather",
      label: "Sky & Visibility",
      value: "Clear Sky (10 km)",
      status: "safe",
      statusText: "Clear Vision",
      plainDesc: "No fog or heavy rain clouds.",
      iconType: "sun",
    },
  ],
  hourlyTimeline: [
    { hour: "05:00 AM", status: "safe", wave: "1.0 m", wind: "9 kts", label: "Best Start" },
    { hour: "07:00 AM", status: "safe", wave: "1.1 m", wind: "10 kts", label: "Calm Sea" },
    { hour: "09:00 AM", status: "safe", wave: "1.2 m", wind: "12 kts", label: "Good" },
    { hour: "11:00 AM", status: "safe", wave: "1.3 m", wind: "14 kts", label: "Start Return" },
    { hour: "01:00 PM", status: "caution", wave: "1.8 m", wind: "18 kts", label: "Chop Rising" },
    { hour: "03:00 PM", status: "unsafe", wave: "2.3 m", wind: "22 kts", label: "Rough Swell" },
    { hour: "05:00 PM", status: "unsafe", wave: "2.5 m", wind: "24 kts", label: "Avoid Sea" },
  ],
};

export const FISHING_SAFETY_TOMORROW: FishingSafetyData = {
  overallStatus: "CAUTION",
  statusBadgeText: "MODERATE CAUTION ADVISED",
  headline: "Short morning window only",
  plainExplanation: "A low pressure area is building. Sea remains fishable only between 5:00 AM and 9:30 AM before wave heights surpass 2.0m.",
  audioNarration: "Tomorrow will have rough weather by midday. Only go out if returning early before 9:30 AM.",
  bestWindowToday: "5:00 AM – 9:30 AM",
  conditions: [
    {
      id: "wave",
      label: "Wave Height",
      value: "1.6 – 2.1 m",
      status: "caution",
      statusText: "Moderate Chop",
      plainDesc: "Wave height increases quickly by 10:00 AM.",
      iconType: "wave",
    },
    {
      id: "wind",
      label: "Wind Speed",
      value: "16 – 20 kts (SW)",
      status: "caution",
      statusText: "Gusty Wind",
      plainDesc: "Breezy conditions in open water.",
      iconType: "wind",
    },
    {
      id: "current",
      label: "Ocean Current",
      value: "0.7 m/s (East)",
      status: "caution",
      statusText: "Fast Drift",
      plainDesc: "Stronger underwater current.",
      iconType: "current",
    },
    {
      id: "weather",
      label: "Sky & Visibility",
      value: "Scattered Rain",
      status: "caution",
      statusText: "Passing Showers",
      plainDesc: "Light rain patches in south sector.",
      iconType: "sun",
    },
  ],
  hourlyTimeline: [
    { hour: "05:00 AM", status: "safe", wave: "1.4 m", wind: "12 kts", label: "Fishable" },
    { hour: "07:00 AM", status: "safe", wave: "1.5 m", wind: "14 kts", label: "Window Closing" },
    { hour: "09:00 AM", status: "caution", wave: "1.8 m", wind: "17 kts", label: "Must Return" },
    { hour: "11:00 AM", status: "unsafe", wave: "2.1 m", wind: "21 kts", label: "Rough" },
    { hour: "01:00 PM", status: "unsafe", wave: "2.4 m", wind: "25 kts", label: "Heavy Waves" },
    { hour: "03:00 PM", status: "unsafe", wave: "2.6 m", wind: "27 kts", label: "Do Not Venture" },
  ],
};

export interface PFZoneItem {
  id: string;
  name: string;
  coordinates: [number, number];
  distanceNM: number;
  travelTimeMinutes: number;
  bearingText: string;
  catchRating: "VERY_GOOD" | "GOOD" | "FAIR";
  catchRatingText: string;
  depthMeters: number;
  targetFish: string[];
  simplifiedReason: string;
  satelliteDataAttribution: string;
  isClosest: boolean;
}

export const PFZ_ZONES_LIST: PFZoneItem[] = [
  {
    id: "pfz_cluster_alpha",
    name: "PFZ Cluster Alpha (Gulf of Mannar)",
    coordinates: [9.15, 79.10],
    distanceNM: 14.8,
    travelTimeMinutes: 75,
    bearingText: "South-South-East (165°)",
    catchRating: "VERY_GOOD",
    catchRatingText: "High Fish Catch Expected",
    depthMeters: 28,
    targetFish: ["Tuna", "Mackerel", "Seer Fish", "Sardines"],
    simplifiedReason: "Satellite imagery shows high natural plankton feed and ideal water temperature. Big schools of fish gathered here.",
    satelliteDataAttribution: "INCOIS PFZ Bulletin & ISRO OCM-3 Satellite",
    isClosest: true,
  },
  {
    id: "pfz_cluster_beta",
    name: "PFZ Cluster Beta (South Shoal)",
    coordinates: [9.05, 79.25],
    distanceNM: 21.2,
    travelTimeMinutes: 105,
    bearingText: "South-East (140°)",
    catchRating: "GOOD",
    catchRatingText: "Good Catch Potential",
    depthMeters: 36,
    targetFish: ["Ribbon Fish", "Squid", "Carangids"],
    simplifiedReason: "Strong thermal gradient where cool and warm waters meet, attracting pelagic fish schools.",
    satelliteDataAttribution: "INCOIS PFZ Bulletin",
    isClosest: false,
  },
  {
    id: "pfz_cluster_gamma",
    name: "PFZ Cluster Gamma (Palk Bay Outer)",
    coordinates: [9.42, 79.35],
    distanceNM: 28.5,
    travelTimeMinutes: 140,
    bearingText: "East-North-East (070°)",
    catchRating: "FAIR",
    catchRatingText: "Moderate Fish Activity",
    depthMeters: 18,
    targetFish: ["Mullet", "Snapper", "Crabs"],
    simplifiedReason: "Moderate plankton density. Good for bottom trawling in shallow shelf waters.",
    satelliteDataAttribution: "ISRO OCM-3 Satellite",
    isClosest: false,
  },
];

export interface FishingTimingWindow {
  day: "today" | "tomorrow";
  bestWindow: string;
  headline: string;
  reason: string;
  audioNarration: string;
  timeBlocks: {
    timeRange: string;
    rating: "SUITABLE" | "CAUTION" | "AVOID";
    ratingLabel: string;
    waveDesc: string;
    windDesc: string;
    tideDesc: string;
  }[];
  quickMetrics: {
    idealDeparture: string;
    highTideTime: string;
    sunsetTime: string;
  };
}

export const FISHING_TIMING_TODAY: FishingTimingWindow = {
  day: "today",
  bestWindow: "5:00 AM – 8:30 AM",
  headline: "Dawn Venture Window (5:00 AM – 8:30 AM)",
  reason: "Sea is at its smoothest with morning high tide helping smooth harbour exit. Plankton feeding peaks at sunrise.",
  audioNarration: "Best time to start your boat is between 5:00 and 8:30 AM. Sea is calm and fish feeding is active.",
  timeBlocks: [
    {
      timeRange: "04:30 AM – 08:30 AM",
      rating: "SUITABLE",
      ratingLabel: "Best Time to Venture",
      waveDesc: "Wave 1.0m (Calm)",
      windDesc: "Wind 9-11 kts",
      tideDesc: "High Tide (+0.8m) at 06:15 AM",
    },
    {
      timeRange: "08:30 AM – 12:30 PM",
      rating: "SUITABLE",
      ratingLabel: "Good Fishing Window",
      waveDesc: "Wave 1.2m (Manageable)",
      windDesc: "Wind 12-14 kts",
      tideDesc: "Ebbing Tide",
    },
    {
      timeRange: "12:30 PM – 03:30 PM",
      rating: "CAUTION",
      ratingLabel: "Caution — Wave Chop Increasing",
      waveDesc: "Wave 1.8m (Choppy)",
      windDesc: "Wind 18 kts (Gusty)",
      tideDesc: "Low Tide at 01:45 PM",
    },
    {
      timeRange: "03:30 PM – 07:00 PM",
      rating: "AVOID",
      ratingLabel: "Avoid — High Afternoon Swell",
      waveDesc: "Wave 2.4m (Rough)",
      windDesc: "Wind 23 kts",
      tideDesc: "Rising Swell",
    },
  ],
  quickMetrics: {
    idealDeparture: "05:15 AM IST",
    highTideTime: "06:15 AM IST",
    sunsetTime: "06:28 PM IST",
  },
};

export const FISHING_TIMING_TOMORROW: FishingTimingWindow = {
  day: "tomorrow",
  bestWindow: "5:00 AM – 7:30 AM",
  headline: "Early Dawn Window Only (5:00 AM – 7:30 AM)",
  reason: "Weather worsens early tomorrow. Only venture if you plan to return before 9:30 AM.",
  audioNarration: "Tomorrow sea gets rough early. Finish trip before 9:30 AM.",
  timeBlocks: [
    {
      timeRange: "04:30 AM – 07:30 AM",
      rating: "SUITABLE",
      ratingLabel: "Short Early Window",
      waveDesc: "Wave 1.4m",
      windDesc: "Wind 12 kts",
      tideDesc: "High Tide at 07:00 AM",
    },
    {
      timeRange: "07:30 AM – 10:30 AM",
      rating: "CAUTION",
      ratingLabel: "Caution — Heading Back",
      waveDesc: "Wave 1.9m",
      windDesc: "Wind 17 kts",
      tideDesc: "Ebbing",
    },
    {
      timeRange: "10:30 AM – 06:00 PM",
      rating: "AVOID",
      ratingLabel: "Avoid Sea — Strong Gusts",
      waveDesc: "Wave 2.5m+",
      windDesc: "Wind 25 kts+",
      tideDesc: "Rough Sea",
    },
  ],
  quickMetrics: {
    idealDeparture: "05:00 AM IST",
    highTideTime: "07:00 AM IST",
    sunsetTime: "06:29 PM IST",
  },
};

export interface SafeRouteOption {
  id: string;
  departureHarbour: string;
  destinationZone: string;
  distanceNM: number;
  voyageMinutes: number;
  fuelLitresEstimate: number;
  safetyRating: "SAFE_CORRIDOR" | "CAUTION";
  boundaryNotice: string;
  hazardNotice: string;
  audioNarration: string;
  waypoints: [number, number][];
}

export const DEPARTURE_HARBOURS = [
  "Rameswaram Fishing Jetty",
  "Mandapam South Harbour",
  "Pamban North Jetty",
  "Thoothukudi (Tuticorin) Fishing Port",
  "Chennai Kasimedu Harbour",
  "Kochi Fisheries Harbour",
];

export const SAFE_ROUTE_MOCKS: Record<string, SafeRouteOption> = {
  pfz_cluster_alpha: {
    id: "route_alpha",
    departureHarbour: "Rameswaram Fishing Jetty",
    destinationZone: "PFZ Cluster Alpha (Gulf of Mannar)",
    distanceNM: 14.8,
    voyageMinutes: 75,
    fuelLitresEstimate: 18,
    safetyRating: "SAFE_CORRIDOR",
    boundaryNotice: "Safe in Indian waters. International Maritime Boundary Line is 8.2 NM North.",
    hazardNotice: "Clear deep channel. Avoid shallow coral patches 1.5 NM East of Pamban Island.",
    audioNarration: "Route to Cluster Alpha is 14.8 nautical miles. Estimated time is 1 hour 15 minutes. Stay in the south corridor.",
    waypoints: [
      [9.28, 79.31], // Rameswaram
      [9.22, 79.25], // Waypoint 1 (Clear Pamban Shoals)
      [9.15, 79.10], // Destination Cluster Alpha
    ],
  },
  pfz_cluster_beta: {
    id: "route_beta",
    departureHarbour: "Rameswaram Fishing Jetty",
    destinationZone: "PFZ Cluster Beta (South Shoal)",
    distanceNM: 21.2,
    voyageMinutes: 105,
    fuelLitresEstimate: 26,
    safetyRating: "SAFE_CORRIDOR",
    boundaryNotice: "Safe navigation corridor. 11.4 NM from international boundary.",
    hazardNotice: "Moderate swell along open shelf edge. Keep watch for coastal trawler traffic.",
    audioNarration: "Route to Cluster Beta is 21 nautical miles. Estimated 1 hour 45 minutes voyage.",
    waypoints: [
      [9.28, 79.31],
      [9.18, 79.28],
      [9.05, 79.25],
    ],
  },
  pfz_cluster_gamma: {
    id: "route_gamma",
    departureHarbour: "Rameswaram Fishing Jetty",
    destinationZone: "PFZ Cluster Gamma (Palk Bay Outer)",
    distanceNM: 28.5,
    voyageMinutes: 140,
    fuelLitresEstimate: 34,
    safetyRating: "CAUTION",
    boundaryNotice: "Caution: Approaches close to IMBL boundary (approx 3.2 NM buffer). Do not cross boundary.",
    hazardNotice: "Shallow sandbars near Dhanushkodi. Navigate only along marked fishing channels.",
    audioNarration: "Caution on route to Cluster Gamma. Stay clear of the international boundary line to the north.",
    waypoints: [
      [9.28, 79.31],
      [9.35, 79.32],
      [9.42, 79.35],
    ],
  },
};
