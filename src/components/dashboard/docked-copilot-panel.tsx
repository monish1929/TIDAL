"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowRight,
  Bot,
  Maximize2,
  MessageSquare,
  Mic,
  RotateCcw,
  Send,
  Sparkles,
  User,
  Volume2,
  VolumeX,
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

/* ============================================================
   TYPES
   ============================================================ */

interface MessageItem {
  id: string;
  sender: "user" | "copilot";
  timestamp: string;
  text: string;
}

interface DockedCopilotPanelProps {
  userProfile: UserProfile;
  currentScope: TopicScope;
  isResearchMode: boolean;
  isOpen: boolean;
  onToggleOpen: () => void;

  /*
   * Optional parent language.
   *
   * IMPORTANT:
   * localStorage is preferred because the header language
   * selector updates localStorage in the same browser.
   */
  language?: string;
}

type LanguageConfig = {
  name: string;
  code: string;
  speechCode: string;
};

/* ============================================================
   LANGUAGE CONFIGURATION
   ============================================================ */

const LANGUAGE_CONFIG: Record<string, LanguageConfig> = {
  English: {
    name: "English",
    code: "en",
    speechCode: "en-IN",
  },

  Hindi: {
    name: "Hindi",
    code: "hi",
    speechCode: "hi-IN",
  },

  Tamil: {
    name: "Tamil",
    code: "ta",
    speechCode: "ta-IN",
  },

  Telugu: {
    name: "Telugu",
    code: "te",
    speechCode: "te-IN",
  },

  Malayalam: {
    name: "Malayalam",
    code: "ml",
    speechCode: "ml-IN",
  },

  Bengali: {
    name: "Bengali",
    code: "bn",
    speechCode: "bn-IN",
  },
};

/* ============================================================
   LANGUAGE NORMALIZATION
   ============================================================ */

function normalizeLanguage(value?: string): LanguageConfig {
  const text = String(value || "")
    .trim()
    .toLowerCase();

  /* English */

  if (
    text === "en" ||
    text.includes("english") ||
    text.includes("eng")
  ) {
    return LANGUAGE_CONFIG.English;
  }

  /* Hindi */

  if (
    text === "hi" ||
    text.includes("hindi") ||
    text.includes("हिन्दी") ||
    text.includes("हिंदी")
  ) {
    return LANGUAGE_CONFIG.Hindi;
  }

  /* Tamil */

  if (
    text === "ta" ||
    text.includes("tamil") ||
    text.includes("தமிழ்")
  ) {
    return LANGUAGE_CONFIG.Tamil;
  }

  /* Telugu */

  if (
    text === "te" ||
    text.includes("telugu") ||
    text.includes("తెలుగు")
  ) {
    return LANGUAGE_CONFIG.Telugu;
  }

  /* Malayalam */

  if (
    text === "ml" ||
    text.includes("malayalam") ||
    text.includes("മലയാളം")
  ) {
    return LANGUAGE_CONFIG.Malayalam;
  }

  /* Bengali */

  if (
    text === "bn" ||
    text.includes("bengali") ||
    text.includes("বাংলা")
  ) {
    return LANGUAGE_CONFIG.Bengali;
  }

  return LANGUAGE_CONFIG.English;
}

/* ============================================================
   DASHBOARD CONTEXT
   ============================================================ */

