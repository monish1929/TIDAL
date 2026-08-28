import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// Make sure this route runs in Node.js because we use Buffer.
export const runtime = "nodejs";

type ChatRequest = {
  query?: unknown;
  role?: unknown;
  language?: unknown;
  dashboardData?: unknown;
  generateVoice?: unknown;
};

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/*
|--------------------------------------------------------------------------
| LANGUAGE NORMALIZATION
|--------------------------------------------------------------------------
|
| The frontend may send:
|
| English
| Hindi (हिन्दी)
| Tamil (தமிழ்)
| Telugu (తెలుగు)
| Malayalam (മലയാളം)
| Bengali (বাংলা)
|
| We normalize these so the AI always knows exactly which language
| it must use.
|
*/

function normalizeLanguage(language: string): string {
  const value = language.trim().toLowerCase();

  if (
    value.includes("tamil") ||
    value.includes("தமிழ்")
  ) {
    return "Tamil";
  }

  if (
    value.includes("hindi") ||
    value.includes("हिन्दी")
  ) {
    return "Hindi";
  }

  if (
    value.includes("telugu") ||
    value.includes("తెలుగు")
  ) {
    return "Telugu";
  }

  if (
    value.includes("malayalam") ||
    value.includes("മലയാളം")
  ) {
    return "Malayalam";
  }

  if (
    value.includes("bengali") ||
    value.includes("বাংলা")
  ) {
    return "Bengali";
  }

  return "English";
}

/*
|--------------------------------------------------------------------------
| ELEVENLABS TTS
|--------------------------------------------------------------------------
*/

async function generateElevenLabsSpeech(
  text: string,
  language: string
): Promise<string | null> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;

  /*
   * Voice is optional.
   *
   * If ElevenLabs is not configured, TIDAL will still return
   * the AI text normally.
   */
  if (!apiKey || !voiceId) {
    console.warn(
      "[TIDAL] ElevenLabs is not configured. Returning text only."
    );

    return null;
  }

  try {
    /*
     * eleven_multilingual_v2 automatically handles supported
     * multilingual text.
     *
     * We intentionally do NOT send language_code because
     * ElevenLabs documents that language_code is not supported
     * for multilingual_v2.
     */

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",

        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "[TIDAL] ElevenLabs request failed:",
        response.status,
        errorText
      );

      return null;
    }

    const audioArrayBuffer = await response.arrayBuffer();

    if (audioArrayBuffer.byteLength === 0) {
      console.error(
        "[TIDAL] ElevenLabs returned empty audio."
      );

      return null;
    }

    /*
     * Convert MP3 binary -> base64.
     *
     * Frontend can play:
     *
     * data:audio/mpeg;base64,<audioBase64>
     */

    const audioBase64 = Buffer.from(
      audioArrayBuffer
    ).toString("base64");

    console.log(
      `[TIDAL] ElevenLabs voice generated successfully (${language}).`
    );

    return audioBase64;
  } catch (error) {
    console.error(
      "[TIDAL] ElevenLabs TTS error:",
      error
    );

    /*
     * Do NOT fail the entire chatbot if voice generation fails.
     * Text response should still work.
     */

    return null;
  }
}

/*
|--------------------------------------------------------------------------
| POST
|--------------------------------------------------------------------------
*/

