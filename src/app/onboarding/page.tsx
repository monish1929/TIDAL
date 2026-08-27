"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Anchor,
  Microscope,
  ShieldCheck,
  AlertTriangle,
  Navigation,
  Globe,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Waves,
  Info,
  Check,
  Ship,
  MapPin,
  Search,
  Volume2,
  AlertCircle,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LanguageSelector } from "@/components/language-selector";
import {
  getStoredUserProfile,
  saveUserProfile,
  getStoredLanguage,
  AVAILABLE_LANGUAGES,
} from "@/lib/storage";
import { UserRole, LanguageCode, RoleDetails } from "@/types/user";

interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: "FISHERMAN",
    title: "Fisherman",
    description: "Vessel safety, PFZ locations, sea condition forecasts & maritime boundary alerts.",
    icon: Anchor,
    tag: "Safety & Harvest",
  },
  {
    id: "RESEARCHER",
    title: "Researcher",
    description: "Long-term oceanographic trends, SST/chlorophyll anomalies & deep data export.",
    icon: Microscope,
    tag: "Analytics & Trends",
  },
  {
    id: "COASTAL_AUTHORITY",
    title: "Coastal Authority",
    description: "Jurisdiction-wide hazard tracking, zone boundary monitoring & official briefings.",
    icon: ShieldCheck,
    tag: "Jurisdiction & Compliance",
  },
  {
    id: "DISASTER_MANAGEMENT",
    title: "Disaster Management Agency",
    description: "Active hazard tracking, coastal exposure analysis & multilingual emergency alerts.",
    icon: AlertTriangle,
    tag: "Crisis & Exposure",
  },
  {
    id: "MARITIME_OPERATOR",
    title: "Maritime Operator",
    description: "Route safety optimization, weather operating envelopes & navigation compliance.",
    icon: Navigation,
    tag: "Routing & Fleet",
  },
  {
    id: "GENERAL",
    title: "Other / General User",
    description: "Universal marine decision copilot, coastal weather insights & interactive GIS explorer.",
    icon: Globe,
    tag: "Universal Copilot",
  },
];

