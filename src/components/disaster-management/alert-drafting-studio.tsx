"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Languages,
  Copy,
  Check,
  Sparkles,
  AlertTriangle,
  FileText,
  Layers,
  MapPin,
  Info,
  CheckSquare,
  Square,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DisasterNavHeader } from "./disaster-nav-header";
import {
  ALERT_LANGUAGES,
  AlertLanguage,
  generateAlertTexts,
  GeneratedAlertBlock,
  PREDEFINED_REGIONS,
} from "@/mocks/disasterManagementMocks";

export const AlertDraftingStudio: React.FC = () => {
  const [hazardType, setHazardType] = useState<string>("Cyclone");
  const [selectedRegion, setSelectedRegion] = useState<string>("Visakhapatnam Offshore");
  const [selectedLanguages, setSelectedLanguages] = useState<AlertLanguage[]>([
    "en",
    "ta",
    "hi",
  ]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedDrafts, setGeneratedDrafts] = useState<GeneratedAlertBlock[]>(() =>
    generateAlertTexts("Cyclone", "Visakhapatnam Offshore", ["en", "ta", "hi"])
  );
  const [copiedLang, setCopiedLang] = useState<string | null>(null);

  const toggleLanguage = (langCode: AlertLanguage) => {
    if (selectedLanguages.includes(langCode)) {
      if (selectedLanguages.length <= 1) return; // Keep at least one
      setSelectedLanguages(selectedLanguages.filter((c) => c !== langCode));
    } else {
      setSelectedLanguages([...selectedLanguages, langCode]);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const drafts = generateAlertTexts(hazardType, selectedRegion, selectedLanguages);
      setGeneratedDrafts(drafts);
      setIsGenerating(false);
    }, 400);
  };

  const handleCopy = (lang: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLang(lang);
    setTimeout(() => {
      setCopiedLang(null);
    }, 2500);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      <DisasterNavHeader
        activeTab="alerts"
        title="Alert Drafting Studio"
        subtitle="Produce standardized multilingual warning bulletins for official broadcast and coastal radio dispatch."
        showBackButton={true}
        backHref="/dashboard/disaster-management"
      />

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Top Back Link */}
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard/disaster-management"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 hover:text-rose-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Back to Disaster Management</span>
            </Link>

            <div className="text-[11px] text-dark-muted flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-violet-600" />
              <span>6 Official Coastal Languages Supported</span>
            </div>
          </div>

          {/* Alert Configuration Form Controls */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-dark-text flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-600" />
                Alert Bulletin Parameters
              </h3>
              <span className="text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full">
                Template Engine
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hazard Type Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-dark-muted uppercase tracking-wider block">
                  Hazard Classification
                </label>
                <select
                  value={hazardType}
                  onChange={(e) => setHazardType(e.target.value)}
                  className="w-full text-xs bg-gray-50 border border-border rounded-lg px-3 py-2 font-semibold text-dark-text focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                >
                  <option value="Cyclone">Severe Cyclonic Storm (Cyclone)</option>
                  <option value="High Swell Wave">High Swell Wave &amp; Surge Advisory</option>
                  <option value="Severe Lightning">Severe Coastal Lightning &amp; Squall</option>
                  <option value="Tsunami">Tsunami Watch Bulletin</option>
                  <option value="Rough Sea">Rough Sea Condition Notice</option>
                </select>
              </div>

              {/* Affected Region Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-dark-muted uppercase tracking-wider block">
                  Target Coastal Region
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full text-xs bg-gray-50 border border-border rounded-lg px-3 py-2 font-semibold text-dark-text focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                >
                  {PREDEFINED_REGIONS.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name} ({r.description})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target Languages Multi-Select */}
            <div className="space-y-2 pt-2 border-t border-border">
              <label className="text-xs font-bold text-dark-muted uppercase tracking-wider block">
                Target Regional Languages (Select Multiple)
              </label>

              <div className="flex flex-wrap gap-2">
                {ALERT_LANGUAGES.map((lang) => {
                  const isSelected = selectedLanguages.includes(lang.code);
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => toggleLanguage(lang.code)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-2 transition-all ${
                        isSelected
                          ? "bg-violet-50 border-violet-300 text-violet-950 font-semibold shadow-subtle"
                          : "bg-white border-border text-dark-muted hover:border-gray-300 hover:text-dark-text"
                      }`}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-3.5 h-3.5 text-violet-600" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-dark-light" />
                      )}
                      <span>{lang.name}</span>
                      <span className="text-[10px] text-dark-muted">({lang.nativeName})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 border-t border-border flex justify-end">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-violet-700 hover:bg-violet-800 text-white text-xs h-9 px-4 gap-1.5 shadow-subtle"
              >
                {isGenerating ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>Generate Multilingual Bulletins</span>
              </Button>
            </div>
          </div>

          {/* Generated Text Blocks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-dark-text">
                Prepared Alert Text Blocks ({generatedDrafts.length} Languages Ready)
              </h3>
              <span className="text-[11px] text-dark-muted">
                Copy text for distribution into your VHF radio, SMS gateway, or district alert systems.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedDrafts.map((draft) => {
                const isCopied = copiedLang === draft.language;
                const fullText = `Subject: ${draft.subject}\n\n${draft.body}`;

                return (
                  <div
                    key={draft.language}
                    className="bg-white border border-border rounded-2xl p-5 shadow-card space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      {/* Language Badge & Copy Button */}
                      <div className="flex items-center justify-between border-b border-border pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-violet-600" />
                          <span className="text-xs font-bold text-dark-text">
                            {draft.languageName}
                          </span>
                          <span className="text-[11px] text-dark-muted font-medium">
                            ({draft.nativeName})
                          </span>
                        </div>

                        {/* Strictly Copy Action Only — No Send / Broadcast */}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(draft.language, fullText)}
                          className="h-7 px-2.5 text-[11px] gap-1 border-border text-dark-text hover:bg-gray-50"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700 font-semibold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-dark-muted" />
                              <span>Copy Alert</span>
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Subject Line */}
                      <div className="p-2 bg-gray-50 rounded-lg border border-border text-xs font-bold text-dark-text">
                        {draft.subject}
                      </div>

                      {/* Body Content */}
                      <div className="p-3 bg-gray-50/75 rounded-lg border border-border/80 text-xs text-dark-text leading-relaxed font-sans select-all">
                        {draft.body}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-dark-muted">
                      <span>Standardized IMD Hazard Template</span>
                      <span>Length: {draft.body.length} chars</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strict Operational Notice: Draft Preparation Tool Only */}
          <div className="p-4 bg-white border border-border rounded-xl flex items-start gap-3 shadow-subtle">
            <div className="p-2 rounded-lg bg-violet-50 text-violet-700 border border-violet-100 shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div className="text-xs space-y-1">
              <h4 className="font-bold text-dark-text">
                Operational Dispatch Notice
              </h4>
              <p className="text-dark-muted leading-relaxed">
                This tool prepares standardized alert text for disaster management officers to distribute through authorized official channels (coastal siren networks, All India Radio, NAVTEX, and state SMS gateways). TIDAL does not dispatch or broadcast messages directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
