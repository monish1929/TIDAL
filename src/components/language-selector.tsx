"use client";

import React from "react";
import { Globe } from "lucide-react";
import {
  AVAILABLE_LANGUAGES,
  getStoredLanguage,
  setStoredLanguage,
} from "@/lib/storage";
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
}) => {
  const [selectedLanguage, setSelectedLanguage] =
    React.useState<LanguageCode>("en");

  /*
   * Load the saved language when the component mounts.
   */
  React.useEffect(() => {
    try {
      const savedLanguage = getStoredLanguage();

      if (currentLanguage) {
        setSelectedLanguage(currentLanguage);
      } else if (savedLanguage) {
        setSelectedLanguage(savedLanguage);
      }
    } catch (error) {
      console.error("[TIDAL] Failed to load language:", error);
      setSelectedLanguage(currentLanguage || "en");
    }
  }, [currentLanguage]);

  /*
   * Handle language change.
   */
  const handleChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLanguage = event.target.value as LanguageCode;

    console.log(
      "[TIDAL] Language selector changed:",
      newLanguage
    );

    // Update selector UI immediately
    setSelectedLanguage(newLanguage);

    // Save language
    try {
      setStoredLanguage(newLanguage);

      // Also explicitly save using the key
      // used by the Copilot.
      localStorage.setItem(
        "tidal-language",
        newLanguage
      );

      console.log(
        "[TIDAL] Language saved:",
        localStorage.getItem("tidal-language")
      );
    } catch (error) {
      console.error(
        "[TIDAL] Failed to save language:",
        error
      );
    }

    /*
     * IMPORTANT:
     * Send the language as a STRING, not an object.
     *
     * Tamil  -> "ta"
     * Hindi  -> "hi"
     * English -> "en"
     */
    window.dispatchEvent(
      new CustomEvent("tidal-language-change", {
        detail: newLanguage,
      })
    );

    // Notify parent
    onLanguageChange?.(newLanguage);
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs ${className}`}
    >
      <Globe className="h-3.5 w-3.5 shrink-0 text-dark-muted" />

      <select
        value={selectedLanguage}
        onChange={handleChange}
        className="
          cursor-pointer
          rounded-lg
          border
          border-border
          bg-white
          px-2.5
          py-1.5
          text-xs
          font-medium
          text-dark-text
          transition-colors
          hover:bg-gray-50
          focus:border-primary
          focus:outline-none
          focus:ring-2
          focus:ring-primary
        "
        aria-label="Select interface language"
      >
        {AVAILABLE_LANGUAGES.map((language) => (
          <option
            key={language.code}
            value={language.code}
          >
            {language.name} ({language.nativeName})
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;