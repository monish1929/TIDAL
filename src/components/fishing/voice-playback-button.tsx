"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface VoicePlaybackButtonProps {
  textToSpeak: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const VoicePlaybackButton: React.FC<VoicePlaybackButtonProps> = ({
  textToSpeak,
  label = "Listen",
  size = "md",
  className = "",
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert(`Audio Narration: "${textToSpeak}"`);
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95; // slightly slower for maximum clarity
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs gap-1.5",
    md: "px-3 py-1.5 text-xs gap-2",
    lg: "px-4 py-2.5 text-sm gap-2.5 font-bold",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <button
      type="button"
      onClick={handleTogglePlay}
      aria-label={`Voice audio narration: ${label}`}
      className={`inline-flex items-center rounded-xl border transition-all select-none shadow-subtle ${
        isPlaying
          ? "bg-blue-600 border-blue-700 text-white animate-pulse"
          : "bg-white border-blue-200 text-blue-800 hover:bg-blue-50 active:scale-95"
      } ${sizeClasses[size]} ${className}`}
    >
      {isPlaying ? (
        <VolumeX className={`${iconSizes[size]} text-white shrink-0`} />
      ) : (
        <Volume2 className={`${iconSizes[size]} text-blue-600 shrink-0`} />
      )}
      <span className="font-semibold tracking-wide">
        {isPlaying ? "Playing Audio..." : label}
      </span>
    </button>
  );
};
