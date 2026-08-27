import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

type ChatRequest = {
  query?: unknown;
  role?: unknown;
  language?: unknown;
  dashboardData?: unknown;
};

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Read request body
    const body = (await request.json()) as ChatRequest;

    // Validate query
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

    // Check Groq key
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        {
          error: "GROQ_API_KEY is not configured.",
        },
        { status: 500 }
      );
    }

    const query = body.query.trim();

    const role =
      typeof body.role === "string"
        ? body.role
        : "GENERAL";

    const language =
      typeof body.language === "string"
        ? body.language
        : "English";

    /*
     * Dashboard data will be supplied by the frontend.
     *
     * For now we safely convert whatever is received
     * into text so Groq can use it as context.
     */
    let dashboardContext = "No dashboard data was provided.";

    if (body.dashboardData !== undefined) {
      try {
        dashboardContext =
          typeof body.dashboardData === "string"
            ? body.dashboardData
            : JSON.stringify(body.dashboardData, null, 2);
      } catch {
        dashboardContext = "Dashboard data could not be read.";
      }
    }

    // System instructions
    const systemPrompt = `
You are TIDAL Copilot, a maritime decision-support assistant.

USER ROLE:
${role}

RESPONSE LANGUAGE:
${language}

IMPORTANT RULES:

1. Answer the user's question directly.
2. Use the dashboard data provided below whenever it is relevant.
3. Do not invent dashboard values.
4. Do not claim that simulated dashboard values are live data.
5. If the dashboard does not contain information needed to answer,
   clearly say that the information is not available.
6. Keep responses concise and useful for an operational dashboard.
7. Do not mention Groq, APIs, models, prompts, or implementation details.
8. You are assisting with a prototype, so dashboard values may be simulated.
9. Never present simulated information as real-time measurements.

CURRENT DASHBOARD DATA:
${dashboardContext}
`;

    console.log("[TIDAL] Query:", query);
    console.log("[TIDAL] Role:", role);

    // Call Groq
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      temperature: 0.2,
      max_tokens: 500,
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

    const text =
      completion.choices?.[0]?.message?.content?.trim() || "";

    if (!text) {
      return NextResponse.json(
        {
          error: "TIDAL received an empty response.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        text,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[TIDAL] Groq request failed:", error);

    let details = "Unknown error";

    if (error instanceof Error) {
      details = error.message;
    }

    return NextResponse.json(
      {
        error: "TIDAL AI request failed.",
        details,
      },
      { status: 500 }
    );
  }
}