// Visual Boat Cards for Fisherman
interface BoatOption {
  id: string;
  title: string;
  sizeRange: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const FISHERMAN_BOAT_OPTIONS: BoatOption[] = [
  {
    id: "Small Non-Motorized Craft (< 20ft / < 6m)",
    title: "Small Boat / Canoe",
    sizeRange: "< 20ft (< 6m)",
    description: "Non-motorized / Traditional craft for near-shore waters",
    icon: Anchor,
  },
  {
    id: "Motorized Fiber Boat (20–28ft with Outboard Motor)",
    title: "Motorized Fiber Boat",
    sizeRange: "20–28ft (6–9m)",
    description: "FRP boat with outboard motor (OBM)",
    icon: Ship,
  },
  {
    id: "Medium Mechanized Trawler (30–45ft)",
    title: "Medium Trawler",
    sizeRange: "30–45ft (10–14m)",
    description: "Mechanized gillnetter / single-day trawler",
    icon: Compass,
  },
  {
    id: "Deep-Sea Multi-Day Trawler (> 45ft / > 14m)",
    title: "Large Trawler",
    sizeRange: "> 45ft (> 14m)",
    description: "Deep-sea multi-day voyage vessel",
    icon: Navigation,
  },
];

// Prominent coastal harbours & landing centers across India
const PROMINENT_HARBOURS = [
  { name: "Rameswaram Fishing Jetty", state: "Tamil Nadu", coast: "East Coast" },
  { name: "Kasimedu Fishing Harbour (Chennai)", state: "Tamil Nadu", coast: "East Coast" },
  { name: "Kochi Fishery Harbour (Thoppumpady)", state: "Kerala", coast: "West Coast" },
  { name: "Sassoon Dock & Bhaucha Dhakka (Mumbai)", state: "Maharashtra", coast: "West Coast" },
  { name: "Visakhapatnam Fishing Harbour", state: "Andhra Pradesh", coast: "East Coast" },
  { name: "Veraval Fishery Harbour", state: "Gujarat", coast: "West Coast" },
  { name: "Paradeep Fishing Harbour", state: "Odisha", coast: "East Coast" },
  { name: "Mangalore Old Port (Bunder)", state: "Karnataka", coast: "West Coast" },
  { name: "Kanyakumari & Colachel Jetty", state: "Tamil Nadu", coast: "South Coast" },
  { name: "Kakinada Fishing Harbour", state: "Andhra Pradesh", coast: "East Coast" },
  { name: "Malpe Fishery Harbour (Udupi)", state: "Karnataka", coast: "West Coast" },
  { name: "Porbandar Fishing Harbour", state: "Gujarat", coast: "West Coast" },
];

export default function OnboardingPage() {
  const router = useRouter();

  // Navigation & Step State (1: Role, 2: Details, 3: Confirm)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>("FISHERMAN");
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(getStoredLanguage());

  // Step 2 Form States — all empty by default (no test data)
  // Fisherman (Visual Tap-based)
  const [boatType, setBoatType] = useState("");
  const [homeHarbour, setHomeHarbour] = useState("");
  const [harbourSearch, setHarbourSearch] = useState("");
  const [isLocationDetecting, setIsLocationDetecting] = useState(false);
  const [fishingRange, setFishingRange] = useState<"NEAR_SHORE" | "DEEP_SEA">("NEAR_SHORE");

  // Researcher
  const [areaOfInterest, setAreaOfInterest] = useState<"FISHERIES_SCIENCE" | "OCEANOGRAPHY" | "CONSERVATION">("OCEANOGRAPHY");
  const [outputDepth, setOutputDepth] = useState<"SUMMARY" | "RAW_DATA">("SUMMARY");

  // Coastal Authority
  const [jurisdiction, setJurisdiction] = useState("");

  // Disaster Management
  const [districtOfResponsibility, setDistrictOfResponsibility] = useState("");

  // Maritime Operator
  const [vesselType, setVesselType] = useState("");
  const [routeRange, setRouteRange] = useState<"COASTAL_WATERS" | "INTERNATIONAL_VOYAGE">("COASTAL_WATERS");

  // Inline Validation Errors for Step 2
  const [step2Errors, setStep2Errors] = useState<Record<string, string>>({});

  // Verify auth on mount
  useEffect(() => {
    const profile = getStoredUserProfile();
    if (!profile || !profile.isAuthenticated) {
      router.replace("/login");
    } else {
      if (profile.languagePreference) {
        setSelectedLanguage(profile.languagePreference);
      }
    }
  }, [router]);

  // Dynamic step calculations based on path
  const isGeneralPath = selectedRole === "GENERAL";
  const totalSteps = isGeneralPath ? 2 : 3;
  const visibleStepIndex = isGeneralPath && currentStep === 3 ? 2 : currentStep;
  const progressPercentage = Math.round((visibleStepIndex / totalSteps) * 100);

  // Handle GPS location tap for fishermen
  const handleUseCurrentLocation = () => {
    setIsLocationDetecting(true);
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(2);
          const lon = pos.coords.longitude.toFixed(2);
          const detected = `Near Coastal Coordinates (${lat}° N, ${lon}° E)`;
          setHomeHarbour(detected);
          setHarbourSearch(detected);
          setIsLocationDetecting(false);
          if (step2Errors.homeHarbour) setStep2Errors((p) => ({ ...p, homeHarbour: "" }));
        },
        () => {
          // Fallback location
          const fallback = "Coastal Landing Jetty (GPS Location)";
          setHomeHarbour(fallback);
          setHarbourSearch(fallback);
          setIsLocationDetecting(false);
          if (step2Errors.homeHarbour) setStep2Errors((p) => ({ ...p, homeHarbour: "" }));
        },
        { timeout: 5000 }
      );
    } else {
      const fallback = "Coastal Landing Jetty (GPS Location)";
      setHomeHarbour(fallback);
      setHarbourSearch(fallback);
      setIsLocationDetecting(false);
      if (step2Errors.homeHarbour) setStep2Errors((p) => ({ ...p, homeHarbour: "" }));
    }
  };

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};

    switch (selectedRole) {
      case "FISHERMAN":
        if (!boatType.trim()) {
          errors.boatType = "Please tap and select your boat type above";
        }
        if (!homeHarbour.trim()) {
          errors.homeHarbour = "Please select or tap your home harbour / landing center";
        }
        break;

      case "COASTAL_AUTHORITY":
        if (!jurisdiction.trim()) {
          errors.jurisdiction = "This field is required";
        }
        break;

      case "DISASTER_MANAGEMENT":
        if (!districtOfResponsibility.trim()) {
          errors.districtOfResponsibility = "This field is required";
        }
        break;

      case "MARITIME_OPERATOR":
        if (!vesselType.trim()) {
          errors.vesselType = "This field is required";
        }
        break;

      case "RESEARCHER":
      case "GENERAL":
      default:
        break;
    }

    setStep2Errors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinue = () => {
    if (currentStep === 1) {
      if (selectedRole === "GENERAL") {
        // Skip Step 2 directly to Step 3
        setCurrentStep(3);
      } else {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (!validateStep2()) {
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep === 3) {
      if (selectedRole === "GENERAL") {
        setCurrentStep(1);
      } else {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const constructRoleDetails = (): RoleDetails => {
    switch (selectedRole) {
      case "FISHERMAN":
        return { boatType, homeHarbour, fishingRange };
      case "RESEARCHER":
        return { areaOfInterest, outputDepth };
      case "COASTAL_AUTHORITY":
        return { jurisdiction };
      case "DISASTER_MANAGEMENT":
        return { districtOfResponsibility };
      case "MARITIME_OPERATOR":
        return { vesselType, routeRange };
      case "GENERAL":
      default:
        return {};
    }
  };

  const handleComplete = () => {
    const details = constructRoleDetails();
    saveUserProfile({
      role: selectedRole,
      roleDetails: details,
      languagePreference: selectedLanguage,
      isAuthenticated: true,
    });
    router.push("/dashboard");
  };

  // Step Title & Subtitle
  const getStepTitle = () => {
    if (currentStep === 1) return "Select Your Primary Role";
    if (currentStep === 2) {
      return selectedRole === "FISHERMAN"
        ? "Your Boat & Harbour Details"
        : "Configure Operational Parameters";
    }
    return "Confirm Preferences & Launch";
  };

  const getStepSubtitle = () => {
    if (currentStep === 1)
      return "TIDAL tailors its default decision intelligence focus, safety thresholds, and map layers to your domain.";
    if (currentStep === 2) {
      return selectedRole === "FISHERMAN"
        ? "Tap your boat size and select your landing harbour so TIDAL can check sea conditions and wave safety for you."
        : "Provide operational context so the reasoning agents can evaluate exact safety envelopes and constraints.";
    }
    return "Review your configuration. You can modify these settings anytime from your profile.";
  };

  // Filtered harbours list for Fisherman
  const filteredHarbours = PROMINENT_HARBOURS.filter((h) =>
    h.name.toLowerCase().includes(harbourSearch.toLowerCase()) ||
    h.state.toLowerCase().includes(harbourSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-2 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm">
            <Waves className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold tracking-tight text-dark-text text-base">TIDAL</span>
            <span className="text-[11px] font-normal text-dark-muted ml-2">
              Onboarding & Role Setup
            </span>
          </div>
        </div>

        <LanguageSelector
          currentLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />
      </header>

      {/* Main Wizard Container */}
      <main className="w-full max-w-3xl mx-auto my-auto py-6">
        {/* Dynamic Minimal Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-dark-muted mb-2 uppercase">
            <span>
              Step {visibleStepIndex} of {totalSteps} •{" "}
              {currentStep === 1
                ? "Primary Role"
                : currentStep === 2
                ? selectedRole === "FISHERMAN" ? "Boat & Harbour" : "Operational Details"
                : "Confirmation"}
            </span>
            <span className="text-primary font-medium">
              {progressPercentage}% Completed
            </span>
          </div>

          {/* Segmented bar matching exact path step count */}
          <div className="w-full bg-gray-200 h-[3px] rounded-full overflow-hidden flex gap-1">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                className={`h-full flex-1 transition-all duration-300 ${
                  visibleStepIndex >= idx + 1 ? "bg-primary" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Heading */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-dark-text tracking-tight">
              {getStepTitle()}
            </h1>
            {/* Audio narration placeholder icon */}
            <button
              type="button"
              title="Listen in your language"
              className="p-2 text-dark-muted hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs sm:text-sm text-dark-muted mt-1 leading-relaxed">
            {getStepSubtitle()}
          </p>
        </div>

        {/* STEP 1: ROLE SELECTION CARDS */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {ROLE_OPTIONS.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <div
                  key={role.id}
                  onClick={() => {
                    setSelectedRole(role.id);
                    setStep2Errors({});
                  }}
                  className={`group relative p-4 rounded-xl cursor-pointer transition-all border text-left flex flex-col justify-between ${
                    isSelected
                      ? "bg-blue-50/70 border-primary ring-1 ring-primary shadow-subtle"
                      : "bg-surface border-border hover:border-gray-300 hover:bg-gray-50/60 shadow-card"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-dark-muted group-hover:text-dark-text"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            isSelected
                              ? "bg-blue-100/80 text-primary font-semibold"
                              : "bg-gray-100 text-dark-muted"
                          }`}
                        >
                          {role.tag}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-white">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </div>

                    <h2
                      className={`text-sm tracking-tight ${
                        isSelected ? "text-blue-950 font-semibold" : "text-dark-text font-medium"
                      }`}
                    >
                      {role.title}
                    </h2>
                    <p
                      className={`text-xs mt-1 leading-relaxed ${
                        isSelected ? "text-blue-900/80 font-normal" : "text-dark-muted"
                      }`}
                    >
                      {role.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* STEP 2: ROLE-SPECIFIC FOLLOW-UP */}
        {currentStep === 2 && (
          <div className="bg-surface border border-border rounded-xl p-5 sm:p-7 shadow-card space-y-6">
            <div className="flex items-center gap-3 p-3 bg-blue-50/60 border border-blue-200/60 rounded-lg text-xs text-blue-950">
              <Info className="w-4 h-4 text-primary shrink-0" />
              <span>
                Configuring parameters for:{" "}
                <strong>
                  {ROLE_OPTIONS.find((r) => r.id === selectedRole)?.title}
                </strong>
              </span>
            </div>

            {/* LOW-LITERACY TAP-FRIENDLY FISHERMAN FORM */}
            {selectedRole === "FISHERMAN" && (
              <div className="space-y-6">
                {/* 1. Boat Category & Size (Visual Icon Cards) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-dark-text flex items-center gap-1.5">
                      <span>1. Tap Your Boat Size & Type</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-dark-muted">Tap 1 option</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {FISHERMAN_BOAT_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = boatType === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => {
                            setBoatType(opt.id);
                            if (step2Errors.boatType) setStep2Errors((p) => ({ ...p, boatType: "" }));
                          }}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 select-none ${
                            isSelected
                              ? "bg-blue-50/80 border-primary ring-1 ring-primary shadow-subtle"
                              : "bg-white border-border hover:bg-gray-50 hover:border-gray-300"
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-dark-muted"
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3
                                className={`text-xs tracking-tight truncate ${
                                  isSelected ? "font-semibold text-blue-950" : "font-medium text-dark-text"
                                }`}
                              >
                                {opt.title}
                              </h3>
                              {isSelected && (
                                <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-white shrink-0 ml-1">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                              )}
                            </div>
                            <span className="inline-block text-[10px] font-semibold text-primary/90 mt-0.5">
                              {opt.sizeRange}
                            </span>
                            <p className="text-[11px] text-dark-muted mt-0.5 line-clamp-1">
                              {opt.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {step2Errors.boatType && (
                    <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{step2Errors.boatType}</span>
                    </div>
                  )}
                </div>

                {/* 2. Home Harbour (Searchable Tap-List + GPS Detect) */}
                <div className="space-y-2.5 pt-2 border-t border-border/70">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-dark-text flex items-center gap-1.5">
                      <span>2. Select Your Home Landing Harbour</span>
                      <span className="text-rose-500">*</span>
                    </label>
                  </div>

                  {/* Location Action Bar: Search input & GPS Button */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-2 relative">
                      <Search className="w-3.5 h-3.5 text-dark-muted absolute left-3 top-3" />
                      <Input
                        type="text"
                        value={harbourSearch}
                        onChange={(e) => {
                          setHarbourSearch(e.target.value);
                          setHomeHarbour(e.target.value);
                          if (step2Errors.homeHarbour) setStep2Errors((p) => ({ ...p, homeHarbour: "" }));
                        }}
                        placeholder="Search harbour name or region..."
                        className="pl-8 text-xs h-9"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleUseCurrentLocation}
                      disabled={isLocationDetecting}
                      className="h-9 text-xs gap-1.5 w-full justify-center bg-blue-50/50 hover:bg-blue-100/70 border-blue-200 text-blue-900 font-medium"
                    >
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{isLocationDetecting ? "Detecting GPS..." : "Use Current GPS"}</span>
                    </Button>
                  </div>

                  {/* Quick-Pick Tappable Harbours Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-1 bg-gray-50/80 rounded-lg border border-gray-200/70">
                    {filteredHarbours.map((h) => {
                      const isSelected = homeHarbour === h.name;
                      return (
                        <button
                          key={h.name}
                          type="button"
                          onClick={() => {
                            setHomeHarbour(h.name);
                            setHarbourSearch(h.name);
                            if (step2Errors.homeHarbour) setStep2Errors((p) => ({ ...p, homeHarbour: "" }));
                          }}
                          className={`p-2 rounded-md text-left text-xs transition-colors border ${
                            isSelected
                              ? "bg-blue-50 border-primary text-blue-950 font-semibold"
                              : "bg-white border-border/80 text-dark-text hover:bg-gray-100/80"
                          }`}
                        >
                          <div className="truncate font-medium text-[11px]">{h.name}</div>
                          <div className="text-[10px] text-dark-muted truncate">{h.state}</div>
                        </button>
                      );
                    })}
                  </div>

                  {homeHarbour && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-950">
                      <div className="flex items-center gap-1.5 truncate">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">
                          Selected Harbour: <strong>{homeHarbour}</strong>
                        </span>
                      </div>
                      <Badge variant="safe" className="text-[10px] shrink-0 ml-2">
                        Active
                      </Badge>
                    </div>
                  )}

                  {step2Errors.homeHarbour && (
                    <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{step2Errors.homeHarbour}</span>
                    </div>
                  )}
                </div>

                {/* 3. Fishing Range (Tappable Cards) */}
                <div className="space-y-2.5 pt-2 border-t border-border/70">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-dark-text flex items-center gap-1.5">
                      <span>3. Typical Fishing Range</span>
                    </label>
                    <span className="text-[11px] text-dark-muted">Tap 1 option</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFishingRange("NEAR_SHORE")}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        fishingRange === "NEAR_SHORE"
                          ? "bg-blue-50/80 border-primary font-semibold text-blue-950 ring-1 ring-primary"
                          : "bg-white border-border text-dark-text hover:bg-gray-50"
                      }`}
                    >
                      <div className="font-semibold text-xs">Near-Shore Coastal</div>
                      <div className="text-[11px] text-dark-muted mt-0.5">&lt; 12 Nautical Miles (Single Day)</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFishingRange("DEEP_SEA")}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        fishingRange === "DEEP_SEA"
                          ? "bg-blue-50/80 border-primary font-semibold text-blue-950 ring-1 ring-primary"
                          : "bg-white border-border text-dark-text hover:bg-gray-50"
                      }`}
                    >
                      <div className="font-semibold text-xs">Deep-Sea & EEZ</div>
                      <div className="text-[11px] text-dark-muted mt-0.5">&gt; 12 Nautical Miles (Multi-Day)</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* RESEARCHER FORM */}
            {selectedRole === "RESEARCHER" && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-dark-text">
                    Primary Area of Research
                  </label>
                  <select
                    value={areaOfInterest}
                    onChange={(e) => setAreaOfInterest(e.target.value as any)}
                    className="w-full h-10 px-3 border border-border rounded-[9px] bg-white text-sm text-dark-text focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="OCEANOGRAPHY">Physical & Chemical Oceanography (SST, Salinity, Currents)</option>
                    <option value="FISHERIES_SCIENCE">Fisheries Dynamics & Pelagic Productivity</option>
                    <option value="CONSERVATION">Marine Ecology & Protected Area Conservation</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-text">
                    Preferred Intelligence Output Depth
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setOutputDepth("SUMMARY")}
                      className={`p-3 rounded-lg border text-left text-xs transition-colors ${
                        outputDepth === "SUMMARY"
                          ? "bg-blue-50/70 border-primary font-semibold text-blue-950"
                          : "bg-white border-border text-dark-text hover:bg-gray-50"
                      }`}
                    >
                      <div className="font-medium">Executive Summaries</div>
                      <div className="text-[11px] text-dark-muted mt-0.5">Concise findings & key causal drivers</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOutputDepth("RAW_DATA")}
                      className={`p-3 rounded-lg border text-left text-xs transition-colors ${
                        outputDepth === "RAW_DATA"
                          ? "bg-blue-50/70 border-primary font-semibold text-blue-950"
                          : "bg-white border-border text-dark-text hover:bg-gray-50"
                      }`}
                    >
                      <div className="font-medium">Deep Telemetry & Raw Data</div>
                      <div className="text-[11px] text-dark-muted mt-0.5">Time-series tables, NetCDF exports & confidence bands</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* COASTAL AUTHORITY FORM */}
            {selectedRole === "COASTAL_AUTHORITY" && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-dark-text">
                    Jurisdiction / Maritime Zone Overseen <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={jurisdiction}
                    onChange={(e) => {
                      setJurisdiction(e.target.value);
                      if (step2Errors.jurisdiction) setStep2Errors((p) => ({ ...p, jurisdiction: "" }));
                    }}
                    placeholder="Enter maritime zone, district or state coastal boundary"
                    className={step2Errors.jurisdiction ? "border-rose-300 focus-visible:ring-rose-400" : ""}
                  />
                  <p className="text-[11px] text-dark-muted">
                    Spatial bounds will be automatically resolved for boundary alerts and monitoring.
                  </p>
                  {step2Errors.jurisdiction && (
                    <p className="text-[11px] text-rose-600 font-medium">{step2Errors.jurisdiction}</p>
                  )}
                </div>
              </div>
            )}

            {/* DISASTER MANAGEMENT FORM */}
            {selectedRole === "DISASTER_MANAGEMENT" && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-dark-text">
                    District or Coastal Belt of Responsibility <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={districtOfResponsibility}
                    onChange={(e) => {
                      setDistrictOfResponsibility(e.target.value);
                      if (step2Errors.districtOfResponsibility)
                        setStep2Errors((p) => ({ ...p, districtOfResponsibility: "" }));
                    }}
                    placeholder="Enter district or coastal operational zone"
                    className={step2Errors.districtOfResponsibility ? "border-rose-300 focus-visible:ring-rose-400" : ""}
                  />
                  <p className="text-[11px] text-dark-muted">
                    Enables automated cyclone hazard impact analysis and vulnerable coastline exposure scoring.
                  </p>
                  {step2Errors.districtOfResponsibility && (
                    <p className="text-[11px] text-rose-600 font-medium">
                      {step2Errors.districtOfResponsibility}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* MARITIME OPERATOR FORM */}
            {selectedRole === "MARITIME_OPERATOR" && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-dark-text">
                    Primary Fleet / Vessel Class <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={vesselType}
                    onChange={(e) => {
                      setVesselType(e.target.value);
                      if (step2Errors.vesselType) setStep2Errors((p) => ({ ...p, vesselType: "" }));
                    }}
                    placeholder="Enter vessel class or fleet description"
                    className={step2Errors.vesselType ? "border-rose-300 focus-visible:ring-rose-400" : ""}
                  />
                  {step2Errors.vesselType && (
                    <p className="text-[11px] text-rose-600 font-medium">{step2Errors.vesselType}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-text">
                    Operating Route Range
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRouteRange("COASTAL_WATERS")}
                      className={`p-3 rounded-lg border text-left text-xs transition-colors ${
                        routeRange === "COASTAL_WATERS"
                          ? "bg-blue-50/70 border-primary font-semibold text-blue-950"
                          : "bg-white border-border text-dark-text hover:bg-gray-50"
                      }`}
                    >
                      <div className="font-medium">Indian Coastal Waters</div>
                      <div className="text-[11px] text-dark-muted mt-0.5">Domestic coastal shipping routes</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRouteRange("INTERNATIONAL_VOYAGE")}
                      className={`p-3 rounded-lg border text-left text-xs transition-colors ${
                        routeRange === "INTERNATIONAL_VOYAGE"
                          ? "bg-blue-50/70 border-primary font-semibold text-blue-950"
                          : "bg-white border-border text-dark-text hover:bg-gray-50"
                      }`}
                    >
                      <div className="font-medium">International Passage</div>
                      <div className="text-[11px] text-dark-muted mt-0.5">Crossing EEZ boundaries / High seas</div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: CONFIRMATION & STRUCTURED SUMMARY CARD */}
        {currentStep === 3 && (
          <div className="space-y-5">
            {/* Language Confirmation Block */}
            <div className="bg-surface border border-border rounded-xl p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-dark-text">
                    Preferred Platform Language
                  </h3>
                  <p className="text-xs text-dark-muted mt-0.5">
                    Select the default language for copilot reasoning outputs and advisories.
                  </p>
                </div>
                <LanguageSelector
                  currentLanguage={selectedLanguage}
                  onLanguageChange={setSelectedLanguage}
                />
              </div>
            </div>

            {/* Structured Profile Summary Card */}
            <div className="bg-surface border border-border rounded-xl p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-primary border border-blue-200 flex items-center justify-center">
                    {(() => {
                      const Icon = ROLE_OPTIONS.find((r) => r.id === selectedRole)?.icon || Globe;
                      return <Icon className="w-5 h-5" />;
                    })()}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-dark-muted">
                      Configured Stakeholder Role
                    </span>
                    <h4 className="text-base font-semibold text-dark-text">
                      {ROLE_OPTIONS.find((r) => r.id === selectedRole)?.title}
                    </h4>
                  </div>
                </div>
                <Badge variant="blue" className="text-xs">
                  Ready to Launch
                </Badge>
              </div>

              {/* Parameters Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                {selectedRole === "FISHERMAN" && (
                  <>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200/60">
                      <span className="text-dark-muted block text-[11px]">Vessel Type</span>
                      <span className="font-semibold text-dark-text mt-0.5 block">{boatType || "Not specified"}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200/60">
                      <span className="text-dark-muted block text-[11px]">Home Harbour</span>
                      <span className="font-semibold text-dark-text mt-0.5 block">{homeHarbour || "Not specified"}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200/60 sm:col-span-2">
                      <span className="text-dark-muted block text-[11px]">Fishing Range</span>
                      <span className="font-semibold text-dark-text mt-0.5 block">
                        {fishingRange === "DEEP_SEA" ? "Deep Sea (> 12 NM)" : "Near Shore (< 12 NM)"}
                      </span>
                    </div>
                  </>
                )}

                {selectedRole === "RESEARCHER" && (
                  <>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200/60">
                      <span className="text-dark-muted block text-[11px]">Research Focus</span>
                      <span className="font-semibold text-dark-text mt-0.5 block">{areaOfInterest}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200/60">
                      <span className="text-dark-muted block text-[11px]">Output Depth</span>
                      <span className="font-semibold text-dark-text mt-0.5 block">
                        {outputDepth === "RAW_DATA" ? "Deep Telemetry & Raw Data" : "Executive Summaries"}
                      </span>
                    </div>
                  </>
                )}

                {selectedRole === "COASTAL_AUTHORITY" && (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200/60 sm:col-span-2">
                    <span className="text-dark-muted block text-[11px]">Jurisdiction</span>
                    <span className="font-semibold text-dark-text mt-0.5 block">{jurisdiction || "Not specified"}</span>
                  </div>
                )}

                {selectedRole === "DISASTER_MANAGEMENT" && (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200/60 sm:col-span-2">
                    <span className="text-dark-muted block text-[11px]">District / Coastal Region</span>
                    <span className="font-semibold text-dark-text mt-0.5 block">
                      {districtOfResponsibility || "Not specified"}
                    </span>
                  </div>
                )}

                {selectedRole === "MARITIME_OPERATOR" && (
                  <>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200/60">
                      <span className="text-dark-muted block text-[11px]">Fleet Type</span>
                      <span className="font-semibold text-dark-text mt-0.5 block">{vesselType || "Not specified"}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200/60">
                      <span className="text-dark-muted block text-[11px]">Operating Scope</span>
                      <span className="font-semibold text-dark-text mt-0.5 block">
                        {routeRange === "INTERNATIONAL_VOYAGE" ? "International Passage" : "Coastal Waters"}
                      </span>
                    </div>
                  </>
                )}

                {selectedRole === "GENERAL" && (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200/60 sm:col-span-2">
                    <span className="text-dark-muted block text-[11px]">Operating Scope</span>
                    <span className="font-semibold text-dark-text mt-0.5 block">
                      Universal Marine Decision Copilot & GIS Map Layer Explorer
                    </span>
                  </div>
                )}

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200/60 sm:col-span-2 flex items-center justify-between">
                  <div>
                    <span className="text-dark-muted block text-[11px]">Selected Language</span>
                    <span className="font-semibold text-dark-text mt-0.5 block">
                      {AVAILABLE_LANGUAGES.find((l) => l.code === selectedLanguage)?.name} (
                      {AVAILABLE_LANGUAGES.find((l) => l.code === selectedLanguage)?.nativeName})
                    </span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Action Controls */}
        <div className="mt-8 flex items-center justify-between pt-4 border-t border-border">
          {currentStep > 1 ? (
            <Button
              variant="secondary"
              onClick={handleBack}
              className="gap-1.5 h-10 px-4 text-xs font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </Button>
          ) : (
            <div />
          )}

          <Button
            onClick={handleContinue}
            className="gap-2 h-10 px-6 text-xs sm:text-sm font-semibold ml-auto"
          >
            <span>
              {currentStep === 3
                ? "Complete Setup & Launch TIDAL"
                : "Continue"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </main>


    </div>
  );
}
