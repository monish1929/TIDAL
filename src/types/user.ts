export type UserRole =
  | 'FISHERMAN'
  | 'RESEARCHER'
  | 'COASTAL_AUTHORITY'
  | 'DISASTER_MANAGEMENT'
  | 'MARITIME_OPERATOR'
  | 'GENERAL';

export type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'ml' | 'bn';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

export interface FishermanDetails {
  boatType: string;
  homeHarbour: string;
  fishingRange: 'NEAR_SHORE' | 'DEEP_SEA';
}

export interface ResearcherDetails {
  areaOfInterest: 'FISHERIES_SCIENCE' | 'OCEANOGRAPHY' | 'CONSERVATION';
  outputDepth: 'SUMMARY' | 'RAW_DATA';
}

export interface CoastalAuthorityDetails {
  jurisdiction: string;
  stationId?: string;
}

export interface DisasterManagementDetails {
  districtOfResponsibility: string;
  zoneCode?: string;
}

export interface MaritimeOperatorDetails {
  vesselType: string;
  routeRange: 'COASTAL_WATERS' | 'INTERNATIONAL_VOYAGE';
}

export type RoleDetails =
  | FishermanDetails
  | ResearcherDetails
  | CoastalAuthorityDetails
  | DisasterManagementDetails
  | MaritimeOperatorDetails
  | Record<string, never>;

export interface UserProfile {
  id: string;
  name: string;
  identifier: string; // email or phone
  role: UserRole;
  roleDetails?: RoleDetails;
  languagePreference: LanguageCode;
  isAuthenticated: boolean;
  createdAt: string;
}
