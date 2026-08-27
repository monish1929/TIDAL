# TIDAL — Complete Project Overview
**Marine EcOsystem Reasoning with Collaborative Agents**
*Reference document for AI coding agents / developers building this prototype.*

---

## 1. What This Project Is

TIDAL is a submission for **Smart India Hackathon 2026, Problem Statement 26176**, issued by ISRO (Department of Space). The problem statement asks for an **Agentic AI-powered conversational platform** that lets marine stakeholders — fishermen, researchers, coastal authorities, disaster management agencies, and maritime operators — access, analyze, and reason over marine data (satellite Earth Observation, weather, oceanographic data) in natural language, and receive explainable, evidence-based recommendations.

**Note:** The full direction below is still being finalized by the team. This document reflects the current agreed thinking and should be treated as the working reference to build the prototype against, not a frozen spec.

---

## 2. Core Framing — What TIDAL Actually Is

TIDAL is **not a chatbot** and **not a static data dashboard**. It is framed as a **marine decision copilot**:

> TIDAL turns heterogeneous, uncertain marine evidence (satellite data, weather forecasts, advisories) into explainable, multi-stakeholder decisions — under uncertainty — through a conversational, agentic interface. It does not just answer questions; it treats each significant interaction as a decision problem, reasons about it, explains itself, and revalidates its answer as conditions change.

This is the single sentence to keep in mind when building anything for this project — every feature should trace back to this framing.

---

## 3. Why This Direction Was Chosen (The Gap Being Solved)

India already has strong marine data infrastructure — INCOIS (PFZ advisories, Ocean State Forecasts, SVAS boat safety index), IMD (cyclone/lightning/weather warnings), and ISRO's DAT-SG distress alert network. **The raw data and alerts already exist.**

The real, unsolved gap is:
- Data and advisories are **fragmented** across separate systems/apps
- Users must **manually integrate** multiple sources into one decision (e.g., combining wave height + wind + cyclone alerts into "should I go fishing?")
- Existing systems give **static, one-shot answers**, not ongoing, adaptive decision support
- There is no **explainable reasoning** behind recommendations — no "why," no "what if," no confidence level
- No system currently supports **route optimization** or genuine **conversational, multi-turn** interaction, especially in regional languages

TIDAL's value is in **synthesis and reasoning**, not new data collection.

---

## 4. Target Users (Stakeholders)

The problem statement explicitly says stakeholders include (non-exhaustive — "such as"):
1. **Fishermen** — safety of venturing to sea, PFZ location, route safety, boundary/geofencing risk
2. **Researchers** — trend analysis, causal explanations (e.g., "why did productivity decline"), exportable data
3. **Coastal Authorities** — jurisdiction-wide hazard/zone monitoring, boundary violation tracking, briefings
4. **Disaster Management Agencies** — active hazard tracking, exposure assessment, multilingual alert drafting
5. **Maritime Operators** — route optimization, compliance/geofencing checks

**Architecture decision:** TIDAL does **not** use separate logins or separate dashboards per user type. It is a **single common platform**. Role is just an attribute on the user's profile (`user.role`), used only to set a default view/focus — the underlying agents and data pipeline are identical for every user. Any user who doesn't fit these five categories gets a general-purpose fallback experience with full chat access but no specialized default view.

---

## 5. High-Level Architecture — Two Layers

### 5.1 Closed-Loop Decision Intelligence Core (the "brain")
Follows a repeating decision lifecycle:
> Marine world state → causal/probabilistic reasoning → counterfactual & robust action evaluation → decision-critical uncertainty & adaptive evidence → multi-stakeholder action selection → autonomy governance → continuous decision revalidation.

### 5.2 Conversational Orchestration & UX Layer (the "face")
Sits above the core:
- Natural language understanding (intent, entities: location, time, vessel type)
- Multi-turn dialogue, scenario refinement ("what if I leave later?")
- Explainable natural language generation + maps/charts, tailored by role
- Multilingual support, with emphasis on Indian regional languages

Agents are the implementation mechanism connecting both layers — they are plumbing, not the core novelty itself.

---

## 6. The 8 Pillars

