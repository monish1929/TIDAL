"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bot,
  Maximize2,
  MessageSquare,
  Mic,
  Minimize2,
  RotateCcw,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { LiveReasoningTrace } from "./live-reasoning-trace";

import { TopicScope } from "@/types/decision";
import { UserProfile } from "@/types/user";

import { SCOPED_PROMPT_SUGGESTIONS } from "@/mocks/decisionMocks";

import {
  getUserChatHistory,
  saveUserChatHistory,
} from "@/lib/storage";

interface MessageItem {
  id: string;
  sender: "user" | "copilot";
  timestamp: string;
  text?: string;
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

  /*
   * ------------------------------------------------------------
   * LOAD CHAT HISTORY
   * ------------------------------------------------------------
   *
   * Important:
   * Old versions of this component stored DecisionResponse
   * objects in chat history.
   *
   * We intentionally keep only normal user/copilot text messages.
   * This prevents old hardcoded DecisionCards from appearing again.
   */
  useEffect(() => {
    if (!userProfile.identifier) {
      setMessages([]);
      return;
    }

    try {
      const storedHistory = getUserChatHistory(
        userProfile.identifier
      ) as MessageItem[] | null | undefined;

      if (!storedHistory || !Array.isArray(storedHistory)) {
        setMessages([]);
        return;
      }

      /*
       * Remove old decision-card messages.
       * Keep only messages containing actual text.
       */
      const cleanedHistory: MessageItem[] = storedHistory
        .filter(
          (message) =>
            message &&
            (message.sender === "user" ||
              message.sender === "copilot") &&
            typeof message.text === "string" &&
            message.text.trim().length > 0
        )
        .map((message) => ({
          id: message.id,
          sender: message.sender,
          timestamp: message.timestamp || "Earlier",
          text: message.text?.trim(),
        }));

      setMessages(cleanedHistory);

      /*
       * Save the cleaned history so old DecisionCards
       * are permanently removed from localStorage.
       */
      if (cleanedHistory.length !== storedHistory.length) {
        saveUserChatHistory(
          userProfile.identifier,
          cleanedHistory
        );
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
      setMessages([]);
    }
  }, [userProfile.identifier]);

  /*
   * ------------------------------------------------------------
   * SAVE CHAT HISTORY
   * ------------------------------------------------------------
   */
  useEffect(() => {
    if (!userProfile.identifier) {
      return;
    }

    if (messages.length === 0) {
      return;
    }

    saveUserChatHistory(
      userProfile.identifier,
      messages
    );
  }, [messages, userProfile.identifier]);

  /*
   * ------------------------------------------------------------
   * AUTO SCROLL
   * ------------------------------------------------------------
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isThinking, isOpen]);

  /*
   * ------------------------------------------------------------
   * SUGGESTIONS
   * ------------------------------------------------------------
   */
  const activeSuggestions =
    SCOPED_PROMPT_SUGGESTIONS[currentScope] ||
    SCOPED_PROMPT_SUGGESTIONS.fishing ||
    SCOPED_PROMPT_SUGGESTIONS.home;

  /*
   * ------------------------------------------------------------
   * SEND QUERY TO REAL BACKEND
   * ------------------------------------------------------------
   *
   * This is the important part.
   *
   * User query
   *      ↓
   * POST /api/chat
   *      ↓
   * Gemini backend
   *      ↓
   * { text: "..." }
   *      ↓
   * Display actual Gemini text
   *
   * There is NO mock response here.
   * There is NO DecisionCard here.
   */
  const handleSendQuery = async (
    textToSend?: string
  ): Promise<void> => {
    const query = (
      textToSend !== undefined
        ? textToSend
        : inputQuery
    ).trim();

    if (!query || isThinking) {
      return;
    }

    const userMessage: MessageItem = {
      id: `user-${Date.now()}`,
      sender: "user",
      timestamp: "Just now",
      text: query,
    };

    /*
     * Immediately show user's message.
     */
    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInputQuery("");
    setIsThinking(true);

    try {
      /*
       * Call the existing working API route.
       */
      const response = await fetch("/api/chat", {
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

      /*
       * Try to parse JSON safely.
       */
      let data: {
        text?: unknown;
        error?: unknown;
      } = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      /*
       * Handle HTTP errors.
       */
      if (!response.ok) {
        const serverError =
          typeof data.error === "string"
            ? data.error
            : `API request failed with status ${response.status}`;

        throw new Error(serverError);
      }

      /*
       * Extract Gemini response.
       */
      const responseText =
        typeof data.text === "string"
          ? data.text.trim()
          : "";

      if (!responseText) {
        throw new Error(
          "The API returned an empty response."
        );
      }

      /*
       * Display the actual response as plain copilot text.
       *
       * IMPORTANT:
       * We do NOT create a DecisionResponse.
       * We do NOT create a DecisionCard.
       */
      const copilotMessage: MessageItem = {
        id: `copilot-${Date.now()}`,
        sender: "copilot",
        timestamp: "Just now",
        text: responseText,
      };

      setMessages((previous) => [
        ...previous,
        copilotMessage,
      ]);
    } catch (error) {
      console.error(
        "TIDAL Copilot request failed:",
        error
      );

      const errorText =
        error instanceof Error
          ? error.message
          : "Unknown error";

      const errorMessage: MessageItem = {
        id: `copilot-error-${Date.now()}`,
        sender: "copilot",
        timestamp: "Just now",
        text: `Unable to get a TIDAL response: ${errorText}`,
      };

      setMessages((previous) => [
        ...previous,
        errorMessage,
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  /*
   * ------------------------------------------------------------
   * CLEAR HISTORY
   * ------------------------------------------------------------
   */
  const handleClearHistory = (): void => {
    setMessages([]);
    setInputQuery("");

    if (userProfile.identifier) {
      saveUserChatHistory(
        userProfile.identifier,
        []
      );
    }
  };

  /*
   * ------------------------------------------------------------
   * TOGGLE VOICE
   * ------------------------------------------------------------
   *
   * This only controls the existing UI state.
   * It does not affect Gemini chat.
   */
  const handleToggleListening = (): void => {
    setIsListening((previous) => !previous);
  };

  const hasMessages = messages.length > 0;

  /*
   * ------------------------------------------------------------
   * CLOSED STATE
   * ------------------------------------------------------------
   */
  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={onToggleOpen}
        className="fixed right-4 bottom-20 z-40 flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-3 text-xs font-semibold text-dark-text shadow-card transition-colors hover:bg-gray-50"
        title="Open TIDAL Copilot"
      >
        <MessageSquare className="h-4 w-4 text-primary" />
        <span>Ask TIDAL Copilot</span>
        <Sparkles className="h-3.5 w-3.5 text-primary" />
      </button>
    );
  }

  /*
   * ------------------------------------------------------------
   * OPEN PANEL
   * ------------------------------------------------------------
   */
  return (
    <aside className="flex h-full w-full flex-col overflow-hidden border-l border-border bg-background">
      {/* ========================================================
          HEADER
      ======================================================== */}
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-white px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary">
            <Bot className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-xs font-bold uppercase tracking-wider text-dark-text">
                TIDAL Copilot
              </h2>

              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Online
              </span>
            </div>

            <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-dark-muted">
              <span>
                Scope:{" "}
                {currentScope
                  .replace(/_/g, " ")
                  .toLowerCase()}
              </span>

              {isResearchMode && (
                <>
                  <span>•</span>
                  <span className="font-semibold text-indigo-700">
                    Research Mode
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={handleClearHistory}
            disabled={!hasMessages}
            className="rounded-md p-1.5 text-dark-muted transition-colors hover:bg-gray-100 hover:text-dark-text disabled:cursor-not-allowed disabled:opacity-40"
            title="Clear conversation"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            className="rounded-md p-1.5 text-dark-muted transition-colors hover:bg-gray-100 hover:text-dark-text"
            title="Maximize"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={onToggleOpen}
            className="rounded-md p-1.5 text-dark-muted transition-colors hover:bg-gray-100 hover:text-dark-text"
            title="Close Copilot"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ========================================================
          CONVERSATION
      ======================================================== */}
      <div className="flex-1 overflow-y-auto p-3.5">
        <div className="space-y-4">
          {/* EMPTY STATE */}
          {!hasMessages && !isThinking && (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-4 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-primary">
                <Sparkles className="h-7 w-7" />
              </div>

              <h3 className="text-sm font-bold text-dark-text">
                Ask TIDAL Anything
              </h3>

              <p className="mt-2 max-w-xs text-[11px] leading-relaxed text-dark-muted">
                Ask a marine intelligence question and
                receive a response generated by the
                TIDAL Gemini backend.
              </p>

              <div className="mt-5 flex max-w-sm flex-wrap justify-center gap-2">
                {activeSuggestions
                  .slice(0, 3)
                  .map((suggestion, index) => (
                    <button
                      key={`${suggestion}-${index}`}
                      type="button"
                      onClick={() => {
                        void handleSendQuery(
                          suggestion
                        );
                      }}
                      disabled={isThinking}
                      className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-left text-[10px] font-medium text-dark-text shadow-subtle transition-colors hover:border-primary hover:bg-blue-50 disabled:opacity-50"
                    >
                      <span>{suggestion}</span>
                      <ArrowRight className="h-3 w-3 shrink-0 text-dark-muted" />
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* MESSAGES */}
          {messages.map((message) => {
            if (message.sender === "user") {
              return (
                <div
                  key={message.id}
                  className="flex items-start justify-end gap-2"
                >
                  <div className="max-w-[82%] rounded-xl rounded-tr-none bg-primary px-3.5 py-2.5 text-xs font-medium leading-relaxed text-white shadow-subtle">
                    {message.text}
                  </div>

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-primary">
                    <User className="h-3.5 w-3.5" />
                  </div>
                </div>
              );
            }

            return (
              <div
                key={message.id}
                className="space-y-2"
              >
                <div className="flex items-center gap-2 px-1">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-primary">
                    <Bot className="h-3.5 w-3.5" />
                  </div>

                  <span className="text-[10px] font-bold text-dark-muted">
                    TIDAL Copilot
                  </span>

                  <span className="text-[9px] text-dark-light">
                    • {message.timestamp}
                  </span>
                </div>

                <div className="rounded-xl border border-border bg-white p-3.5 text-xs leading-relaxed text-dark-text shadow-subtle">
                  {message.text}
                </div>
              </div>
            );
          })}

          {/* THINKING */}
          {isThinking && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-primary">
                  <Bot className="h-3.5 w-3.5" />
                </div>

                <span className="text-[10px] font-bold text-dark-muted">
                  TIDAL Copilot
                </span>
              </div>

              <LiveReasoningTrace
                title="TIDAL Copilot is thinking"
                durationPerStep={400}
              />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ========================================================
          SUGGESTIONS
      ======================================================== */}
      <div className="shrink-0 border-t border-border bg-white px-3.5 pt-2.5">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <span className="shrink-0 text-[9px] font-bold uppercase tracking-wide text-dark-muted">
            Suggestions
          </span>

          <div className="flex shrink-0 items-center gap-1.5">
            {activeSuggestions
              .slice(0, 4)
              .map((suggestion, index) => (
                <button
                  key={`${suggestion}-${index}`}
                  type="button"
                  onClick={() => {
                    void handleSendQuery(
                      suggestion
                    );
                  }}
                  disabled={isThinking}
                  className="whitespace-nowrap rounded-full border border-border bg-gray-50 px-2.5 py-1.5 text-[9px] font-medium text-dark-text transition-colors hover:border-primary hover:bg-blue-50 disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* ========================================================
          INPUT
      ======================================================== */}
      <div className="shrink-0 border-t border-border bg-white p-3.5">
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
              disabled={isThinking}
              placeholder="Ask TIDAL..."
              className="h-10 rounded-xl border-border bg-gray-50/60 pr-10 pl-3 text-xs focus-visible:bg-white focus-visible:ring-primary"
            />

            <button
              type="button"
              onClick={handleToggleListening}
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 transition-colors ${isListening
                  ? "text-primary"
                  : "text-dark-muted hover:text-primary"
                }`}
              title={
                isListening
                  ? "Stop voice input"
                  : "Voice input"
              }
            >
              <Mic className="h-4 w-4" />
            </button>
          </div>

          <Button
            type="submit"
            disabled={
              !inputQuery.trim() ||
              isThinking
            }
            className="h-10 rounded-xl px-4 text-xs font-semibold"
          >
            <span>Ask</span>
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>

        <div className="mt-2 flex items-center justify-center gap-1 text-[8px] text-dark-light">
          <Sparkles className="h-2.5 w-2.5" />
          <span>
            Responses generated by TIDAL Gemini backend
          </span>
        </div>
      </div>
    </aside>
  );
};