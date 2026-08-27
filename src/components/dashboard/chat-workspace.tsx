"use client";

import React, { useEffect, useState } from "react";
import {
  Send,
  Bot,
  User,
  RotateCcw,
  ArrowRight,
  Mic,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DecisionCard } from "./decision-card";
import { LiveReasoningTrace } from "./live-reasoning-trace";

import {
  DecisionResponse,
  ApprovalStatus,
} from "@/types/decision";

import { UserProfile } from "@/types/user";

import {
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
  activeDecision?: DecisionResponse;
}

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({
  userProfile,
  researchMode = false,
  activeDecision,
}) => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  /*
   * ---------------------------------------------------------
   * LOAD CHAT HISTORY
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!userProfile.identifier) {
      setMessages([]);
      return;
    }

    const storedHistory = getUserChatHistory(userProfile.identifier);

    if (storedHistory && storedHistory.length > 0) {
      setMessages(storedHistory);
    } else {
      setMessages([]);
    }
  }, [userProfile.identifier]);

  /*
   * ---------------------------------------------------------
   * SAVE CHAT HISTORY
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!userProfile.identifier) {
      return;
    }

    saveUserChatHistory(
      userProfile.identifier,
      messages
    );
  }, [messages, userProfile.identifier]);

  /*
   * ---------------------------------------------------------
   * SUGGESTIONS
   * ---------------------------------------------------------
   */
  const activeSuggestions =
    SCOPED_PROMPT_SUGGESTIONS.fishing ||
    SCOPED_PROMPT_SUGGESTIONS.home;

  /*
   * ---------------------------------------------------------
   * SEND QUERY TO GEMINI BACKEND
   *
   * IMPORTANT:
   * - This function accepts an optional query.
   * - Normal form submission uses inputQuery.
   * - Suggestion buttons can pass their own query.
   * ---------------------------------------------------------
   */
  const handleSendQuery = async (queryOverride?: string) => {
    const query = (
      queryOverride !== undefined
        ? queryOverride
        : inputQuery
    ).trim();

    if (!query || isThinking) {
      return;
    }

    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    /*
     * -------------------------------------------------------
     * 1. ADD USER MESSAGE
     * -------------------------------------------------------
     */
    const userMessage: MessageItem = {
      id: `user-${Date.now()}`,
      sender: "user",
      timestamp,
      text: query,
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
    ]);

    setInputQuery("");
    setIsThinking(true);

    /*
     * -------------------------------------------------------
     * 2. CALL EXISTING BACKEND
     *
     * DO NOT CHANGE /api/chat.
     * -------------------------------------------------------
     */
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          role: userProfile.role,
          language: "English",
          dashboardData: {
            region: "Gulf of Mannar & Palk Bay",

            currentSeaTemperature:
              activeDecision?.mapFeatures?.find(
                (feature) => feature.properties?.sst
              )?.properties?.sst || "28.4°C",

            currentWaveHeight:
              activeDecision?.mapFeatures?.find(
                (feature) => feature.properties?.waveHeight
              )?.properties?.waveHeight || "2.4m",

            confidence:
              activeDecision?.mapFeatures?.find(
                (feature) => feature.properties?.confidence
              )?.properties?.confidence || "96%",

            timeSeries:
              activeDecision?.timeSeriesData || [
                { time: "05:00", waveHeight: 1.1, windSpeed: 11, sst: 28.3 },
                { time: "08:00", waveHeight: 1.2, windSpeed: 12, sst: 28.5 },
                { time: "11:00", waveHeight: 1.4, windSpeed: 14, sst: 28.7 },
                { time: "14:00", waveHeight: 2.1, windSpeed: 19, sst: 29.0 },
                { time: "17:00", waveHeight: 2.6, windSpeed: 24, sst: 28.9 },
                { time: "20:00", waveHeight: 2.2, windSpeed: 18, sst: 28.6 },
              ],

            keyEvidence:
              activeDecision?.keyEvidence || [],
          },
        }),
      });

      /*
       * -----------------------------------------------------
       * 3. CHECK HTTP RESPONSE
       * -----------------------------------------------------
       */
      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status}`
        );
      }

      /*
       * -----------------------------------------------------
       * 4. READ JSON RESPONSE
       *
       * Expected backend response:
       *
       * {
       *   "text": "Gemini response..."
       * }
       * -----------------------------------------------------
       */
      const data: unknown = await response.json();

      /*
       * -----------------------------------------------------
       * 5. SAFELY EXTRACT data.text
       * -----------------------------------------------------
       */
      let responseText = "";

      if (
        typeof data === "object" &&
        data !== null &&
        "text" in data
      ) {
        const possibleText = (
          data as { text?: unknown }
        ).text;

        if (typeof possibleText === "string") {
          responseText = possibleText.trim();
        }
      }

      if (!responseText) {
        throw new Error(
          "API returned no text response"
        );
      }

      /*
       * -----------------------------------------------------
       * 6. CREATE PLAIN COPILOT MESSAGE
       *
       * IMPORTANT:
       * We intentionally do NOT create a DecisionResponse.
       *
       * Gemini's actual text goes directly into msg.text.
       * -----------------------------------------------------
       */
      const copilotMessage: MessageItem = {
        id: `copilot-${Date.now()}`,
        sender: "copilot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        text: responseText,
      };

      /*
       * -----------------------------------------------------
       * 7. DISPLAY GEMINI RESPONSE
       * -----------------------------------------------------
       */
      setMessages((previousMessages) => [
        ...previousMessages,
        copilotMessage,
      ]);
    } catch (error) {
      console.error(
        "TIDAL Copilot request failed:",
        error
      );

      /*
       * -----------------------------------------------------
       * ERROR MESSAGE
       * -----------------------------------------------------
       */
      const errorMessage: MessageItem = {
        id: `copilot-error-${Date.now()}`,
        sender: "copilot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        text:
          "Sorry, I couldn't get a response from TIDAL Copilot.",
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        errorMessage,
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * APPROVE EXISTING DECISION ADVISORY
   *
   * This is retained so old TIDAL DecisionCards continue
   * working if they exist in stored history.
   * ---------------------------------------------------------
   */
  const handleApproveAdvisory = (
    decisionId: string
  ) => {
    setMessages((previousMessages) =>
      previousMessages.map((message) => {
        if (
          message.decision &&
          message.decision.id === decisionId
        ) {
          return {
            ...message,
            decision: {
              ...message.decision,
              approvalStatus:
                "APPROVED_BY_USER" as ApprovalStatus,
            },
          };
        }

        return message;
      })
    );
  };

  /*
   * ---------------------------------------------------------
   * CLEAR CHAT HISTORY
   * ---------------------------------------------------------
   */
  const handleClearHistory = () => {
    setMessages([]);

    if (userProfile.identifier) {
      saveUserChatHistory(
        userProfile.identifier,
        []
      );
    }
  };

  const hasHistory = messages.length > 0;

  /*
   * ---------------------------------------------------------
   * UI
   * ---------------------------------------------------------
   */
  return (
    <main className="flex-1 flex flex-col h-full bg-background overflow-hidden justify-between">

      {/* =====================================================
          1. HEADER
          ===================================================== */}
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
            <span className="text-dark-light">
              •
            </span>

            <span className="text-[11px] font-medium text-dark-muted px-2 py-0.5 bg-gray-50 border border-border rounded-md capitalize">
              Role:{" "}
              {userProfile.role
                .toLowerCase()
                .replace(/_/g, " ")}
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

      {/* =====================================================
          2. CONVERSATION AREA
          ===================================================== */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-5xl w-full mx-auto">

        {/* ===================================================
            EMPTY STATE
            =================================================== */}
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
                Explore operational decisions conversationally.
                Ask about sea safety envelopes, IMD weather
                forecasts, PFZ coordinates, or route risk
                assessments.
              </p>
            </div>

            {/* Starter suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 max-w-lg">
              {activeSuggestions.map(
                (suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() =>
                      handleSendQuery(suggestion)
                    }
                    disabled={isThinking}
                    className="px-3.5 py-2 bg-white hover:bg-blue-50 border border-border hover:border-primary rounded-xl text-xs font-medium text-dark-text transition-colors flex items-center gap-1.5 shadow-subtle text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{suggestion}</span>

                    <ArrowRight className="w-3 h-3 text-dark-muted shrink-0" />
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* ===================================================
            MESSAGE FEED
            =================================================== */}
        {messages.map((message) => {

          /*
           * -------------------------------------------------
           * USER MESSAGE
           * -------------------------------------------------
           */
          if (message.sender === "user") {
            return (
              <div
                key={message.id}
                className="flex items-start justify-end gap-2.5 max-w-2xl ml-auto"
              >
                <div className="bg-primary text-white px-4 py-2.5 rounded-xl rounded-tr-none text-xs sm:text-sm shadow-subtle font-medium whitespace-pre-line">
                  {message.text}
                </div>

                <div className="w-7 h-7 rounded-full bg-blue-100 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              </div>
            );
          }

          /*
           * -------------------------------------------------
           * OLD TIDAL DECISION CARD
           *
           * Kept only for previously stored decision messages.
           *
           * New Gemini messages do NOT enter this block.
           * -------------------------------------------------
           */
          if (message.decision) {
            return (
              <div
                key={message.id}
                className="space-y-2"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-dark-muted pl-1">

                  <div className="w-6 h-6 rounded-md bg-blue-50 text-primary flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5" />
                  </div>

                  <span>
                    TIDAL Decision Intelligence Response
                  </span>

                  <span className="text-[10px] text-dark-light">
                    • {message.timestamp}
                  </span>
                </div>

                <DecisionCard
                  decision={message.decision}
                  onApproveAdvisory={
                    handleApproveAdvisory
                  }
                />
              </div>
            );
          }

          /*
           * -------------------------------------------------
           * NEW GEMINI / COPILOT TEXT RESPONSE
           *
           * THIS IS THE IMPORTANT PART.
           *
           * message.text contains the actual response
           * returned by /api/chat.
           * -------------------------------------------------
           */
          if (
            message.sender === "copilot" &&
            typeof message.text === "string" &&
            message.text.trim().length > 0
          ) {
            return (
              <div
                key={message.id}
                className="space-y-2 max-w-3xl"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-dark-muted pl-1">

                  <div className="w-6 h-6 rounded-md bg-blue-50 text-primary flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5" />
                  </div>

                  <span>
                    TIDAL Copilot
                  </span>

                  <span className="text-[10px] text-dark-light">
                    • {message.timestamp}
                  </span>
                </div>

                <div className="bg-white border border-border p-4 rounded-xl text-xs sm:text-sm shadow-subtle text-dark-text whitespace-pre-line font-medium leading-relaxed">
                  {message.text}
                </div>
              </div>
            );
          }

          return null;
        })}

        {/* ===================================================
            THINKING INDICATOR
            =================================================== */}
        {isThinking && (
          <LiveReasoningTrace
            title="TIDAL Multi-Agent Core Reasoning"
            durationPerStep={400}
          />
        )}
      </div>

      {/* =====================================================
          3. CHAT COMPOSER
          ===================================================== */}
      <div className="p-4 bg-white border-t border-border space-y-3 shrink-0">

        <div className="max-w-5xl w-full mx-auto space-y-2.5">

          {/* =================================================
              SUGGESTION CHIPS
              ================================================= */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs select-none scrollbar-thin">

            <span className="text-[11px] font-bold text-dark-muted whitespace-nowrap shrink-0">
              Suggestions:
            </span>

            <div className="flex items-center gap-2 shrink-0">
              {activeSuggestions.map(
                (suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() =>
                      handleSendQuery(suggestion)
                    }
                    disabled={isThinking}
                    className="px-3 py-1 bg-gray-50 hover:bg-blue-50 border border-border hover:border-primary-border rounded-full text-[11px] font-medium text-dark-text whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0 shadow-subtle disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{suggestion}</span>

                    <ArrowRight className="w-3 h-3 text-dark-muted shrink-0" />
                  </button>
                )
              )}
            </div>
          </div>

          {/* =================================================
              INPUT FORM
              ================================================= */}
          <form
            onSubmit={(event) => {
              event.preventDefault();

              void handleSendQuery();
            }}
            className="flex items-center gap-2"
          >

            <div className="relative flex-1">

              <Input
                type="text"
                value={inputQuery}
                onChange={(event) =>
                  setInputQuery(event.target.value)
                }
                placeholder="Ask TIDAL anything about marine conditions, safety, PFZs, routes, hazards..."
                className="h-11 pr-11 pl-4 text-xs sm:text-sm rounded-xl border-border bg-gray-50/60 focus-visible:bg-white focus-visible:ring-primary"
                disabled={isThinking}
              />

              {/* Microphone */}
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-dark-muted hover:text-primary transition-colors"
                title="Voice input (Microphone control)"
                disabled={isThinking}
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            {/* Ask button */}
            <Button
              type="submit"
              disabled={
                !inputQuery.trim() ||
                isThinking
              }
              className="h-11 px-5 rounded-xl gap-2 font-semibold shadow-sm text-xs sm:text-sm"
            >
              <span>
                {isThinking ? "Thinking..." : "Ask"}
              </span>

              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
};