"use client";

import React from "react";
import { Globe } from "lucide-react";
import { AVAILABLE_LANGUAGES, getStoredLanguage, setStoredLanguage } from "@/lib/storage";
import { LanguageCode } from "@/types/user";

interface LanguageSelectorProps {
  currentLanguage?: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
  className?: string;
  variant?: "compact" | "pill" | "select";
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
  className = "",
  variant = "pill",
}) => {
  const [selected, setSelected] = React.useState<LanguageCode>(currentLanguage || "en");

  React.useEffect(() => {
    if (!currentLanguage) {
      setSelected(getStoredLanguage());
    } else {
      setSelected(currentLanguage);
    }
  }, [currentLanguage]);

  const handleChange = (newLang: LanguageCode) => {
    setSelected(newLang);
    setStoredLanguage(newLang);
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 text-xs ${className}`}>
      <Globe className="w-3.5 h-3.5 text-dark-muted shrink-0" />
      <select
        value={selected}
        onChange={(e) => handleChange(e.target.value as LanguageCode)}
        className="bg-white hover:bg-gray-50 border border-border text-dark-text font-medium rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors cursor-pointer"
        aria-label="Select Interface Language"
      >
        {AVAILABLE_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name} ({lang.nativeName})
          </option>
        ))}
      </select>
    </div>
  );
};