| # | Pillar | Plain meaning |
|---|---|---|
| 1 | **Multi-Stakeholder Decision Core** | When a decision affects multiple groups differently (e.g., a fishing restriction), explicitly show trade-offs between them rather than silently picking one answer. |
| 2 | **Marine World State & Causal-Probabilistic Model** | Store every data point as a "belief": value + confidence + source + timestamp. Encode simple cause-effect relationships (e.g., low chlorophyll + high SST → lower productivity likelihood) so TIDAL can answer "why," not just "what." |
| 3 | **Counterfactual & Robust Decision Engine** | For key decisions, generate 2-3 alternative plans, estimate outcomes for each, and recommend the option that stays safe/good even if the forecast is somewhat wrong — not just the single highest-scoring option. |
| 4 | **Decision-Critical Uncertainty & Adaptive Evidence** | Identify which uncertain variable could actually flip the decision, and prioritize refreshing/acquiring better data only for that variable. |
| 5 | **Explainable Reasoning Layer** | Every recommendation must include: why (causal), what-if (counterfactual), what mattered most (sensitivity), who's affected (stakeholder impact), how confident, and when to recheck. |
| 6 | **TRiSM-Style Decision Autonomy Governor** | Every decision type is tagged low/medium/high risk. Low risk → system acts autonomously. High risk (e.g., sector-wide advisories) → requires human approval before being issued. |
| 7 | **Conversational Orchestration & UX** | The natural-language chat/voice interface, multi-turn, multilingual, tailored by role — described in Section 5.2. |
| 8 | **Agentic Execution Fabric** | The specialist AI agents that implement everything above (see Section 7). |

### Core novelties (what makes TIDAL different from a generic chatbot)
1. Multi-stakeholder, decision-centric framing (not one-user-at-a-time Q&A)
2. Causal-counterfactual, uncertainty-aware reasoning (not static rules or naive tool calls)
3. Explainable reasoning as a first-class, always-present layer
4. Risk-tiered autonomy governance tied to evidence and reversibility
5. A conversational interface tightly bound to the decision/reasoning core, not a bolted-on chatbot

---

## 7. Agent Roster (Agentic Execution Fabric)

- **Planning Agent** — decomposes user intent into decision templates/tasks; routes queries
- **Marine Data Discovery Agent** — fetches PFZ, OSF, IMD bulletins, GIS layers, EO products
- **Ocean Analytics Agent** — time-series analysis, trend detection, risk scoring
- **Geospatial Reasoning Agent** — spatial queries, routes, zone/boundary overlays, geofencing
- **Risk Assessment Agent** — evaluates hazard conditions, assigns risk tiers
- **Visualization/Reporting Agent** — generates maps, charts, structured explanations
- **User Interaction Agent** — manages conversational flow, entity resolution, context, multilingual NLG
- **Guardian/Critic Agent** — checks outputs against the autonomy governor's rules before they're presented as final

---

## 8. MVP Scope Decisions (What to Actually Build)

### Flagship decision templates (build these fully, end-to-end — do not spread effort across more)
1. "Is it safe to venture tomorrow morning?" *(highest priority — build this completely first)*
2. "What is the safest route?"
3. "Why has productivity declined in this region?"
4. "Which zones should I avoid?" (geofencing/boundary)

### Build in full (Tier 1 — cheap, foundational, start immediately):
- Belief-style data wrapping: every fetched data point stored as `{value, confidence, source, timestamp}`
- Standard explanation template (why / what-if / sensitivity / confidence / recheck-time) applied consistently to every output
- Risk-tier lookup table + a "pending approval" UI state for high-risk decision types

### Build simplified (Tier 2 — moderate effort):
- 2-3 hardcoded causal rules (not a general causal engine)
- Counterfactual comparison limited to fixed scenario options (e.g., 2-3 departure time windows) with a small forecast-error margin — not full trajectory simulation
- Decision-critical flagging via simple threshold-proximity rules — not formal Value-of-Information math

### Build last, minimal version only (Tier 3):
- Multi-stakeholder trade-off scoring — attempt for **one** scenario only, using simple numeric scores, not formal MCDA (AHP/PROMETHEE) methods
- Full multi-agent orchestration polish

