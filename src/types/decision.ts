import { UserRole } from "./user";

export type RiskTier = "LOW" | "MEDIUM" | "HIGH";
export type ApprovalStatus = "APPROVED_AUTONOMOUS" | "PENDING_APPROVAL" | "APPROVED_BY_USER";

export type TopicScope =
  | "home"
  | "chat"
  | "fishing"
  | "weather"
  | "alerts"
  | "research"
  | "routes"
  | "zones"
  | "settings";

export type DataSource =
  | "INCOIS_OSF"
  | "INCOIS_PFZ"
  | "IMD_BULLETIN"
  | "ISRO_EOS"
  | "SVAS_SAFETY_INDEX"
  | "SYNTHETIC_COASTAL_SENSOR";

export interface MarineBelief<T = any> {
  id: string;
  label: string;
  value: T;
  unit?: string;
  confidence: number; // 0.0 - 1.0 (e.g. 0.94)
  source: DataSource;
  timestamp: string;
  status?: "optimal" | "warning" | "hazardous" | "neutral";
}

export interface CounterfactualScenario {
  id: string;
  scenarioName: string;
  description: string;
  parameters: Record<string, string | number>;
  predictedOutcome: string;
  riskScore: number; // 0 - 100
  riskTier: RiskTier;
  recommended: boolean;
}

export interface MapFeature {
  id: string;
  type: "PFZ_POINT" | "HAZARD_ZONE" | "ROUTE_WAYPOINT" | "GEOFENCE_BOUNDARY" | "PORT";
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  properties: Record<string, any>;
}

export interface TimeSeriesPoint {
  time: string;
  waveHeight: number; // meters
  windSpeed: number; // knots
  sst: number; // deg C
  confidenceLow?: number;
  confidenceHigh?: number;
}

export interface DecisionResponse {
  id: string;
  query: string;
  timestamp: string;
  targetRole?: UserRole;
  scope: TopicScope;
  recommendation: string;
  summaryRationale: string;
  riskTier: RiskTier;
  confidenceScore: number; // 0 - 100
  approvalStatus: ApprovalStatus;
  validityPeriod: {
    validFrom: string;
    validUntil: string;
    recheckRecommendedAt: string;
  };
  keyEvidence: MarineBelief[];
  causalExplanation: {
    primaryDrivers: string[];
    narrative: string;
  };
  counterfactuals: CounterfactualScenario[];
  criticalUncertainty: {
    variable: string;
    threshold: string;
    impactDescription: string;
  };
  mapFeatures?: MapFeature[];
  timeSeriesData?: TimeSeriesPoint[];
}

export interface ActiveTrip {
  id: string;
  status: "EN_ROUTE" | "SCHEDULED" | "COMPLETED" | "NO_ACTIVE_TRIP";
  departurePort: string;
  destinationZone: string;
  departureTime: string;
  estimatedReturnTime: string;
  vesselName: string;
  vesselType: string;
  seaStateStatus: string;
  currentRisk: RiskTier;
  distanceNM: number;
}