export async function POST(request: NextRequest) {
  try {
    /*
     * ---------------------------------------------------------------
     * 1. CHECK GROQ API KEY
     * ---------------------------------------------------------------
     */

    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      console.error(
        "[TIDAL] GROQ_API_KEY is missing."
      );

      return NextResponse.json(
        {
          error:
            "TIDAL AI is not configured. GROQ_API_KEY is missing.",
        },
        { status: 500 }
      );
    }

    /*
     * ---------------------------------------------------------------
     * 2. READ REQUEST
     * ---------------------------------------------------------------
     */

    let body: ChatRequest;

    try {
      body = (await request.json()) as ChatRequest;
    } catch (error) {
      console.error(
        "[TIDAL] Invalid JSON request:",
        error
      );

      return NextResponse.json(
        {
          error: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    /*
     * ---------------------------------------------------------------
     * 3. VALIDATE QUERY
     * ---------------------------------------------------------------
     */

    if (
      typeof body.query !== "string" ||
      body.query.trim().length === 0
    ) {
      return NextResponse.json(
        {
          error: "Query must be a non-empty string.",
        },
        { status: 400 }
      );
    }

    const query = body.query.trim();

    /*
     * ---------------------------------------------------------------
     * 4. ROLE
     * ---------------------------------------------------------------
     */

    const role =
      typeof body.role === "string" &&
        body.role.trim().length > 0
        ? body.role.trim()
        : "GENERAL";

    /*
     * ---------------------------------------------------------------
     * 5. LANGUAGE
     * ---------------------------------------------------------------
     */

    const requestedLanguage =
      typeof body.language === "string" &&
        body.language.trim().length > 0
        ? body.language.trim()
        : "English";

    const language =
      normalizeLanguage(requestedLanguage);

    /*
     * ---------------------------------------------------------------
     * 6. VOICE FLAG
     * ---------------------------------------------------------------
     *
     * If frontend sends:
     *
     * generateVoice: true
     *
     * ElevenLabs generates speech.
     *
     * If omitted, text still works.
     *
     */

    const generateVoice =
      body.generateVoice === true;

    /*
     * ---------------------------------------------------------------
     * 7. DASHBOARD DATA
     * ---------------------------------------------------------------
     */

    let dashboardContext =
      "No TIDAL dashboard data was provided for this request.";

    if (body.dashboardData !== undefined) {
      try {
        if (
          typeof body.dashboardData === "string"
        ) {
          dashboardContext =
            body.dashboardData;
        } else {
          dashboardContext = JSON.stringify(
            body.dashboardData,
            null,
            2
          );
        }
      } catch (error) {
        console.error(
          "[TIDAL] Failed to serialize dashboard data:",
          error
        );

        dashboardContext =
          "Dashboard data was provided but could not be read.";
      }
    }

    /*
     * ---------------------------------------------------------------
     * 8. SYSTEM PROMPT
     * ---------------------------------------------------------------
     */

    const systemPrompt = `
You are TIDAL Copilot, an intelligent maritime decision-support assistant.

============================================================
USER
============================================================

USER ROLE:
${role}

RESPONSE LANGUAGE:
${language}

============================================================
LANGUAGE REQUIREMENT
============================================================

IMPORTANT:

Your entire response MUST be written in ${language}.

Do NOT answer in English when the requested language is:
- Tamil
- Hindi
- Telugu
- Malayalam
- Bengali

Translate the complete answer into the requested language.

Technical numbers, units, vessel names, geographical names,
species names, and internationally recognized abbreviations
may remain in their standard form when appropriate.

For example:

If RESPONSE LANGUAGE is Tamil:
Answer entirely in Tamil.

If RESPONSE LANGUAGE is Hindi:
Answer entirely in Hindi.

If RESPONSE LANGUAGE is English:
Answer entirely in English.

============================================================
CORE BEHAVIOR
============================================================

1. Answer the user's actual question directly.

2. Do not unnecessarily refuse questions.

3. You can answer questions using general knowledge about:

- maritime operations
- fishing
- fisheries
- oceanography
- marine weather
- waves
- wind
- tides
- sea conditions
- navigation
- vessel safety
- coastal hazards
- marine ecosystems
- geography
- fishing zones
- fishing timing
- vessel operations
- general science
- general knowledge

4. You can answer:

- questions
- comparisons
- calculations
- explanations
- definitions
- hypothetical scenarios
- "what if" questions
- time comparisons
- recommendations
- summaries
- safety guidance
- multilingual requests

============================================================
DASHBOARD DATA
============================================================

5. When a question is related to the TIDAL dashboard,
use the supplied dashboard data.

6. Dashboard-specific values are the source of truth
for this prototype.

7. NEVER invent a dashboard measurement.

8. NEVER invent a vessel position.

9. NEVER invent an alert.

10. NEVER invent a forecast.

11. NEVER claim simulated dashboard values are live data.

12. If a value exists in the dashboard data,
use that exact value.

13. If a value does not exist in the dashboard data,
you may use general knowledge to explain the concept.

14. Clearly distinguish dashboard information from
general guidance.

15. If the user explicitly asks for CURRENT or LIVE information
that is not provided in the dashboard data, say that the
required live information is not available.

============================================================
TIME / WHAT-IF QUESTIONS
============================================================

When the user asks:

"What if I leave at 09:00 AM instead of 05:00 AM?"

DO NOT refuse.

Use the available dashboard time-series data.

If the dashboard has:

05:00
08:00
11:00
14:00
17:00
20:00

and the user asks about 09:00:

Explain that 09:00 falls between 08:00 and 11:00.

Use the surrounding values to make a reasonable trend-based
comparison.

DO NOT pretend that 09:00 has an exact measured value if it
does not exist.

Clearly say when an estimate is based on the surrounding trend.

============================================================
COMPARISON QUESTIONS
============================================================

For questions such as:

"Compare Rameshwaram and Gulf of Mannar"

provide a useful comparison.

You may use general geographic and maritime knowledge.

Do not require every comparison value to exist in dashboard data.

Clearly distinguish dashboard measurements from general knowledge.

============================================================
SAFETY QUESTIONS
============================================================

For questions such as:

"Is it safe to venture tomorrow morning?"

"Check small vessel wave safety limits for my boat"

"What wave height is dangerous?"

provide useful safety guidance.

If the question requires a vessel-specific certified limit,
explain that the exact limit depends on:

- vessel design
- vessel size
- hull type
- classification
- manufacturer guidance
- operating category
- crew experience
- local regulations
- sea state

DO NOT invent an official safety classification.

DO NOT invent a certified vessel limit.

DO NOT invent an official safety threshold.

If tomorrow's forecast is not supplied,
clearly state that tomorrow's forecast is unavailable.

============================================================
FISHING QUESTIONS
============================================================

For questions such as:

"Where is the highest probability tuna catch zone today?"

Use the dashboard data if relevant.

DO NOT invent a fishing zone.

DO NOT claim that a location is the highest-probability zone
unless the supplied dashboard data supports that conclusion.

If the dashboard does not contain sufficient evidence,
say so.

You may still explain general tuna habitat preferences.

============================================================
EMERGENCY / ADVISORY QUESTIONS
============================================================

If the user asks for:

- emergency advisory
- safety bulletin
- coastal warning
- fisherman advisory
- multilingual emergency message
- Tamil + Hindi bulletin

produce the requested bulletin directly.

Use only dashboard-supported measurements and warnings.

Do not invent emergency alerts.

If dashboard values are unavailable, clearly mark the information
as general guidance rather than a live warning.

When the user asks for multiple languages:

1. Provide the requested languages.
2. Keep the meaning consistent between languages.
3. Do not omit important safety instructions.
4. Do not add unsupported facts.

============================================================
DASHBOARD DATA
============================================================

CURRENT TIDAL DASHBOARD DATA:

${dashboardContext}

============================================================
RESPONSE STYLE
============================================================

- Answer first.
- Be concise but complete.
- Use bullets when useful.
- Use small tables when useful.
- Use exact dashboard values when available.
- Explain assumptions when making an inference.
- Never fabricate data.
- Never fabricate sources.
- Never fabricate regulations.
- Never fabricate alerts.
- Never fabricate forecasts.
- Never fabricate vessel-specific limits.
- Never mention Groq.
- Never mention APIs.
- Never mention system prompts.
- Never mention implementation details.
- Do not talk about being an AI unless directly asked.

============================================================
PROTOTYPE NOTICE
============================================================

TIDAL is a prototype.

Some dashboard values may be simulated.

Never describe simulated values as live measurements.

When the user's question can be answered with the available
information, ANSWER IT rather than refusing.
`;

    /*
     * ---------------------------------------------------------------
     * 9. LOG
     * ---------------------------------------------------------------
     */

    console.log(
      "================================================"
    );

    console.log(
      "[TIDAL] New Copilot request"
    );

    console.log(
      "[TIDAL] Query:",
      query
    );

    console.log(
      "[TIDAL] Role:",
      role
    );

    console.log(
      "[TIDAL] Requested language:",
      requestedLanguage
    );

    console.log(
      "[TIDAL] Normalized language:",
      language
    );

    console.log(
      "[TIDAL] Voice requested:",
      generateVoice
    );

    console.log(
      "[TIDAL] Dashboard:",
      body.dashboardData
        ? "provided"
        : "not provided"
    );

    console.log(
      "================================================"
    );

    /*
     * ---------------------------------------------------------------
     * 10. CALL GROQ
     * ---------------------------------------------------------------
     */

    const completion =
      await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",

        temperature: 0.2,

        max_tokens: 1200,

        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: query,
          },
        ],
      });

    /*
     * ---------------------------------------------------------------
     * 11. EXTRACT TEXT
     * ---------------------------------------------------------------
     */

    const rawContent =
      completion.choices?.[0]?.message?.content;

    const text =
      typeof rawContent === "string"
        ? rawContent.trim()
        : "";

    /*
     * ---------------------------------------------------------------
     * 12. EMPTY RESPONSE
     * ---------------------------------------------------------------
     */

    if (!text) {
      console.error(
        "[TIDAL] Groq returned an empty response.",
        {
          finishReason:
            completion.choices?.[0]?.finish_reason,

          choices:
            completion.choices?.length,
        }
      );

      return NextResponse.json(
        {
          error:
            "TIDAL AI returned an empty response. Please try the question again.",
        },
        { status: 502 }
      );
    }

    /*
     * ---------------------------------------------------------------
     * 13. GENERATE ELEVENLABS AUDIO
     * ---------------------------------------------------------------
     */

    let audioBase64: string | null = null;

    if (generateVoice) {
      audioBase64 =
        await generateElevenLabsSpeech(
          text,
          language
        );
    }

    /*
     * ---------------------------------------------------------------
     * 14. RETURN RESPONSE
     * ---------------------------------------------------------------
     */

    return NextResponse.json(
      {
        text,

        language,

        /*
         * null means voice was not requested,
         * not configured, or generation failed.
         */

        audioBase64,

        voiceAvailable:
          audioBase64 !== null,
      },
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    /*
     * ---------------------------------------------------------------
     * 15. ERROR HANDLING
     * ---------------------------------------------------------------
     */

    console.error(
      "================================================"
    );

    console.error(
      "[TIDAL] Request failed:"
    );

    console.error(error);

    console.error(
      "================================================"
    );

    let details =
      "Unknown error occurred while contacting TIDAL AI.";

    if (error instanceof Error) {
      details = error.message;
    }

    return NextResponse.json(
      {
        error: "TIDAL AI request failed.",
        details,
      },
      {
        status: 500,
      }
    );
  }
}