const DEFAULT_DASHBOARD_DATA = {
  region: "Gulf of Mannar & Palk Bay",

  location: {
    primary: "Gulf of Mannar",
    nearby: "Rameshwaram",
    country: "India",
    state: "Tamil Nadu",
  },

  currentConditions: {
    seaTemperature: "28.4°C",
    waveHeight: "2.4 m",
    confidence: "96%",
  },

  waveSafety: {
    currentWaveHeight: 2.4,
    unit: "meters",
    status: "Category A",
    interpretation:
      "Prototype dashboard classification for the displayed sea state.",
  },

  fishingIntelligence: {
    nearestFishingZoneDistance: "14.8 NM",
    catchExpectation: "High Fish Catch Expected",
    targetSpecies: [
      "Tuna",
      "Mackerel",
    ],
  },

  timing: {
    bestWindow: "05:00 AM - 08:30 AM",
    goodConditionsUntil: "01:00 PM",
    advisoryAfter: "01:30 PM",
    advisoryWaveHeight: "above 2.2 m",
  },

  route: {
    status: "Safe Corridor",
    distance: "14.8 NM",
    estimatedTravelTime: "1h 15m",
  },

  operationalSources: [
    "INCOIS OSF",
    "INCOIS PFZ",
    "IMD Marine",
    "ISRO Oceansat",
  ],

  dataStatus:
    "Prototype/demo dashboard context. These values are not guaranteed to be live.",
};

/* ============================================================
   RESPONSE FORMATTER
   ============================================================ */

