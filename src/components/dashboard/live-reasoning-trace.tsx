"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, CheckCircle2, Clock } from "lucide-react";

interface LiveReasoningTraceProps {
  steps?: string[];
  durationPerStep?: number;
  onComplete?: () => void;
  title?: string;
}

export const DEFAULT_REASONING_STEPS = [
  "Ingesting real-time oceanographic feeds (INCOIS OSF & ISRO Oceansat-3)...",
  "Cross-referencing IMD marine bulletin & high-wind squall advisories...",
  "Evaluating vessel operating envelopes & boundary proximity limits...",
  "Synthesizing causal drivers, counterfactuals & decision verdict...",
];

export const LiveReasoningTrace: React.FC<LiveReasoningTraceProps> = ({
  steps = DEFAULT_REASONING_STEPS,
  durationPerStep = 450,
  onComplete,
  title = "TIDAL Multi-Agent Reasoning Trace",
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (currentStepIndex < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, durationPerStep);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentStepIndex, steps.length, durationPerStep, onComplete]);

  return (
    <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-subtle space-y-3 select-none text-left max-w-2xl">
      <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2">
        <div className="flex items-center gap-2 text-xs font-bold text-dark-text">
          <div className="w-5 h-5 rounded-md bg-blue-50 text-primary flex items-center justify-center">
            <Sparkles className="w-3 h-3 animate-spin" />
          </div>
          <span>{title}</span>
        </div>
        <span className="text-[10px] font-mono text-dark-muted bg-gray-50 border border-gray-200 px-2 py-0.5 rounded">
          Step {Math.min(currentStepIndex + 1, steps.length)} of {steps.length}
        </span>
      </div>

      <div className="space-y-2">
        {steps.slice(0, currentStepIndex + 1).map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={idx}
              className={`flex items-start gap-2 text-xs transition-opacity duration-300 ${
                isDone
                  ? "text-dark-muted font-normal"
                  : isCurrent
                  ? "text-dark-text font-semibold animate-pulse"
                  : "text-dark-light"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0 mt-0.5" />
              )}
              <span className="leading-snug">{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
