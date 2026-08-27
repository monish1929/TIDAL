"use client";

import React, { useState, useEffect } from "react";
import {
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  ArrowRight,
  Navigation,
  Compass,
  Anchor,
  Clock,
  Waves,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DecisionCard } from "./decision-card";
import { LiveReasoningTrace } from "./live-reasoning-trace";
import {
  DecisionResponse,
  TopicScope,
  ApprovalStatus,
  ActiveTrip,
} from "@/types/decision";
import { UserProfile } from "@/types/user";
import {
  FLAGSHIP_TRIP_SAFETY_MOCK,
  HIGH_RISK_GATED_MOCK,
  SCOPED_PROMPT_SUGGESTIONS,
  ROLE_HOME_BRIEFINGS,
} from "@/mocks/decisionMocks";
import {
  getUserChatHistory,
  saveUserChatHistory,
  getUserActiveTrip,
} from "@/lib/storage";

interface MessageItem {
  id: string;
  sender: "user" | "copilot";
  timestamp: string;
  text?: string;
  decision?: DecisionResponse;
}

interface CopilotWorkspaceProps {
  currentScope: TopicScope;
  userProfile: UserProfile;
  researchMode: boolean;
  onDecisionActivated: (decision: DecisionResponse) => void;
}

export const CopilotWorkspace: React.FC<CopilotWorkspaceProps> = ({
  currentScope,
  userProfile,
  researchMode,
  onDecisionActivated,
}) => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [activeTrip, setActiveTrip] = useState<ActiveTrip | null>(null);
  const [inputQuery, setInputQuery] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  // Load chat history & active trip whenever active userProfile changes
  useEffect(() => {
    if (!userProfile.identifier) return;

    // Load ONLY real user-initiated chat history — never auto-inject a decision card
    const storedHistory = getUserChatHistory(userProfile.identifier);
    if (storedHistory && storedHistory.length > 0) {
      setMessages(storedHistory);
      // Activate the most recent decision for the supporting panel
      const lastDecision = [...storedHistory]
        .reverse()
        .find((m) => m.decision)?.decision;
      if (lastDecision) {
        onDecisionActivated(lastDecision);
      }
    } else {
      // First-ever visit: empty messages array — no auto-generated decision card
      setMessages([]);
    }

    // Load active trip for Fisherman
    if (userProfile.role === "FISHERMAN") {
      const trip = getUserActiveTrip(
        userProfile.identifier,
        userProfile.role,
        userProfile.roleDetails
      );
      setActiveTrip(trip);
    } else {
      setActiveTrip(null);
    }
  }, [userProfile.identifier, userProfile.role]);

  // Persist chat history whenever messages array updates (only if non-empty)
  useEffect(() => {
    if (messages.length > 0 && userProfile.identifier) {
      saveUserChatHistory(userProfile.identifier, messages);
    }
  }, [messages, userProfile.identifier]);

  const activeSuggestions =
    SCOPED_PROMPT_SUGGESTIONS[currentScope] || SCOPED_PROMPT_SUGGESTIONS.home;

  const handleSendQuery = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();

    if (!query || isThinking) return;

    const userMsg: MessageItem = {
      id: "msg_u_" + Date.now(),
      sender: "user",
      timestamp: "Just now",
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsThinking(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          role: userProfile.role,
          language: "English",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          typeof data?.error === "string"
            ? data.error
            : `API request failed with status ${res.status}`
        );
      }

      const responseText =
        typeof data?.text === "string"
          ? data.text.trim()
          : "";

      if (!responseText) {
        throw new Error("API returned an empty response.");
      }

      const copilotMsg: MessageItem = {
        id: "msg_c_" + Date.now(),
        sender: "copilot",
        timestamp: "Just now",
        text: responseText,
      };

      setMessages((prev) => [...prev, copilotMsg]);

    } catch (error) {
      console.error("Copilot request failed:", error);

      const errorMessage: MessageItem = {
        id: "msg_error_" + Date.now(),
        sender: "copilot",
        timestamp: "Just now",
        text:
          error instanceof Error
            ? `Unable to get a TIDAL response: ${error.message}`
            : "Unable to get a TIDAL response.",
      };

      setMessages((prev) => [...prev, errorMessage]);

    } finally {
      setIsThinking(false);
    }
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
      {/* 1. ACTIVE SCOPE BAR */}
      <div className="px-4 py-2.5 bg-white border-b border-border flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-dark-muted">
            Topic Scope:
          </span>
          <span className="text-xs font-semibold text-primary capitalize px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-md">
            {currentScope.replace(/_/g, " ")}
          </span>
          {researchMode && (
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Deep Analytical Mode Active</span>
            </span>
          )}
        </div>

        {hasHistory && (
          <button
            type="button"
            onClick={handleClearHistory}
            className="flex items-center gap-1 text-[11px] text-dark-muted hover:text-dark-text p-1 hover:bg-gray-100 rounded transition-colors"
            title="Clear conversation history"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* 2. SCROLLABLE FEED AREA */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {/* ── ACTIVE VOYAGE TRACKING CARD (Fisherman only, Home scope only) ── */}
        {currentScope === "home" &&
          userProfile.role === "FISHERMAN" &&
          activeTrip && (
            <div className="bg-surface border border-border rounded-xl shadow-card p-4 sm:p-5 space-y-3">
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-primary">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-dark-muted">
                        Active Voyage
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                        </span>
                        En Route
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-dark-text mt-0.5">
                      {activeTrip.vesselName} • {activeTrip.vesselType}
                    </h3>
                  </div>
                </div>

                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg">
                  Safe Operating Envelope
                </span>
              </div>

              {/* Voyage Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 bg-gray-50 border border-border rounded-lg">
                  <span className="text-dark-muted text-[10px] block font-medium">
                    Departure Port
                  </span>
                  <span className="font-semibold text-dark-text mt-0.5 block truncate">
                    {activeTrip.departurePort}
                  </span>
                  <span className="text-[10px] text-dark-muted block mt-0.5">
                    Departed: {activeTrip.departureTime}
                  </span>
                </div>

                <div className="p-2.5 bg-gray-50 border border-border rounded-lg">
                  <span className="text-dark-muted text-[10px] block font-medium">
                    Target Destination
                  </span>
                  <span className="font-semibold text-dark-text mt-0.5 block truncate">
                    {activeTrip.destinationZone}
                  </span>
                  <span className="text-[10px] text-dark-muted block mt-0.5">
                    Distance: {activeTrip.distanceNM} NM
                  </span>
                </div>

                <div className="p-2.5 bg-gray-50 border border-border rounded-lg">
                  <span className="text-dark-muted text-[10px] block font-medium">
                    Safe Return Window
                  </span>
                  <span className="font-semibold text-emerald-800 mt-0.5 block">
                    Before {activeTrip.estimatedReturnTime}
                  </span>
                  <span className="text-[10px] text-dark-muted block mt-0.5 truncate">
                    {activeTrip.seaStateStatus}
                  </span>
                </div>
              </div>

              {/* Quick Action Footer */}
              <div className="flex items-center justify-between pt-1 border-t border-border text-xs">
                <span className="text-dark-muted text-[11px] hidden sm:inline">
                  Live monitoring linked to INCOIS Wave State
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDecisionActivated(FLAGSHIP_TRIP_SAFETY_MOCK)}
                  className="text-xs font-semibold gap-1.5 h-8 ml-auto"
                >
                  <span>View Marine Telemetry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}

        {/* ── EMPTY STATE (No History, First Visit) ── */}
        {!hasHistory && !isThinking && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12 sm:py-16 space-y-4 select-none">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-primary">
              <Compass className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-dark-text">
                Welcome to TIDAL
              </h3>
              <p className="text-xs text-dark-muted max-w-sm leading-relaxed">
                Ask any marine intelligence question — trip safety, weather
                forecasts, PFZ locations, route planning — and receive
                structured, evidence-backed decision cards.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {activeSuggestions.slice(0, 3).map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendQuery(sug)}
                  className="px-3.5 py-2 bg-white hover:bg-blue-50 border border-border hover:border-primary rounded-xl text-xs font-medium text-dark-text transition-colors flex items-center gap-1.5 shadow-subtle"
                >
                  <span>{sug}</span>
                  <ArrowRight className="w-3 h-3 text-dark-muted" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── PERSISTENT CHAT HISTORY & DECISION CARDS ── */}
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
                  <span>TIDAL Collaborative Decision Response</span>
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

      {/* 3. PROMPT SUGGESTIONS & QUERY INPUT BAR */}
      <div className="p-4 bg-white border-t border-border space-y-3 shrink-0">
        {/* Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-0.5 text-xs select-none scrollbar-thin">
          <span className="text-[11px] font-bold text-dark-muted whitespace-nowrap shrink-0">
            Suggested Queries:
          </span>
          <div className="flex items-center gap-2 shrink-0">
            {activeSuggestions.map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendQuery(sug)}
                className="px-3.5 py-1.5 bg-gray-50 hover:bg-blue-50 border border-border hover:border-primary-border rounded-full text-[11px] font-medium text-dark-text whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0 shadow-subtle"
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
              placeholder={`Ask TIDAL anything (e.g. "Is it safe to venture tomorrow?", route safety, PFZ locations)...`}
              className="h-11 pr-11 pl-4 text-xs sm:text-sm rounded-xl border-border bg-gray-50/50 focus-visible:bg-white"
            />
            {/* Mic Icon Placed Directly Inside Input Container (Requirement 7) */}
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
            className="h-11 px-5 rounded-xl gap-2 font-semibold shadow-sm"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </main>
  );
};