### Explicitly simulated / clearly labeled as such (do not claim as real/live):
- Vessel/at-sea activity positions (no public AIS data for small Indian fishing boats)
- Real-time distribution of alerts (TIDAL drafts alerts; it does not claim to send them via SMS/radio)
- Cyclone impact-zone estimation beyond a simplified overlay (full meteorological forecast-cone modeling is out of scope)

---

## 9. Platform Structure (Pages/Screens)

### 9.1 Login / Sign-Up Page
- Fields: name, email or phone number, password (plain password login — **no OTP** for MVP; OTP is a good future addition but requires third-party SMS gateway integration, out of scope for now)
- Language selector present on this page, before login/signup completes
- Routing: new user → Preference Page; returning user (role already set) → Main Dashboard directly

### 9.2 Preference / Role Selection Page
Shown once, only for new users. Sets `user.role`, `user.role_details`, `user.language_preference`.

- **Q1 (required, single-select):** Fisherman / Researcher / Coastal Authority / Disaster Management Agency / Maritime Operator / **Other-General User** (fallback, required option)
- **Q2 (conditional on Q1):** role-specific follow-up (e.g., fisherman → boat size, home harbour, fishing range; researcher → area of interest, output depth preference; coastal authority → jurisdiction; disaster management → district; maritime operator → vessel type, route range; general user → skipped)
- **Q3:** confirm/select language preference
- Must remain editable later via account settings (not required for MVP, but don't architecturally block it)

### 9.3 Main Dashboard
**Not yet finalized.** Known requirements:
- A main chat/query input, always present regardless of role
- A "Research" mode — **not a separate dashboard**, just a deeper-analysis mode/toggle available to every user for historical, comparative, or aggregated queries (e.g., "summarize this week's alerts," "compare this month to last year")
- A role-influenced "default view" area showing relevant at-a-glance info (e.g., fisherman sees safety status + nearest PFZ by default; coastal authority sees jurisdiction map + active alerts by default) — same underlying components, different default focus per role, not structurally different pages
- Open questions still to be resolved before building this screen: chat-first vs. widget-first interaction model; whether the default view persists permanently or only shows once per session; the screen ratio between chat and persistent widgets

---

## 10. Query Handling Model (Common Platform Logic)

Every query, regardless of who asks it, goes through the same pipeline:

1. **Planning Agent classifies the request type:**
   - Instant Answer (one-shot factual question)
   - Analytical/Research task (needs historical data, correlation, aggregation → routed to Research mode)
   - Action task (needs to generate something usable: a route, a report, a drafted alert)
   - Standing/monitoring task (needs to persist and proactively notify later)

2. **Region/scope resolution:** if the query references a named district/coastline rather than a single point (common for Coastal Authority and Disaster Management queries), the Planning Agent resolves it into an actual geographic boundary before specialist agents act on it. This is a shared, foundational capability, not role-specific logic.

3. **Specialist agents execute** (Weather, Ocean Analytics, Geospatial, Risk, etc.), each returning belief-style data (value + confidence + source + timestamp).

4. **Explanation layer formats the output** using the standard template (why / what-if / sensitivity / confidence / recheck-time) before it reaches the user.

5. **Autonomy governor checks the risk tier** of the decision — low/medium risk outputs are shown directly; high-risk outputs (e.g., sector-wide advisories) are flagged as requiring human approval.

**Note on data disagreement:** if two data sources conflict for the same query, TIDAL should surface both values with their sources rather than silently choosing one.

---

## 11. Visual Design System

The interface should feel like a **professional enterprise SaaS + marine intelligence + modern AI decision support** product — explicitly **not** a chatbot-looking app, gaming UI, or futuristic sci-fi control room.

### Typography
- Font: **Inter** throughout (Regular 400 for body, Medium 500 for labels, SemiBold 600 for titles/headings, Bold 700 only for major headings/key metrics)
- Hierarchy: page heading 24–28px/600, section heading 16–18px/600, card title 14–16px/600, body 13–14px/400, secondary text 12–13px/400, metadata 11–12px/400–500, key numeric values 20–28px/600–700

### Color system
- Background: very light cool gray, ~#F7F8FA
- Surfaces: white, #FFFFFF
- Primary text: dark charcoal, ~#1F2937
- Secondary text: muted gray, ~#6B7280
- Borders: subtle light gray, ~#E5E7EB
- Primary accent: professional marine blue, ~#2563EB (used for primary actions, active nav, selected states, links — not saturating the whole UI)
- Status colors (soft pastel background + darker text, never used alone without a label/icon):
  - Green = safe/healthy/positive
  - Amber = caution/moderate risk
  - Red = critical hazard only
  - Purple = sparingly, for AI-generated insights/analytical layers

### Layout
- Structured workspace: strong grid alignment, generous but controlled whitespace, modular cards, subtle borders, rounded corners, compact but readable density
- Avoid: huge hero sections, gradients, glassmorphism, heavy shadows, neon colors, excessive animation, bubble-style UI, sci-fi HUD aesthetics

### Navigation
- Clean vertical sidebar: TIDAL brand at top, simple line icons, grouped sections, profile/settings near bottom
- Inactive: muted gray icon + muted dark-gray text
- Active: subtle light-blue background, blue icon, blue/dark text, slightly stronger weight

### Cards
- White surface, 10–14px radius, 1px subtle gray border, very soft shadow only if needed, consistent padding, clear header, optional top-right action menu
- Use cards only to group genuinely related information — not one card per tiny data point

### Buttons
- Primary: blue background, white text, 8–10px radius, medium/semibold text, compact height
- Secondary: white/light gray background, subtle border, dark text
- Tertiary: minimal/no background, muted text, icon where useful
- Avoid oversized pill buttons unless the action specifically benefits

### Inputs
- White background, light gray border, 8–10px radius, clear placeholder, small icon where relevant, blue focus state
- Search should feel like professional workspace search, not a chatbot input box

### Icons
- Consistent line-icon system (e.g., Lucide Icons), simple, thin/medium stroke, functional not decorative — never mix icon styles, no colorful 3D icons

### Data visualization
- Minimal gridlines, subtle axes, clean typography, limited colors, semantic colors only when meaningful
- Must be able to cleanly represent: wave conditions, wind, marine risk, PFZ information, forecast trends, decision confidence, sensitivity, alternative scenarios

### Maps
- Light, clean base map, soft neutral tones, clear blue water, clearly distinguishable hazard zones, geofence/restriction overlays, PFZ markers, vessel/route markers
- Marine intelligence content should be visually prioritized over generic geographic detail

### Risk visualization
- Restrained semantic hierarchy: Green = safe, Amber = caution, Red = critical only, Blue = information/system intelligence, Purple sparingly for AI insight
- Never rely on color alone — always pair with labels, icons, numbers, and text explanation

### AI / TIDAL intelligence presentation
- No giant glowing "AI" section or chatbot aesthetic
- Represent intelligence through structured, named elements: "TIDAL Insight," "Decision Analysis," "Why this recommendation?," "Confidence," "Key drivers," "What-if," "Critical uncertainty," "Recommended action"
- AI outputs should read as structured decision intelligence, not casual chat messages

### Conversation UI
- Same SaaS visual language as the rest of the app — no huge chat bubbles, cartoon avatars, excessive gradients, typing animations, or generic ChatGPT-clone styling
- TIDAL responses should be capable of showing structured blocks: Recommendation, Risk level, Confidence, Key evidence, Why TIDAL recommends it, Alternative scenarios, Uncertainty, Validity period
- Chat coexists naturally alongside maps, charts, and decision panels — not as an isolated chat window

### Spacing & radius
- Spacing scale: 4 / 8 / 12 / 16 / 20 / 24 / 32px
- Radius: inputs/buttons 8–10px, cards 10–14px, large containers 14–16px — avoid extreme rounding

### Shadows
- Use very sparingly — near-flat interface; visual separation should come from background contrast, borders, spacing, and typography rather than heavy shadows

### Responsive behavior
- Desktop: sidebar nav, multi-column layout, maps + decision panels + analytical cards side by side
- Tablet: condensed nav, reduced card density, flexible grid
- Mobile: bottom/compact nav, stacked full-width cards, map-first interactions where relevant, large touch targets, simplified hierarchy

### Brand personality
Intelligence, safety, reliability, awareness, precision, calmness, environmental context, human-centered decision support — trustworthy enough that a fisherman, maritime operator, coastal authority official, or researcher would rely on it for an important real decision.

---

## 12. Known Open Questions (Not Yet Resolved — Flag If Encountered)

1. Is the causal/probabilistic model (Pillar 2) being built as hardcoded rules or a more formal model? *(Currently assumed: hardcoded rules for MVP.)*
2. Which exact data sources/APIs will be used for PFZ, weather, wave, chlorophyll, SST — and has real access been confirmed?
3. Is historical time-series data available from chosen sources, or only current/live snapshots? *(Affects the "why did productivity decline" flagship question directly.)*
4. Main Dashboard interaction model: chat-first (components appear inline in conversation) vs. widget-first (persistent dashboard with a chat panel)?
5. **Frontend stack — CONFIRMED:**
   - Next.js (routing + API routes)
   - TypeScript (type safety for belief-style data objects passed between agents/components)
   - Tailwind CSS (implements the design system's spacing/color/radius tokens directly)
   - shadcn/ui (component library matching the SaaS aesthetic)
   - Lucide React (icon system, per design doc requirement)
   - MapLibre GL JS (maps — open-source, no API key dependency)
   - Recharts / ECharts (charts — Recharts for simple views, ECharts for layered/multi-axis visualizations like forecast bands or sensitivity plots)
   - TanStack Query (data fetching/caching; also usable to implement the "recheck-time" / continuous revalidation behavior from Pillar 5 via stale-time and refetch)

   **Still open:** LLM provider/API, backend framework/language, and agent orchestration approach (e.g., LangChain, LangGraph, custom) — to be confirmed next.
6. Exact demo scenario (specific location, date, query sequence) for judge-facing presentation — not yet scripted.

---

## 12.5. Current Build Phase — Frontend Only

**Scope decision:** The immediate build phase covers **frontend only**. No live backend, no real agent orchestration, no live LLM calls yet.

**What this means in practice:**
- Build all screens fully (Login, Preference, Main Dashboard, chat interface, maps, decision/explanation cards) with real, working UI and interaction logic
- Replace live agent/data calls with **realistic mock data**, structured to exactly match the intended real-data shape:
  - Every data point mocked as a belief object: `{ value, confidence, source, timestamp }`
  - Every AI-generated response mocked as a full structured explanation block: `{ recommendation, riskLevel, confidence, keyEvidence, whyExplanation, alternativeScenarios, uncertainty, validityPeriod }`
- Mock data should live in clearly separated files/fixtures (not hardcoded inline in components), so replacing mocks with real API/agent calls later is a drop-in swap, not a rewrite
- The four flagship queries (trip safety, safest route, productivity decline, zone avoidance) should each have at least one realistic mock scenario fully fleshed out, so the UI can be demoed end-to-end even before any backend exists
- Risk-tier gating ("Pending Approval" state) and the Research mode toggle should be built as real, working UI states — just driven by mock data/flags rather than a live governor agent

**Why this approach is sound:** Since the entire platform's explanation and belief structures are already fully specified (Section 8, Pillar 2 and 5), designing the mock data to this same schema now means the backend team can plug in real agent output later without the frontend needing to change.

---

## 13. Summary for the Build Agent

Build a **common-platform, role-agnostic conversational marine decision-support tool.** Every user goes through the same login → preference (role) → dashboard flow. Every query goes through the same Planning Agent → specialist agents → explanation template → risk-gate pipeline, regardless of who asks it or what role they selected. Role only changes the default view shown and light personalization — never the underlying logic, agents, or data pipeline. Prioritize building the four flagship decision templates (trip safety, safest route, productivity decline explanation, zone avoidance) fully, using the Tier 1 → Tier 2 → Tier 3 build order in Section 8, before adding scope elsewhere. All visual design should follow the SaaS design system in Section 11 — calm, professional, evidence-driven, never chatbot- or sci-fi-styled.