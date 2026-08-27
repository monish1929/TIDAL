"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  ArrowRight,
  X,
  Mic,
  MessageSquare,
  ChevronRight,
  Maximize2,
  Minimize2,
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

interface DockedCopilotPanelProps {
  userProfile: UserProfile;
  currentScope: TopicScope;
  isResearchMode: boolean;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const DockedCopilotPanel: React.FC<DockedCopilotPanelProps> = ({
  userProfile,
  currentScope,
  isResearchMode,
  isOpen,
  onToggleOpen,
}) => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isThinking, isOpen]);

  const activeSuggestions =
    SCOPED_PROMPT_SUGGESTIONS[currentScope] ||
    SCOPED_PROMPT_SUGGESTIONS.fishing ||
    SCOPED_PROMPT_SUGGESTIONS.home;

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

    // Live multi-step reasoning delay
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
          scope: currentScope,
          recommendation: isResearchMode
            ? `RESEARCH SYNTHESIS: Multi-Source Temporal Correlation for "${query}"`
            : `DECISION INTELLIGENCE: Evidence-Based Guidance for "${query}"`,
          summaryRationale: isResearchMode
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
            narrative: isResearchMode
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
    }, 1800);
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
    <>
      {/* ── PERSISTENT FLOATING COPILOT TRIGGER (VISIBLE WHEN DOCK CLOSED) ── */}
      {!isOpen && (
        <button
          type="button"
          onClick={onToggleOpen}
          className="fixed bottom-16 sm:bottom-6 right-6 z-40 bg-primary hover:bg-primary/95 text-white px-4 py-3 rounded-2xl shadow-elevation border border-primary/20 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 group select-none"
          title="Open TIDAL Copilot Chat across any section"
        >
          <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold leading-tight">Ask TIDAL Copilot</div>
            <div className="text-[10px] text-white/80 font-medium">Accessible anywhere</div>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </button>
      )}

      {/* ── PERSISTENT DOCKED RIGHT PANEL ── */}
      {isOpen && (
        <aside className="fixed sm:relative top-0 right-0 z-50 sm:z-20 h-full w-full sm:w-[420px] md:w-[460px] bg-white border-l border-border shadow-elevation sm:shadow-none flex flex-col justify-between shrink-0 select-none overflow-hidden animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="px-4 py-3 bg-white border-b border-border flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-primary border border-blue-200 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xs font-bold text-dark-text uppercase tracking-wider">
                    TIDAL Copilot
                  </h2>
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-dark-muted font-medium">
                  Docked context: {currentScope.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {hasHistory && (
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="p-1.5 text-dark-muted hover:text-dark-text hover:bg-gray-100 rounded-lg transition-colors"
                  title="Clear conversation history"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={onToggleOpen}
                className="p-1.5 text-dark-muted hover:text-dark-text hover:bg-gray-100 rounded-lg transition-colors"
                title="Collapse Copilot panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Conversation Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
            {/* Empty State */}
            {!hasHistory && !isThinking && (
              <div className="flex flex-col items-center justify-center text-center py-10 space-y-3 select-none">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-primary shadow-subtle">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="space-y-1 max-w-xs">
                  <h3 className="text-sm font-bold text-dark-text">
                    Ask TIDAL in {currentScope.charAt(0).toUpperCase() + currentScope.slice(1)}
                  </h3>
                  <p className="text-xs text-dark-muted leading-relaxed">
                    Ask about weather risks, PFZ coordinates, route clearances, or historical telemetry while viewing this workspace.
                  </p>
                </div>

                {/* Suggestions */}
                <div className="w-full space-y-1.5 pt-2">
                  {activeSuggestions.slice(0, 3).map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSendQuery(sug)}
                      className="w-full px-3 py-2 bg-white hover:bg-blue-50 border border-border hover:border-primary rounded-xl text-xs font-medium text-dark-text transition-colors flex items-center justify-between gap-2 shadow-subtle text-left"
                    >
                      <span className="truncate">{sug}</span>
                      <ArrowRight className="w-3 h-3 text-dark-muted shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Stream */}
            {messages.map((msg) => {
              if (msg.sender === "user") {
                return (
                  <div
                    key={msg.id}
                    className="flex items-start justify-end gap-2 max-w-sm ml-auto"
                  >
                    <div className="bg-primary text-white px-3.5 py-2 rounded-xl rounded-tr-none text-xs shadow-subtle font-medium break-words">
                      {msg.text}
                    </div>
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-primary flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              }

              if (msg.decision) {
                return (
                  <div key={msg.id} className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-dark-muted pl-1">
                      <div className="w-5 h-5 rounded bg-blue-50 text-primary flex items-center justify-center">
                        <Bot className="w-3 h-3" />
                      </div>
                      <span>TIDAL Copilot</span>
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

            {/* LIVE REASONING TRACE (SEQUENTIAL TEXT REVEAL INSTEAD OF SPINNER) */}
            {isThinking && (
              <LiveReasoningTrace
                title="TIDAL Multi-Agent Core Reasoning"
                durationPerStep={400}
              />
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Composer Bar with Integrated Voice Mic Icon */}
          <div className="p-3 bg-white border-t border-border space-y-2 shrink-0">
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
                  placeholder={`Ask TIDAL about ${currentScope}...`}
                  className="h-10 pr-9 pl-3 text-xs rounded-xl border-border bg-gray-50/70 focus-visible:bg-white focus-visible:ring-primary"
                />

                {/* Voice Mic Icon Placed Directly Inside Input Container (Requirement 7) */}
                <button
                  type="button"
                  onClick={() => setIsListening(!isListening)}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-dark-muted hover:text-primary transition-colors ${
                    isListening ? "text-rose-600 animate-pulse" : ""
                  }`}
                  title="Voice input (Microphone control)"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>

              <Button
                type="submit"
                disabled={!inputQuery.trim() || isThinking}
                className="h-10 px-3.5 rounded-xl gap-1.5 font-semibold shadow-sm text-xs"
              >
                <span>Ask</span>
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>
        </aside>
      )}
    </>
  );
};
