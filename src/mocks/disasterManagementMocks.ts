// Disaster Management Mock Data
// Professional/official data with source attribution — matches Research Analytics pattern.
// Reuses harbour reference data and PREDEFINED_REGIONS from shared datasets.

import { PREDEFINED_REGIONS } from "./researchMocks";
import { SeverityLevel, SEVERITY_CONFIG } from "./coastalAuthorityMocks";

export { PREDEFINED_REGIONS, SEVERITY_CONFIG };
export type { SeverityLevel };

// ─── HAZARD SEVERITY CLASSIFICATION ─────────────────────────────────
export type HazardSeverityClass = "advisory" | "warning" | "severe";

export const HAZARD_SEVERITY_CONFIG: Record<HazardSeverityClass, { label: string; color: string; bg: string; border: string; icon: string }> = {
  advisory: { label: "Advisory",  color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200",  icon: "⚠️" },
  warning:  { label: "Warning",   color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", icon: "🔶" },
  severe:   { label: "Severe",    color: "text-rose-700",   bg: "bg-rose-50",   border: "border-rose-200",   icon: "🔴" },
};

// ─── ACTIVE HAZARD DATA ─────────────────────────────────────────────
export interface ActiveHazard {
  id: string;
  name: string;
  type: "cyclone" | "storm" | "tsunami" | "surge";
  severity: HazardSeverityClass;
  currentPosition: { lat: number; lon: number };
  trackPoints: { lat: number; lon: number; timestamp: string }[];
  windSpeed: string;
  pressure: string;
  movementDirection: string;
  movementSpeed: string;
  estimatedLandfall: string;
  estimatedTimeline: string;
  sourceBulletin: string;
  bulletinTimestamp: string;
  affectedRegions: string[];
}

export const ACTIVE_HAZARDS: ActiveHazard[] = [
  {
    id: "cyclone_dana_2024",
    name: "Cyclone DANA",
    type: "cyclone",
    severity: "warning",
    currentPosition: { lat: 14.5, lon: 86.2 },
    trackPoints: [
      { lat: 12.0, lon: 88.5, timestamp: "2024-07-26T00:00:00Z" },
      { lat: 12.8, lon: 87.8, timestamp: "2024-07-26T12:00:00Z" },
      { lat: 13.5, lon: 87.1, timestamp: "2024-07-27T00:00:00Z" },
      { lat: 14.0, lon: 86.6, timestamp: "2024-07-27T12:00:00Z" },
      { lat: 14.5, lon: 86.2, timestamp: "2024-07-28T00:00:00Z" },
    ],
    windSpeed: "85 km/h (gusting to 110 km/h)",
    pressure: "986 hPa",
    movementDirection: "NW",
    movementSpeed: "14 km/h",
    estimatedLandfall: "Visakhapatnam–Gopalpur coast",
    estimatedTimeline: "30–36 hours from now",
    sourceBulletin: "IMD Tropical Cyclone Advisory #14",
    bulletinTimestamp: "2024-07-28T06:00:00Z",
    affectedRegions: ["Visakhapatnam Offshore", "Chennai Coastal Waters", "Andaman Sea (Port Blair)"],
  },
];

export const NO_ACTIVE_HAZARDS: ActiveHazard[] = [];

// ─── HARBOUR REFERENCE DATA (Shared) ───────────────────────────────
export interface HarbourReference {
  id: string;
  name: string;
  coordinates: { lat: number; lon: number };
  district: string;
  state: string;
  capacity: string;
  inProjectedPath: boolean;
}

export const HARBOUR_LOCATIONS: HarbourReference[] = [
  { id: "h_vizag",      name: "Visakhapatnam Fishing Harbour", coordinates: { lat: 17.69, lon: 83.29 }, district: "Visakhapatnam", state: "Andhra Pradesh",  capacity: "Large",  inProjectedPath: true },
  { id: "h_kakinada",   name: "Kakinada Anchorage",            coordinates: { lat: 16.94, lon: 82.24 }, district: "East Godavari",  state: "Andhra Pradesh",  capacity: "Medium", inProjectedPath: true },
  { id: "h_gopalpur",   name: "Gopalpur Port",                 coordinates: { lat: 19.26, lon: 84.90 }, district: "Ganjam",         state: "Odisha",          capacity: "Medium", inProjectedPath: true },
  { id: "h_paradip",    name: "Paradip Fishing Harbour",       coordinates: { lat: 20.27, lon: 86.70 }, district: "Jagatsinghpur", state: "Odisha",          capacity: "Large",  inProjectedPath: false },
  { id: "h_chennai",    name: "Chennai Fishing Harbour",       coordinates: { lat: 13.10, lon: 80.29 }, district: "Chennai",        state: "Tamil Nadu",      capacity: "Large",  inProjectedPath: false },
  { id: "h_rameswaram", name: "Rameswaram Harbour",            coordinates: { lat: 9.28,  lon: 79.31 }, district: "Ramanathapuram", state: "Tamil Nadu",      capacity: "Medium", inProjectedPath: false },
  { id: "h_kochi",      name: "Kochi Fishing Harbour",         coordinates: { lat: 9.97,  lon: 76.24 }, district: "Ernakulam",      state: "Kerala",          capacity: "Large",  inProjectedPath: false },
  { id: "h_mangalore",  name: "Mangalore Fishing Harbour",     coordinates: { lat: 12.85, lon: 74.84 }, district: "Dakshina Kannada", state: "Karnataka",    capacity: "Medium", inProjectedPath: false },
];

// ─── EXPOSURE ASSESSMENT DATA ───────────────────────────────────────
export interface ExposureAssessment {
  hazardId: string;
  harboursInPath: number;
  harboursTotal: number;
  estimatedAtSeaVessels: number; // Simulated — clearly labeled
  estimatedTimeToImpact: string;
  projectedPathZones: string[];
  impactedHarbours: HarbourReference[];
}

export const EXPOSURE_DATA: ExposureAssessment = {
  hazardId: "cyclone_dana_2024",
  harboursInPath: 3,
  harboursTotal: 8,
  estimatedAtSeaVessels: 142, // Simulated
  estimatedTimeToImpact: "30–36 hours",
  projectedPathZones: ["Visakhapatnam Offshore", "East Godavari Coast", "Gopalpur–Ganjam Coast"],
  impactedHarbours: HARBOUR_LOCATIONS.filter((h) => h.inProjectedPath),
};

// ─── ALERT DRAFTING DATA ────────────────────────────────────────────
export type AlertLanguage = "en" | "ta" | "hi" | "te" | "ml" | "bn";

export interface AlertLanguageOption {
  code: AlertLanguage;
  name: string;
  nativeName: string;
}

export const ALERT_LANGUAGES: AlertLanguageOption[] = [
  { code: "en", name: "English",   nativeName: "English" },
  { code: "ta", name: "Tamil",     nativeName: "தமிழ்" },
  { code: "hi", name: "Hindi",     nativeName: "हिन्दी" },
  { code: "te", name: "Telugu",    nativeName: "తెలుగు" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "bn", name: "Bengali",   nativeName: "বাংলা" },
];

export interface GeneratedAlertBlock {
  language: AlertLanguage;
  languageName: string;
  nativeName: string;
  subject: string;
  body: string;
}

// Template generator
export function generateAlertTexts(
  hazardType: string,
  region: string,
  languages: AlertLanguage[]
): GeneratedAlertBlock[] {
  const templates: Record<AlertLanguage, { subject: string; body: string }> = {
    en: {
      subject: `${hazardType} Alert — ${region}`,
      body: `URGENT: A ${hazardType.toLowerCase()} alert has been issued for ${region}. All fishing vessels are advised to return to the nearest harbour immediately. Coastal residents in low-lying areas should move to designated shelters. This alert is valid until further notice. Stay tuned to All India Radio and local authorities for updates. Do NOT venture into the sea. Source: India Meteorological Department.`,
    },
    ta: {
      subject: `${hazardType} எச்சரிக்கை — ${region}`,
      body: `அவசரம்: ${region} பகுதிக்கு ${hazardType.toLowerCase()} எச்சரிக்கை வழங்கப்பட்டுள்ளது. அனைத்து மீன்பிடி படகுகளும் உடனடியாக அருகிலுள்ள துறைமுகத்திற்கு திரும்ப அறிவுறுத்தப்படுகிறது. கடலோர பகுதியில் தாழ்வான பகுதிகளில் வசிப்போர் நியமிக்கப்பட்ட தங்குமிடங்களுக்கு செல்லவும். ஆல் இந்தியா ரேடியோ மற்றும் உள்ளூர் அதிகாரிகளின் அறிவிப்புகளைக் கவனியுங்கள். ஆதாரம்: இந்திய வானிலை ஆய்வு மையம்.`,
    },
    hi: {
      subject: `${hazardType} चेतावनी — ${region}`,
      body: `तत्काल: ${region} के लिए ${hazardType.toLowerCase()} चेतावनी जारी की गई है। सभी मछली पकड़ने वाली नौकाओं को तुरंत निकटतम बंदरगाह लौटने की सलाह दी जाती है। तटीय क्षेत्रों में निचले इलाकों के निवासियों को निर्धारित आश्रय स्थलों में जाना चाहिए। अपडेट के लिए ऑल इंडिया रेडियो और स्थानीय अधिकारियों की सूचनाओं पर ध्यान दें। स्रोत: भारत मौसम विज्ञान विभाग।`,
    },
    te: {
      subject: `${hazardType} హెచ్చరిక — ${region}`,
      body: `అత్యవసరం: ${region} ప్రాంతానికి ${hazardType.toLowerCase()} హెచ్చరిక జారీ చేయబడింది. అన్ని చేపల పడవలు వెంటనే సమీపంలోని రేవుకు తిరిగి రావాలి. తీర ప్రాంతాల్లో తక్కువ ప్రదేశాల్లో నివసించే వారు నిర్ణీత ఆశ్రయ కేంద్రాలకు వెళ్ళాలి. ఆల్ ఇండియా రేడియో మరియు స్థానిక అధికారుల నవీకరణలను అనుసరించండి. మూలం: భారత వాతావరణ శాఖ.`,
    },
    ml: {
      subject: `${hazardType} മുന്നറിയിപ്പ് — ${region}`,
      body: `അടിയന്തരം: ${region} പ്രദേശത്തേക്ക് ${hazardType.toLowerCase()} മുന്നറിയിപ്പ് നൽകിയിരിക്കുന്നു. എല്ലാ മത്സ്യബന്ധന ബോട്ടുകളും ഉടൻ സമീപത്തുള്ള തുറമുഖത്തേക്ക് മടങ്ങണം. തീരദേശ പ്രദേശങ്ങളിലെ താഴ്ന്ന പ്രദേശങ്ങളിൽ താമസിക്കുന്നവർ നിശ്ചിത ഷെൽട്ടറുകളിലേക്ക് മാറണം. ഓൾ ഇന്ത്യ റേഡിയോയും പ്രാദേശിക അധികാരികളും നൽകുന്ന അറിയിപ്പുകൾ ശ്രദ്ധിക്കുക. ഉറവിടം: ഇന്ത്യ കാലാവസ്ഥ വകുപ്പ്.`,
    },
    bn: {
      subject: `${hazardType} সতর্কতা — ${region}`,
      body: `জরুরি: ${region} এলাকার জন্য ${hazardType.toLowerCase()} সতর্কতা জারি করা হয়েছে। সমস্ত মাছ ধরার নৌকাগুলিকে অবিলম্বে নিকটতম বন্দরে ফিরে আসার পরামর্শ দেওয়া হচ্ছে। উপকূলীয় এলাকার নিচু অঞ্চলের বাসিন্দাদের নির্ধারিত আশ্রয়কেন্দ্রে যেতে হবে। অল ইন্ডিয়া রেডিও এবং স্থানীয় কর্তৃপক্ষের আপডেট অনুসরণ করুন। সূত্র: ভারত আবহাওয়া বিভাগ।`,
    },
  };

  return languages.map((lang) => ({
    language: lang,
    languageName: ALERT_LANGUAGES.find((l) => l.code === lang)?.name || lang,
    nativeName: ALERT_LANGUAGES.find((l) => l.code === lang)?.nativeName || lang,
    subject: templates[lang]?.subject || templates.en.subject,
    body: templates[lang]?.body || templates.en.body,
  }));
}
