"use client";

import React, { useState, useEffect } from "react";
import {
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  ArrowRight,
  Compass,
  MapPin,
  Anchor,
  ShieldCheck,
  Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DecisionCard } from "./decision-card";
import { LiveReasoningTrace } from "./live-reasoning-trace";
import {
  DecisionResponse,
  TopicScope,
  ApprovalStatus,
} from "@/types/decision";
import { UserProfile } from "@/types/user";
import {
  FLAGSHIP_TRIP_SAFETY_MOCK,
  HIGH_RISK_GATED_MOCK,
  SCOPED_PROMPT_SUGGESTIONS,
} from "@/mocks/decisionMocks";
import {
  getUserChatHistory,
  saveUserChatHistory,
} from "@/lib/storage";

interface MessageItem {
  id: string;
  sender: "user" | "copilot";
  timestamp: string;
  text?: string;
  decision?: DecisionResponse;
}

interface ChatWorkspaceProps {
  userProfile: UserProfile;
  researchMode?: boolean;
}

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({
  userProfile,
  researchMode = false,
}) => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  // Load chat history whenever active userProfile changes
  useEffect(() => {
    if (!userProfile.identifier) return;

    const storedHistory = getUserChatHistory(userProfile.identifier);
    if (storedHistory && storedHistory.length > 0) {
      setMessages(storedHistory);
    } else {
      setMessages([]);
    }
  }, [userProfile.identifier]);

  // Persist chat history whenever messages array updates
  useEffect(() => {
    if (messages.length > 0 && userProfile.identifier) {
      saveUserChatHistory(userProfile.identifier, messages);
    }
  }, [messages, userProfile.identifier]);

  const activeSuggestions =
    SCOPED_PROMPT_SUGGESTIONS.fishing || SCOPED_PROMPT_SUGGESTIONS.home;

  const handleSendQuery = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: MessageItem = {
      id: "msg_u_" + Date.now(),
      sender: "user",
      timestamp: "Just now",
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsThinking(true);

    setTimeout(() => {
      let responseDecision: DecisionResponse;
      const lower = query.toLowerCase();

      if (
        lower.includes("safe") ||
        lower.includes("venture") ||
        lower.includes("tomorrow")
      ) {
        responseDecision = {
          ...FLAGSHIP_TRIP_SAFETY_MOCK,
          id: "dec_" + Date.now(),
          query: query,
          timestamp: new Date().toISOString(),
        };
      } else if (
        lower.includes("emergency") ||
        lower.includes("cyclone") ||
        lower.includes("recall") ||
        lower.includes("warning")
      ) {
        responseDecision = {
          ...HIGH_RISK_GATED_MOCK,
          id: "dec_hr_" + Date.now(),
          query: query,
          timestamp: new Date().toISOString(),
        };
      } else {
        responseDecision = {
          id: "dec_dyn_" + Date.now(),
          query: query,
          timestamp: new Date().toISOString(),
          scope: "fishing",
          recommendation: researchMode
            ? `RESEARCH SYNTHESIS: Multi-Source Temporal Correlation for "${query}"`
            : `DECISION INTELLIGENCE: Evidence-Based Recommendation for "${query}"`,
          summaryRationale: researchMode
            ? "Integrated 30-day historical time-series from INCOIS and ISRO Sentinel-3. High confidence correlation observed across physical anomalies."
            : `Synthesized current ocean state forecasts, IMD weather bulletins, and vessel safety envelopes for ${userProfile.role.replace(
                /_/g,
                " "
              )}.`,
          riskTier: "LOW",
          confidenceScore: 94,
          approvalStatus: "APPROVED_AUTONOMOUS",
          validityPeriod: {
            validFrom: "Current Window",
            validUntil: "Next 12 Hours",
            recheckRecommendedAt: "Today 18:00 IST",
          },
          keyEvidence: [
            {
              id: "dyn_1",
              label: "Significant Wave State",
              value: 1.3,
              unit: "m",
              confidence: 0.95,
              source: "INCOIS_OSF",
              timestamp: "12 mins ago",
              status: "optimal",
            },
            {
              id: "dyn_2",
              label: "Surface Wind Vector",
              value: 14,
              unit: "kts",
              confidence: 0.92,
              source: "IMD_BULLETIN",
              timestamp: "30 mins ago",
              status: "optimal",
            },
            {
              id: "dyn_3",
              label: "Satellite Sensor Verification",
              value: "Optimal Coverage",
              unit: "",
              confidence: 0.97,
              source: "ISRO_EOS",
              timestamp: "1 hour ago",
              status: "optimal",
            },
          ],
          causalExplanation: {
            primaryDrivers: [
              "Favorable boundary layer stability across sector",
              "Nominal thermocline depth suppressing turbulence",
            ],
            narrative: researchMode
              ? "Longitudinal analysis reveals seasonal sea surface temperature anomalies are within 1-sigma historical variance, indicating stable baseline dynamics."
              : "Localized sea condition indicators remain well inside safe operating margins for your configured craft.",
          },
          counterfactuals: [
            {
              id: "dyn_cf_1",
              scenarioName: "Primary Recommended Track",
              description: "Standard operating envelope",
              parameters: { speed: "10 kts", buffer: "4 NM" },
              predictedOutcome: "Optimal efficiency, zero hazard exposure.",
              riskScore: 15,
              riskTier: "LOW",
              recommended: true,
            },
          ],
          criticalUncertainty: {
            variable: "Localized Thermal Wind Escalation",
            threshold: "> 20 knots",
            impactDescription: "Standard diurnal variation.",
          },
          timeSeriesData: [
            { time: "06:00", waveHeight: 1.1, windSpeed: 11, sst: 28.3 },
            { time: "10:00", waveHeight: 1.3, windSpeed: 13, sst: 28.5 },
            { time: "14:00", waveHeight: 1.8, windSpeed: 18, sst: 28.8 },
            { time: "18:00", waveHeight: 1.5, windSpeed: 15, sst: 28.6 },
          ],
        };
      }

      const copilotMsg: MessageItem = {
        id: "msg_c_" + Date.now(),
        sender: "copilot",
        timestamp: "Just now",
        decision: responseDecision,
      };

      setMessages((prev) => [...prev, copilotMsg]);
      setIsThinking(false);
    }, 450);
  };

  const handleApproveAdvisory = (decisionId: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.decision && msg.decision.id === decisionId) {
          return {
            ...msg,
            decision: {
              ...msg.decision,
              approvalStatus: "APPROVED_BY_USER" as ApprovalStatus,
            },
          };
        }
        return msg;
      })
    );
  };

  const handleClearHistory = () => {
    setMessages([]);
    saveUserChatHistory(userProfile.identifier, []);
  };

  const hasHistory = messages.length > 0;

  return (
    <main className="flex-1 flex flex-col h-full bg-background overflow-hidden justify-between">
      {/* ── 1. ASK TIDAL TOP CONTEXT HEADER ── */}
      <div className="px-5 py-2.5 bg-white border-b border-border flex flex-wrap items-center justify-between gap-3 shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <h1 className="text-xs font-bold uppercase tracking-wider text-dark-text">
              Ask TIDAL Conversational Intelligence
            </h1>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-dark-light">•</span>
            <span className="text-[11px] font-medium text-dark-muted px-2 py-0.5 bg-gray-50 border border-border rounded-md capitalize">
              Role: {userProfile.role.toLowerCase().replace(/_/g, " ")}
            </span>
            <span className="text-[11px] font-medium text-dark-muted px-2 py-0.5 bg-gray-50 border border-border rounded-md">
              Sector: Gulf of Mannar
            </span>
          </div>
        </div>

        {hasHistory && (
          <button
            type="button"
            onClick={handleClearHistory}
            className="flex items-center gap-1.5 text-xs text-dark-muted hover:text-dark-text px-2 py-1 hover:bg-gray-100 rounded-md transition-colors"
            title="Clear conversation history"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* ── 2. SCROLLABLE CONVERSATION FEED AREA ── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-5xl w-full mx-auto">
        {/* ── EMPTY STATE (No conversation yet) ── */}
        {!hasHistory && !isThinking && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16 sm:py-20 space-y-4 select-none">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-primary shadow-subtle">
              <Bot className="w-8 h-8" />
            </div>
            <div className="space-y-1.5 max-w-md">
              <h2 className="text-lg font-bold text-dark-text">
                Ask TIDAL Anything
              </h2>
              <p className="text-xs text-dark-muted leading-relaxed">
                Explore operational decisions conversationally. Ask about sea safety envelopes, IMD weather forecasts, PFZ coordinates, or route risk assessments.
              </p>
            </div>

            {/* Suggested Starter Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 max-w-lg">
              {activeSuggestions.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendQuery(sug)}
                  className="px-3.5 py-2 bg-white hover:bg-blue-50 border border-border hover:border-primary rounded-xl text-xs font-medium text-dark-text transition-colors flex items-center gap-1.5 shadow-subtle text-left"
                >
                  <span>{sug}</span>
                  <ArrowRight className="w-3 h-3 text-dark-muted shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── MESSAGES FEED ── */}
        {messages.map((msg) => {
          if (msg.sender === "user") {
            return (
              <div
                key={msg.id}
                className="flex items-start justify-end gap-2.5 max-w-2xl ml-auto"
              >
                <div className="bg-primary text-white px-4 py-2.5 rounded-xl rounded-tr-none text-xs sm:text-sm shadow-subtle font-medium">
                  {msg.text}
                </div>
                <div className="w-7 h-7 rounded-full bg-blue-100 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              </div>
            );
          }

          if (msg.decision) {
            return (
              <div key={msg.id} className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-dark-muted pl-1">
                  <div className="w-6 h-6 rounded-md bg-blue-50 text-primary flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <span>TIDAL Decision Intelligence Response</span>
                  <span className="text-[10px] text-dark-light">
                    • {msg.timestamp}
                  </span>
                </div>
                <DecisionCard
                  decision={msg.decision}
                  onApproveAdvisory={handleApproveAdvisory}
                />
              </div>
            );
          }

          return null;
        })}

        {isThinking && (
          <LiveReasoningTrace
            title="TIDAL Multi-Agent Core Reasoning"
            durationPerStep={400}
          />
        )}
      </div>

      {/* ── 3. CHAT COMPOSER ── */}
      <div className="p-4 bg-white border-t border-border space-y-3 shrink-0">
        <div className="max-w-5xl w-full mx-auto space-y-2.5">
          {/* Suggestion Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs select-none scrollbar-thin">
            <span className="text-[11px] font-bold text-dark-muted whitespace-nowrap shrink-0">
              Suggestions:
            </span>
            <div className="flex items-center gap-2 shrink-0">
              {activeSuggestions.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendQuery(sug)}
                  className="px-3 py-1 bg-gray-50 hover:bg-blue-50 border border-border hover:border-primary-border rounded-full text-[11px] font-medium text-dark-text whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0 shadow-subtle"
                >
                  <span>{sug}</span>
                  <ArrowRight className="w-3 h-3 text-dark-muted shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask TIDAL anything about marine conditions, safety, PFZs, routes, hazards..."
                className="h-11 pr-11 pl-4 text-xs sm:text-sm rounded-xl border-border bg-gray-50/60 focus-visible:bg-white focus-visible:ring-primary"
              />
              {/* Mic Icon Placed Directly Inside Input (Requirement 7) */}
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-dark-muted hover:text-primary transition-colors"
                title="Voice input (Microphone control)"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            <Button
              type="submit"
              disabled={!inputQuery.trim() || isThinking}
              className="h-11 px-5 rounded-xl gap-2 font-semibold shadow-sm text-xs sm:text-sm"
            >
              <span>Ask</span>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
};
