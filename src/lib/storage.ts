import { UserProfile, UserRole, LanguageCode, RoleDetails } from "@/types/user";
import { ActiveTrip } from "@/types/decision";

const ACTIVE_SESSION_KEY = "tidal_active_session";
const ACCOUNTS_REGISTRY_KEY = "tidal_accounts_registry";
const LANGUAGE_KEY = "tidal_language_preference";
const CHAT_HISTORY_PREFIX = "tidal_chat_history_";
const ACTIVE_TRIP_PREFIX = "tidal_active_trip_";

export const AVAILABLE_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
] as const;

// Helper to get all registered accounts
export function getAllRegisteredAccounts(): Record<string, UserProfile> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(ACCOUNTS_REGISTRY_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, UserProfile>;
  } catch {
    return {};
  }
}

// Find a registered account by email/phone
export function findRegisteredAccount(identifier: string): UserProfile | null {
  if (!identifier) return null;
  const accounts = getAllRegisteredAccounts();
  const key = identifier.trim().toLowerCase();
  return accounts[key] || null;
}

// Save or update an account in the registry
export function persistAccountToRegistry(profile: UserProfile): void {
  if (typeof window === "undefined" || !profile.identifier) return;
  try {
    const accounts = getAllRegisteredAccounts();
    const key = profile.identifier.trim().toLowerCase();
    accounts[key] = {
      ...accounts[key],
      ...profile,
    };
    localStorage.setItem(ACCOUNTS_REGISTRY_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error("Failed to persist account to registry:", err);
  }
}

export function getStoredLanguage(): LanguageCode {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(LANGUAGE_KEY);
  return (stored as LanguageCode) || "en";
}

export function setStoredLanguage(lang: LanguageCode): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LANGUAGE_KEY, lang);
}

export const DEFAULT_DEMO_PROFILE: UserProfile = {
  id: "user_researcher_demo",
  name: "Dr. Rajesh Kumar",
  identifier: "rajesh.kumar@incois.gov.in",
  role: "RESEARCHER",
  roleDetails: {
    areaOfInterest: "OCEANOGRAPHY",
    outputDepth: "RAW_DATA",
  },
  languagePreference: "en",
  isAuthenticated: true,
  createdAt: "2024-01-15T08:00:00Z",
};

export function getStoredUserProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_DEMO_PROFILE;
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!raw) {
      // Initialize with default demo profile so any direct route renders instantly
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(DEFAULT_DEMO_PROFILE));
      return DEFAULT_DEMO_PROFILE;
    }
    const parsed = JSON.parse(raw) as UserProfile;
    if (!parsed || !parsed.role) {
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(DEFAULT_DEMO_PROFILE));
      return DEFAULT_DEMO_PROFILE;
    }
    return parsed;
  } catch {
    return DEFAULT_DEMO_PROFILE;
  }
}

export function saveUserProfile(profile: Partial<UserProfile>): UserProfile {
  if (typeof window === "undefined") {
    return profile as UserProfile;
  }

  const current = getStoredUserProfile();
  const identifier = (profile.identifier || current?.identifier || "").trim().toLowerCase();

  // Check if account already exists in registry
  const existingAccount = identifier ? findRegisteredAccount(identifier) : null;

  const updated: UserProfile = {
    id: profile.id || current?.id || existingAccount?.id || "user_" + Math.random().toString(36).substring(2, 9),
    name: profile.name ?? current?.name ?? existingAccount?.name ?? "",
    identifier: identifier || current?.identifier || "",
    role: profile.role ?? current?.role ?? existingAccount?.role as UserRole,
    roleDetails: profile.roleDetails ?? current?.roleDetails ?? existingAccount?.roleDetails,
    languagePreference: profile.languagePreference || current?.languagePreference || existingAccount?.languagePreference || getStoredLanguage(),
    isAuthenticated: profile.isAuthenticated ?? current?.isAuthenticated ?? true,
    createdAt: current?.createdAt || existingAccount?.createdAt || new Date().toISOString(),
  };

  // Save active session
  localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(updated));

  // Persist to registry under the identifier
  if (updated.identifier) {
    persistAccountToRegistry(updated);
  }

  if (updated.languagePreference) {
    setStoredLanguage(updated.languagePreference);
  }

  return updated;
}

export function clearUserSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACTIVE_SESSION_KEY);
}

// Persistent Chat History per User
export function getUserChatHistory(identifier: string): any[] | null {
  if (typeof window === "undefined" || !identifier) return null;
  try {
    const raw = localStorage.getItem(CHAT_HISTORY_PREFIX + identifier.trim().toLowerCase());
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveUserChatHistory(identifier: string, messages: any[]): void {
  if (typeof window === "undefined" || !identifier) return;
  try {
    localStorage.setItem(
      CHAT_HISTORY_PREFIX + identifier.trim().toLowerCase(),
      JSON.stringify(messages)
    );
  } catch (err) {
    console.error("Failed to save chat history:", err);
  }
}

// Active Route / Trip Tracking for Fisherman
export function getUserActiveTrip(
  identifier: string,
  userRole: UserRole,
  roleDetails?: any
): ActiveTrip | null {
  if (userRole !== "FISHERMAN") return null;
  if (typeof window === "undefined" || !identifier) return null;

  try {
    const raw = localStorage.getItem(ACTIVE_TRIP_PREFIX + identifier.trim().toLowerCase());
    if (raw) return JSON.parse(raw);
  } catch {}

  const boatType = roleDetails?.boatType || "Mechanized Trawler (30–45ft)";
  const homeHarbour = roleDetails?.homeHarbour || "Rameswaram Fishing Jetty";

  const defaultTrip: ActiveTrip = {
    id: "trip_active_001",
    status: "EN_ROUTE",
    departurePort: homeHarbour,
    destinationZone: "PFZ Cluster Alpha (Gulf of Mannar)",
    departureTime: "05:30 AM IST",
    estimatedReturnTime: "11:30 AM IST",
    vesselName: "TN-09-MM-4421 (Sea Queen)",
    vesselType: boatType,
    seaStateStatus: "Wave 1.2m • Wind 12 kts (Safe Operating Envelope)",
    currentRisk: "LOW",
    distanceNM: 14.8,
  };

  return defaultTrip;
}

// ─── USER DATASETS PERSISTENCE ──────────────────────────────────────
const USER_DATASETS_KEY = "tidal_user_datasets";

export function getStoredUserDatasets(): any[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USER_DATASETS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStoredUserDatasets(datasets: any[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USER_DATASETS_KEY, JSON.stringify(datasets));
  } catch (err) {
    console.error("Failed to save datasets to storage:", err);
  }
}

export function deleteStoredUserDataset(id: string): any[] {
  const current = getStoredUserDatasets();
  const filtered = current.filter((d: any) => d.id !== id);
  saveStoredUserDatasets(filtered);
  return filtered;
}