const formatInlineText = (
  text: string
): React.ReactNode => {
  const parts = text.split(
    /(\*\*[^*]+\*\*)/g
  );

  return parts.map((part, index) => {
    if (
      part.startsWith("**") &&
      part.endsWith("**")
    ) {
      return (
        <strong key={index}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    return (
      <React.Fragment key={index}>
        {part}
      </React.Fragment>
    );
  });
};

const formatResponseText = (
  text: string
): React.ReactNode => {
  const lines = text.split("\n");

  return lines.map((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      return (
        <div
          key={index}
          className="h-2"
        />
      );
    }

    /* Bullet */

    if (
      trimmed.startsWith("- ") ||
      trimmed.startsWith("• ")
    ) {
      const bullet = trimmed.replace(
        /^[-•]\s*/,
        ""
      );

      return (
        <div
          key={index}
          className="flex gap-2 leading-relaxed"
        >
          <span>•</span>

          <span>
            {formatInlineText(bullet)}
          </span>
        </div>
      );
    }

    /* Table separator */

    if (
      /^\|?[\s:|-]+\|/.test(trimmed) &&
      trimmed.includes("---")
    ) {
      return null;
    }

    /* Markdown table */

    if (
      trimmed.startsWith("|") &&
      trimmed.endsWith("|")
    ) {
      const cells = trimmed
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim());

      return (
        <div
          key={index}
          className="grid grid-cols-2 gap-2 border-b border-border py-1.5 last:border-b-0"
        >
          {cells.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className="min-w-0"
            >
              {formatInlineText(cell)}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div
        key={index}
        className="leading-relaxed"
      >
        {formatInlineText(line)}
      </div>
    );
  });
};

/* ============================================================
   COMPONENT
   ============================================================ */

export const DockedCopilotPanel: React.FC<
  DockedCopilotPanelProps
> = ({
  userProfile,
  currentScope,
  isResearchMode,
  isOpen,
  onToggleOpen,
  language: languageProp,
}) => {
    /* ==========================================================
       STATE
       ========================================================== */

    const [messages, setMessages] =
      useState<MessageItem[]>([]);

    const [inputQuery, setInputQuery] =
      useState("");

    const [isThinking, setIsThinking] =
      useState(false);

    const [isListening, setIsListening] =
      useState(false);

    const [speakingId, setSpeakingId] =
      useState<string | null>(null);

    /*
     * Start with parent language.
     * It will immediately be corrected from localStorage
     * in the language effect below.
     */
    const [selectedLanguage, setSelectedLanguage] =
      useState<LanguageConfig>(
        normalizeLanguage(languageProp || "English")
      );

    const messagesEndRef =
      useRef<HTMLDivElement>(null);

    const recognitionRef =
      useRef<SpeechRecognition | null>(null);

    const audioRef =
      useRef<HTMLAudioElement | null>(null);

    /* ==========================================================
       LANGUAGE
       ========================================================== */

    useEffect(() => {
      /*
       * IMPORTANT FIX
       *
       * The old code used:
       *
       * languageProp || stored || documentLanguage
       *
       * That caused "English" from the parent to always win.
       *
       * We now use:
       *
       * localStorage
       *      ↓
       * document language
       *      ↓
       * parent language
       *      ↓
       * English
       *
       * This allows the header selector to control Copilot.
       */

      const readLanguage = () => {
        let storedLanguage: string | null = null;

        try {
          storedLanguage =
            window.localStorage.getItem(
              "tidal-language"
            );
        } catch {
          storedLanguage = null;
        }

        const documentLanguage =
          typeof document !== "undefined"
            ? document.documentElement.lang
            : "";

        const resolvedLanguage =
          storedLanguage ||
          documentLanguage ||
          languageProp ||
          "English";

        const normalized =
          normalizeLanguage(resolvedLanguage);

        console.log(
          "[TIDAL] Language resolved:",
          {
            storedLanguage,
            documentLanguage,
            languageProp,
            selected: normalized.name,
            code: normalized.code,
          }
        );

        setSelectedLanguage(normalized);
      };

      readLanguage();

      /* Same-tab custom event */

      const handleLanguageChange = (
        event: Event
      ) => {
        const customEvent =
          event as CustomEvent<string>;

        const newLanguage =
          customEvent.detail;

        if (newLanguage) {
          const normalized =
            normalizeLanguage(newLanguage);

          console.log(
            "[TIDAL] Language event:",
            normalized.name,
            normalized.code
          );

          setSelectedLanguage(normalized);
        } else {
          readLanguage();
        }
      };

      window.addEventListener(
        "tidal-language-change",
        handleLanguageChange
      );

      /*
       * Cross-tab storage event.
       */

      const handleStorageChange = (
        event: StorageEvent
      ) => {
        if (
          event.key === "tidal-language"
        ) {
          readLanguage();
        }
      };

      window.addEventListener(
        "storage",
        handleStorageChange
      );

      /*
       * Fallback.
       *
       * This is useful because localStorage changes
       * in the same tab do not automatically generate
       * the normal "storage" event.
       */

      const interval =
        window.setInterval(
          readLanguage,
          300
        );

      return () => {
        window.removeEventListener(
          "tidal-language-change",
          handleLanguageChange
        );

        window.removeEventListener(
          "storage",
          handleStorageChange
        );

        window.clearInterval(interval);
      };
    }, [languageProp]);

    /* ==========================================================
       LOAD CHAT HISTORY
       ========================================================== */

    useEffect(() => {
      if (!userProfile.identifier) {
        setMessages([]);
        return;
      }

      try {
        const storedHistory =
          getUserChatHistory(
            userProfile.identifier
          ) as
          | MessageItem[]
          | null
          | undefined;

        if (
          !storedHistory ||
          !Array.isArray(storedHistory)
        ) {
          setMessages([]);
          return;
        }

        const cleanedHistory: MessageItem[] =
          storedHistory
            .filter(
              (message) =>
                message &&
                (
                  message.sender === "user" ||
                  message.sender === "copilot"
                ) &&
                typeof message.text === "string" &&
                message.text.trim().length > 0
            )
            .map((message) => ({
              id:
                message.id ||
                `message-${Date.now()}-${Math.random()}`,
              sender: message.sender,
              timestamp:
                message.timestamp ||
                "Earlier",
              text:
                message.text?.trim() || "",
            }));

        setMessages(cleanedHistory);

        if (
          cleanedHistory.length !==
          storedHistory.length
        ) {
          saveUserChatHistory(
            userProfile.identifier,
            cleanedHistory
          );
        }
      } catch (error) {
        console.error(
          "[TIDAL] Failed to load history:",
          error
        );

        setMessages([]);
      }
    }, [userProfile.identifier]);

    /* ==========================================================
       SAVE CHAT HISTORY
       ========================================================== */

    useEffect(() => {
      if (!userProfile.identifier) {
        return;
      }

      saveUserChatHistory(
        userProfile.identifier,
        messages
      );
    }, [
      messages,
      userProfile.identifier,
    ]);

    /* ==========================================================
       AUTO SCROLL
       ========================================================== */

    useEffect(() => {
      if (!isOpen) {
        return;
      }

      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, [
      messages,
      isThinking,
      isOpen,
    ]);

    /* ==========================================================
       SUGGESTIONS
       ========================================================== */

    const activeSuggestions =
      SCOPED_PROMPT_SUGGESTIONS[
      currentScope
      ] ||
      SCOPED_PROMPT_SUGGESTIONS.fishing ||
      SCOPED_PROMPT_SUGGESTIONS.home;

    /* ==========================================================
       SPEECH RECOGNITION
       ========================================================== */

    const stopListening = () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        // Ignore stop errors.
      }

      recognitionRef.current = null;
      setIsListening(false);
    };

    const startListening = () => {
      if (
        typeof window === "undefined"
      ) {
        return;
      }

      const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert(
          "Voice input is not supported by this browser."
        );

        return;
      }

      if (isListening) {
        stopListening();
        return;
      }

      const recognition =
        new SpeechRecognition();

      /*
       * IMPORTANT:
       * Speech recognition follows the currently
       * selected UI language.
       */

      recognition.lang =
        selectedLanguage.speechCode;

      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (
        event: SpeechRecognitionEvent
      ) => {
        let transcript = "";

        for (
          let i = event.resultIndex;
          i < event.results.length;
          i++
        ) {
          transcript +=
            event.results[i][0].transcript;
        }

        setInputQuery(
          transcript.trim()
        );
      };

      recognition.onerror = (
        event: SpeechRecognitionErrorEvent
      ) => {
        console.error(
          "[TIDAL] Speech recognition error:",
          event.error
        );

        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognitionRef.current =
        recognition;

      try {
        recognition.start();
      } catch (error) {
        console.error(
          "[TIDAL] Unable to start microphone:",
          error
        );

        setIsListening(false);
      }
    };

    /* ==========================================================
       ELEVENLABS TEXT TO SPEECH
       ========================================================== */

    const stopSpeaking = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }

      setSpeakingId(null);
    };

    const speakResponse = async (
      message: MessageItem
    ) => {
      if (!message.text) {
        return;
      }

      /*
       * Clicking the same message stops playback.
       */

      if (speakingId === message.id) {
        stopSpeaking();
        return;
      }

      stopSpeaking();

      try {
        setSpeakingId(message.id);

        console.log(
          "[TIDAL] TTS language:",
          selectedLanguage.name,
          selectedLanguage.code
        );

        const response =
          await fetch("/api/tts", {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              text: message.text,

              language:
                selectedLanguage.name,

              languageCode:
                selectedLanguage.code,
            }),
          });

        if (!response.ok) {
          let errorMessage =
            "Voice generation failed.";

          try {
            const data =
              await response.json();

            if (
              typeof data.error ===
              "string"
            ) {
              errorMessage =
                data.error;
            }

            if (
              typeof data.details ===
              "string"
            ) {
              errorMessage +=
                ` ${data.details}`;
            }
          } catch {
            // Ignore JSON parsing errors.
          }

          throw new Error(
            errorMessage
          );
        }

        const audioBlob =
          await response.blob();

        if (
          !audioBlob.size
        ) {
          throw new Error(
            "ElevenLabs returned empty audio."
          );
        }

        const audioUrl =
          URL.createObjectURL(
            audioBlob
          );

        const audio =
          new Audio(audioUrl);

        audioRef.current = audio;

        audio.onended = () => {
          URL.revokeObjectURL(
            audioUrl
          );

          audioRef.current = null;
          setSpeakingId(null);
        };

        audio.onerror = () => {
          URL.revokeObjectURL(
            audioUrl
          );

          audioRef.current = null;
          setSpeakingId(null);
        };

        await audio.play();
      } catch (error) {
        console.error(
          "[TIDAL] ElevenLabs TTS error:",
          error
        );

        setSpeakingId(null);

        alert(
          error instanceof Error
            ? error.message
            : "Unable to play TIDAL voice."
        );
      }
    };

    /* ==========================================================
       SEND QUERY
       ========================================================== */

    const handleSendQuery = async (
      textToSend?: string
    ): Promise<void> => {
      const query = (
        textToSend !== undefined
          ? textToSend
          : inputQuery
      ).trim();

      if (
        !query ||
        isThinking
      ) {
        return;
      }

      /*
       * IMPORTANT:
       * Capture the language at the exact moment
       * the user sends the query.
       */

      const requestLanguage =
        selectedLanguage;

      console.log(
        "[TIDAL] Sending query:",
        {
          query,
          language:
            requestLanguage.name,
          languageCode:
            requestLanguage.code,
        }
      );

      const userMessage: MessageItem = {
        id:
          `user-${Date.now()}`,

        sender: "user",

        timestamp:
          new Date().toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),

        text: query,
      };

      setMessages(
        (previous) => [
          ...previous,
          userMessage,
        ]
      );

      setInputQuery("");
      setIsThinking(true);

      try {
        const response =
          await fetch("/api/chat", {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              query,

              role:
                userProfile.role ||
                "GENERAL",

              /*
               * SEND BOTH NAME AND CODE.
               *
               * Your route can use either.
               */

              language:
                requestLanguage.name,

              languageCode:
                requestLanguage.code,

              dashboardData: {
                ...DEFAULT_DASHBOARD_DATA,

                currentScope,

                researchMode:
                  isResearchMode,

                userRole:
                  userProfile.role ||
                  "GENERAL",

                responseLanguage:
                  requestLanguage.name,

                responseLanguageCode:
                  requestLanguage.code,
              },
            }),
          });

        let data: {
          text?: unknown;
          error?: unknown;
          details?: unknown;
        } = {};

        try {
          data =
            await response.json();
        } catch {
          data = {};
        }

        if (!response.ok) {
          const serverError =
            typeof data.error ===
              "string"
              ? data.error
              : typeof data.details ===
                "string"
                ? data.details
                : `API request failed with status ${response.status}`;

          throw new Error(
            serverError
          );
        }

        const responseText =
          typeof data.text ===
            "string"
            ? data.text.trim()
            : "";

        if (!responseText) {
          throw new Error(
            "TIDAL AI returned an empty response."
          );
        }

        const copilotMessage: MessageItem = {
          id:
            `copilot-${Date.now()}`,

          sender: "copilot",

          timestamp:
            new Date().toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            ),

          text: responseText,
        };

        setMessages(
          (previous) => [
            ...previous,
            copilotMessage,
          ]
        );
      } catch (error) {
        console.error(
          "[TIDAL] Copilot request failed:",
          error
        );

        const errorText =
          error instanceof Error
            ? error.message
            : "Unknown error";

        const errorMessage: MessageItem = {
          id:
            `copilot-error-${Date.now()}`,

          sender: "copilot",

          timestamp:
            new Date().toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            ),

          text:
            `Unable to get a TIDAL response: ${errorText}`,
        };

        setMessages(
          (previous) => [
            ...previous,
            errorMessage,
          ]
        );
      } finally {
        setIsThinking(false);
      }
    };

    /* ==========================================================
       CLEAR HISTORY
       ========================================================== */

    const handleClearHistory =
      (): void => {
        stopSpeaking();

        setMessages([]);
        setInputQuery("");

        if (
          userProfile.identifier
        ) {
          saveUserChatHistory(
            userProfile.identifier,
            []
          );
        }
      };

    const hasMessages =
      messages.length > 0;

    /* ==========================================================
       CLOSED STATE
       ========================================================== */

    if (!isOpen) {
      return (
        <button
          type="button"
          onClick={onToggleOpen}
          className="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-3 text-xs font-semibold text-dark-text shadow-card transition-colors hover:bg-gray-50"
          title="Open TIDAL Copilot"
        >
          <MessageSquare className="h-4 w-4 text-primary" />

          <span>
            Ask TIDAL Copilot
          </span>

          <Sparkles className="h-3.5 w-3.5 text-primary" />
        </button>
      );
    }

    /* ==========================================================
       OPEN PANEL
       ========================================================== */

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
                    .replace(
                      /_/g,
                      " "
                    )
                    .toLowerCase()}
                </span>

                <span>•</span>

                <span className="font-semibold text-primary">
                  {selectedLanguage.name}
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
              onClick={
                handleClearHistory
              }
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
              onClick={
                onToggleOpen
              }
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

            {!hasMessages &&
              !isThinking && (
                <div className="flex min-h-[320px] flex-col items-center justify-center px-4 text-center">

                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-primary">
                    <Sparkles className="h-7 w-7" />
                  </div>

                  <h3 className="text-sm font-bold text-dark-text">
                    Ask TIDAL Anything
                  </h3>

                  <p className="mt-2 max-w-xs text-[11px] leading-relaxed text-dark-muted">
                    Ask about marine
                    conditions, fishing,
                    vessel safety,
                    hazards, routes, or
                    the Gulf of Mannar.
                  </p>

                  <p className="mt-2 text-[10px] font-semibold text-primary">
                    Responding in{" "}
                    {selectedLanguage.name}
                  </p>

                  <div className="mt-5 flex max-w-sm flex-wrap justify-center gap-2">

                    {activeSuggestions
                      .slice(0, 3)
                      .map(
                        (
                          suggestion,
                          index
                        ) => (
                          <button
                            key={`${suggestion}-${index}`}
                            type="button"
                            onClick={() =>
                              void handleSendQuery(
                                suggestion
                              )
                            }
                            disabled={
                              isThinking
                            }
                            className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-left text-[10px] font-medium text-dark-text shadow-subtle transition-colors hover:border-primary hover:bg-blue-50 disabled:opacity-50"
                          >
                            <span>
                              {
                                suggestion
                              }
                            </span>

                            <ArrowRight className="h-3 w-3 shrink-0 text-dark-muted" />
                          </button>
                        )
                      )}

                  </div>

                </div>
              )}

            {/* ======================================================
              MESSAGES
          ====================================================== */}

            {messages.map(
              (message) => {

                if (
                  message.sender ===
                  "user"
                ) {
                  return (
                    <div
                      key={
                        message.id
                      }
                      className="flex items-start justify-end gap-2"
                    >
                      <div className="max-w-[82%] rounded-xl rounded-tr-none bg-primary px-3.5 py-2.5 text-xs font-medium leading-relaxed text-white shadow-subtle">
                        {
                          message.text
                        }
                      </div>

                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-primary">
                        <User className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={
                      message.id
                    }
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
                        •{" "}
                        {
                          message.timestamp
                        }
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          void speakResponse(
                            message
                          )
                        }
                        className={`ml-auto rounded-md p-1.5 transition-colors ${speakingId ===
                            message.id
                            ? "bg-blue-50 text-primary"
                            : "text-dark-muted hover:bg-gray-100 hover:text-primary"
                          }`}
                        title={
                          speakingId ===
                            message.id
                            ? "Stop voice"
                            : `Listen in ${selectedLanguage.name}`
                        }
                      >

                        {speakingId ===
                          message.id ? (
                          <VolumeX className="h-3.5 w-3.5" />
                        ) : (
                          <Volume2 className="h-3.5 w-3.5" />
                        )}

                      </button>

                    </div>

                    <div className="rounded-xl border border-border bg-white p-3.5 text-xs leading-relaxed text-dark-text shadow-subtle">
                      {formatResponseText(
                        message.text
                      )}
                    </div>

                  </div>
                );
              }
            )}

            {/* ======================================================
              THINKING
          ====================================================== */}

            {isThinking && (
              <div className="space-y-2">

                <div className="flex items-center gap-2 px-1">

                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-primary">
                    <Bot className="h-3.5 w-3.5" />
                  </div>

                  <span className="text-[10px] font-bold text-dark-muted">
                    TIDAL Copilot
                  </span>

                  <span className="text-[9px] text-dark-light">
                    Responding in{" "}
                    {
                      selectedLanguage.name
                    }
                  </span>

                </div>

                <LiveReasoningTrace
                  title="TIDAL Copilot is thinking"
                  durationPerStep={
                    400
                  }
                />

              </div>
            )}

            <div
              ref={
                messagesEndRef
              }
            />

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
                .map(
                  (
                    suggestion,
                    index
                  ) => (
                    <button
                      key={`${suggestion}-${index}`}
                      type="button"
                      onClick={() =>
                        void handleSendQuery(
                          suggestion
                        )
                      }
                      disabled={
                        isThinking
                      }
                      className="whitespace-nowrap rounded-full border border-border bg-gray-50 px-2.5 py-1.5 text-[9px] font-medium text-dark-text transition-colors hover:border-primary hover:bg-blue-50 disabled:opacity-50"
                    >
                      {
                        suggestion
                      }
                    </button>
                  )
                )}

            </div>

          </div>
        </div>

        {/* ========================================================
          INPUT
      ======================================================== */}

        <div className="shrink-0 border-t border-border bg-white p-3.5">

          <form
            onSubmit={(
              event
            ) => {
              event.preventDefault();

              void handleSendQuery();
            }}
            className="flex items-center gap-2"
          >

            <div className="relative flex-1">

              <Input
                type="text"
                value={
                  inputQuery
                }
                onChange={(
                  event
                ) =>
                  setInputQuery(
                    event.target.value
                  )
                }
                disabled={
                  isThinking
                }
                placeholder={`Ask TIDAL in ${selectedLanguage.name}...`}
                className="h-10 rounded-xl border-border bg-gray-50/60 pr-10 pl-3 text-xs focus-visible:bg-white focus-visible:ring-primary"
              />

              <button
                type="button"
                onClick={
                  startListening
                }
                className={`absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 transition-colors ${isListening
                    ? "text-primary"
                    : "text-dark-muted hover:text-primary"
                  }`}
                title={
                  isListening
                    ? "Stop voice input"
                    : `Speak in ${selectedLanguage.name}`
                }
              >
                <Mic
                  className={`h-4 w-4 ${isListening
                      ? "animate-pulse"
                      : ""
                    }`}
                />
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
              <span>
                Ask
              </span>

              <Send className="h-3.5 w-3.5" />
            </Button>

          </form>

          <div className="mt-2 flex items-center justify-center gap-1 text-[8px] text-dark-light">

            <Sparkles className="h-2.5 w-2.5" />

            <span>
              TIDAL AI •{" "}
              {
                selectedLanguage.name
              }{" "}
              • Voice enabled
            </span>

          </div>

        </div>

      </aside>
    );
  };

/* ============================================================
   BROWSER SPEECH RECOGNITION TYPES
   ============================================================ */

declare global {
  interface Window {
    SpeechRecognition?: {
      new(): SpeechRecognition;
    };

    webkitSpeechRecognition?: {
      new(): SpeechRecognition;
    };
  }

  interface SpeechRecognition {
    lang: string;
    continuous: boolean;
    interimResults: boolean;

    start(): void;
    stop(): void;

    onstart:
    | (() => void)
    | null;

    onresult:
    | ((
      event: SpeechRecognitionEvent
    ) => void)
    | null;

    onerror:
    | ((
      event: SpeechRecognitionErrorEvent
    ) => void)
    | null;

    onend:
    | (() => void)
    | null;
  }

  interface SpeechRecognitionEvent
    extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionErrorEvent
    extends Event {
    error: string;
    message: string;
  }
}

export default DockedCopilotPanel;