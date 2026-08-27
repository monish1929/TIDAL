# ORCA — Master Product & End-to-End User Experience Document (Final)
### The Complete Finalized Idea, Application Flow, and Frontend Experience

**Status:** This is the frozen, definitive specification of what ORCA is and how a user experiences it, start to finish. It supersedes `ORCA-End-to-End-Flow-v1.md`. Someone with no other context should be able to read this document alone and understand exactly what the product is, what every screen contains, and how a user moves through it.

---

# Part A — Idea, Problem, and Approach (Condensed)

**The problem:** India's marine data ecosystem (PFZ advisories, ocean-state forecasts, IMD warnings, GIS boundaries) is real and valuable, but fragmented across one-way channels (SAMUDRA app, Sagar Vani SMS/voice, published bulletins). Users must mentally integrate multiple sources into a single decision, under real uncertainty, with no way to ask a follow-up question or see the reasoning behind an advisory. A real, chronic, high-stakes instance of this problem — inadvertent India–Sri Lanka maritime boundary (IMBL) crossings in the Palk Strait — remains unsolved by any existing conversational system.

**The approach:** ORCA is an evidence-grounded, multi-agent marine safety and intelligence copilot. It treats every marine query as a decision under uncertainty, never hides that uncertainty or its sources, reasons visibly rather than as a black box, and is built around solving the IMBL safety problem as its flagship demonstration — inside a single unified platform that also serves trip safety, hazard alerting, routing, and productivity analysis for five stakeholder categories: Fishermen, Coastal Authorities, Maritime Operators, Researchers, and a Universal/unassigned category.

**Full pillar-by-pillar rationale, novelties, and architectural detail:** `ORCA-Master-Reference-v3-Final.md`. This document does not repeat that reasoning — it specifies the experience built on top of it.

---

# Part B — Complete End-to-End User Flow

## B.1 The Single Chat Shell (Foundational Rule)

Before anything else: **there is exactly one chat interface in the entire application.** It is not duplicated per page and does not have a "universal version" and a "specialized version" as separate components. The same chat shell appears:

- As the entire content of the Universal landing screen, and
- As a persistent panel (or one-click expandable panel) on every single page of every role, pre-biased toward that page's workflow but never restricted to it.

A query on any page that falls outside that page's specific focus is simply answered by the same shell using the general intent router — tagged inline as "answered by the general assistant" — never a handoff, never a second interface, never a navigation event. This single rule is what keeps five stakeholder experiences feeling like one coherent platform rather than five skins.

## B.2 Entry — Before Any Role Is Chosen

A first-time visitor lands on the **Universal screen**: the chat shell, front and center, with an ambient map behind it showing today's general coastal hazard conditions — useful before anyone types anything. A role selector is visible but never mandatory ("I'm a... Fisherman / Coastal Authority / Maritime Operator / Researcher"). No login wall exists at this stage.

**What a Universal user can do:** ask any informational question (conditions, hazards, PFZ zones, boundary proximity for a stated location) and get a full, real answer — map, explanation, and a **Safety Card** artifact if the query is safety-related — with zero friction. Universal sessions can also save a lightweight anonymous token that persists a bookmarked query or a saved alert, without ever requiring role selection.

**What a Universal user cannot do:** anything requiring personal/vessel context (a personalized trip plan) or any write-action (issuing an advisory, committing a route). Asking for one of these doesn't fail silently or attempt the action — the chat explains plainly what's needed ("this needs a Fisher profile — want me to set that up?") and offers the one-step path into role emergence.

## B.3 Role Emergence

The moment a query needs personalization or an action, ORCA asks — conversationally, inline in the same chat, never a form page — for exactly what's decision-critical:

- **Fisher:** harbour + vessel type/size, asked once, kept for the session.
- **Authority:** jurisdiction/sector, plus an access-code gate (a stand-in, stated plainly, for real institutional verification in production) — this exists specifically because an unguarded Authority role could issue a fake advisory that broadcasts to Fishers, which would break the platform's most important cross-role demo moment.
- **Operator:** vessel class + typical routes.
- **Researcher:** region/topic of current interest.

Once set, role and context persist as a visible badge, and a **role switcher** (see B.7) becomes available. Setting a role navigates the user from the Universal screen to that role's **Home page** — the first of that role's dedicated pages.

## B.4 Persistent Navigation (Present on Every Role's Pages)

Every role has a persistent navigation element (sidebar or top bar) listing exactly that role's pages — three per role, named below — plus the role switcher and the always-present chat shell. **The chat is never something a user has to leave a page to reach** — it is either permanently visible or a single click away, identically, everywhere.

## B.5 Fisher — Pages, Contents, and Actions

**Page 1 — Home (Trip Safety Dashboard).** Contents: today/tomorrow safety indicator for the Fisher's home harbour, a compact hazard summary, and — for a returning user — the **most recent still-valid decision**, prominently surfaced rather than a blank screen (this is the closed-loop revalidation novelty made visible, not just true in the backend). What the user can do: ask any quick question via the chat shell (e.g., "what's the catch outlook today"), or navigate to Voyage Planner for a full trip decision.

**Page 2 — Voyage Planner.** Contents: the full Trip Safety + PFZ + Route workflow — candidate plans, a map with route/PFZ/hazard overlays, and the **Simulate Voyage** control that drives the IMBL flagship demonstration (see Part C.2). What the user can do: run a full trip-safety query, ask follow-ups ("what if I leave later," "compare with route B" — see B.8 for how composite answers render), simulate a voyage to test IMBL/geofence proximity alerting, and generate a **Voyage Plan** artifact. What happens next: the generated plan appears on Home as the "most recent decision" on the next visit, and continues to be checked for validity in the background — a card proactively appears here or in-chat if conditions change before departure.

**Page 3 — Alerts & Safety.** Contents: subscribed hazard alerts, the standalone IMBL/geofence proximity monitor (independent of any specific voyage query), and a history of past **Safety Card** artifacts. What the user can do: subscribe to or unsubscribe from alert types, review past alerts, and re-run a proximity check for a hypothetical position.

## B.6 Authority — Pages, Contents, and Actions

**Page 1 — Home (Sector Hazard Dashboard).** Contents: a sector-wide hazard heatmap, current advisory status, and the most recent still-valid decision for this Authority's jurisdiction. What the user can do: ask the chat for a current risk read on any part of their sector.

**Page 2 — Advisory Workspace.** Contents: the sector advisory decision workflow, the MCDA tradeoff sliders (safety / economic impact / compliance — adjustable, explicitly labeled as configurable defaults, not derived truth), and the approval control. What the user can do: request a proposed advisory, review the tradeoff breakdown and full explanation, and Approve or Deny (a high-risk action, gated by the TRiSM governor — see Part D.1). **What happens next, and this is the platform's single strongest moment:** on approval, the advisory becomes a public state visible to any Fisher whose sector overlaps it — the Simulated Action Bus fires and the Fisher-side experience reflects it on their next relevant query or as a proactive alert, closing the loop across two different roles, live.

**Page 3 — Compliance & Monitoring.** Contents: aggregate vessel-class risk data and geofence compliance statistics for the sector, with a minimum-N threshold enforced before any statistic is displayed (below that threshold, data is withheld or shown at coarser spatial resolution, to prevent an "aggregate" from effectively identifying an individual vessel in a sparsely-fished area). What the user can do: review compliance trends and past incidents; this page is read/monitor-only, no write-actions live here.

## B.7 Operator — Pages, Contents, and Actions

**Page 1 — Home (Fleet Dashboard).** Contents: fleet-wide hazard monitoring and the most recent route decisions for this Operator's fleet. What the user can do: ask the chat about current conditions along any planned or habitual route.

**Page 2 — Route Planner.** Contents: the Route Optimization workflow — origin/destination, vessel specs, a safety-vs-time/fuel constraint slider, and a route-comparison map/table. What the user can do: request and compare candidate routes, commit to one (a genuinely authorized, medium-risk action, auto-approved and logged), and generate a **Route Dossier** artifact. What happens next: a committed route is monitored, and the user is proactively notified if sea state changes materially before departure.

**Page 3 — Fleet Compliance & Analytics.** Contents: fleet-wide geofence compliance status and historical route analytics. What the user can do: review past routes and compliance history; read-only, no write-actions here.

## B.8 Researcher — Pages, Contents, and Actions

**Page 1 — Home (Analysis Workbench).** Contents: a region/time-period selector and ambient historical trend charts. What the user can do: ask an open-ended exploratory question via the chat shell.

**Page 2 — Productivity Explorer.** Contents: the Productivity Decline Analysis workflow — causal-hypothesis narrative (with every relationship explicitly labeled by evidential status, never overclaiming causality), charts, and a sensitivity breakdown. What the user can do: run the analysis for a chosen region/period, ask follow-ups, and generate a **Research Brief** artifact.

**Page 3 — Reports & Comparisons.** Contents: saved reports and a cross-region comparison tool. What the user can do: export prior reports and run side-by-side regional comparisons; read/export-only.

## B.9 Role Switching (Mid-Session, Not a Restart)

A role switcher lives in the persistent navigation on every page. Switching roles navigates the user to the new role's Home page and re-scopes the chat shell's default bias — it does **not** touch artifacts, decisions, or history created under the previous role, which remain scoped to that role's identity. A user genuinely wearing two hats (e.g., an Operator who also wants the Researcher view) can switch freely without any data leaking between the two personas.

## B.10 Composite Queries

A query spanning more than one workflow — the PS's own example, "is it safe tomorrow, and where should I go" (Trip Safety + PFZ/Route at once) — renders as **one merged response**: one map showing both the safety verdict and the recommended zone together, one EvidencePanel covering both parts of the reasoning, one artifact if applicable. Never two competing cards for what is, to the user, a single question. Where a composite response would touch data at two different permission scopes, the merged response is always scoped to the **minimum** of the two — never elevated to the higher one.

## B.11 Failure and Edge States (Specified, Not Left Implicit)

- **Permission denied:** the chat explains plainly what role/access is required and offers the path to it — never a silent failure or a blocked attempt with no explanation.
- **Data outage with no cached fallback:** a clearly labeled "data temporarily unavailable" state, showing a last-known-good timestamp if one exists. Never a blank screen, and never an answer that looks confident but is built on nothing.
- **Returning user:** every role's Home page surfaces the most recent still-valid decision prominently, rather than defaulting to blank — making closed-loop revalidation something the user actually sees, not just a backend property.

---

# Part C — The Output & Artifact System

## C.1 Response Component Library

Every response is a structured object; text is always accompanied by at least one other component — a text-only response is structurally impossible, not just discouraged. Which components render for a given query is decided by a fixed rule table (query type → component set), never improvised by the LLM per response — the same "LLM proposes language, never structure" discipline used everywhere else in this project.

| Component | What it shows | Typical trigger |
|---|---|---|
| **AlertCard** | Compact, severity-color-coded safety verdict | Trip safety, hazard, IMBL proximity |
| **MapView** | Routes, PFZ zones, hazard overlays, geofence boundaries | Any spatially-grounded query |
| **EvidencePanel** | The reasoning trace — sources, confidence, "go deeper" content | Every response, always available |
| **TimelineRoadmap** | Step-by-step voyage or multi-day plan | Voyage planning |
| **AnalyticsPanel** | Trend charts, sensitivity bars | Researcher queries |
| **ComparisonTable** | Plan A vs. B, route A vs. B | Any comparative follow-up |
| **ActionCard** | A decision with real buttons — approve, subscribe, commit | Any actionable decision |
| **ArtifactExport** | The generated document itself, downloadable | Whenever an artifact is produced |

## C.2 Artifact Types — What Each Contains and Who Can Generate It

| Artifact | Contents | Generated by | Availability |
|---|---|---|---|
| **Safety Card** | Compact alert-style: boundary/hazard distance, escalation level, at-a-glance verdict | Fisher, and **Universal** (purely informational, no personal context required) | Anyone |
| **Voyage Plan** | Departure checklist, route map, timing, safety thresholds, contingency guidance | Fisher | Requires Fisher session context |
| **Advisory Packet** | The decision, supporting evidence, tradeoff record, formatted close to a real bulletin | Authority | Requires Authority session |
| **Route Dossier** | Turn-by-turn waypoints, flagged risk zones, fuel/time budget | Operator | Requires Operator session |
| **Research Brief** | Structured, citation-backed, confidence-graded findings | Researcher | Requires Researcher session |

**Every exported artifact carries a stated validity window and a QR code/short link back to a live recheck of that exact decision** — this is what preserves the closed-loop-revalidation guarantee even once an artifact leaves the live session (printed and taken to sea, for instance), rather than silently becoming a stale, unverifiable document the moment it's exported.

## C.3 The "Go Deeper" Control

A single, consistently-placed control on every individual response, available to every role including Universal, surfacing the same content the reasoning trace already produces: which agents ran, what evidence was used, confidence levels, counterfactual comparisons, and sensitivity analysis. Requesting this on an older message always re-checks staleness first and flags explicitly if the underlying world has moved since the message was sent — never showing deep reasoning against silently-outdated data.

---

# Part D — Cross-Cutting Rules, As a User Experiences Them

## D.1 What Each Role Can See and Do (Plain-Language RBAC)

- **Universal:** sees public hazard/PFZ/boundary data for anywhere; can generate a Safety Card; cannot access personalized or write actions.
- **Fisher:** sees everything Universal sees, plus their own vessel/trip context; can generate a Voyage Plan, set personal alerts, run IMBL checks; cannot see other users' data or issue any platform-wide action.
- **Authority:** sees everything Universal sees, plus sector-wide aggregate data (min-N protected); can configure thresholds and issue advisories, gated by risk tier; cannot see an individual Fisher's personal trip history.
- **Operator:** sees everything Universal sees, plus their own fleet's routes/history; can commit routes for their own fleet; cannot issue public advisories or see other operators' fleets.
- **Researcher:** sees everything Universal sees, plus historical/aggregate datasets; can export reports; cannot trigger any operational action — this role is read-and-analyze only, by design.

**Important clarification, stated once here because a sharp observer will ask:** role equality in this platform means equal quality of service and equal transparency (every role, including Universal, gets the full reasoning trace on request) — it does not mean equal write-authority. An Authority's exclusive right to issue a sector advisory doesn't imply other roles matter less, any more than a fire department's exclusive authority to order an evacuation implies residents don't matter.

## D.2 Autonomy, As Experienced

Any action that only affects the person asking — a personal trip recommendation, a personal alert, a route suggestion — happens automatically. The only actions requiring a human's explicit approval are ones that would affect people who didn't ask (a sector-wide advisory). This is a genuinely aggressive autonomy posture with one narrow, clearly justified exception, not a broadly cautious system.

## D.3 What's Actually Built for the Regional Round (Stated Honestly)

Per the agreed scope commitment (push for all three tiers, with the midpoint checkpoint discipline as the safeguard):

- **Demo-critical, must work flawlessly:** the IMBL flagship in full (hard-block routing + standalone proximity alert + Simulate Voyage), the visible reasoning trace, one artifact generated live (Voyage Plan), the corrected RBAC/access-code gate, TRiSM autonomy shown live, Universal zero-login entry, the Fisher and Authority page sets in full, and the AlertCard/MapView/EvidencePanel components.
- **Built if time allows:** the Operator and Researcher page sets, the remaining artifact types and response components, composite-query merging, role switching, and the QR-live-recheck mechanism.
- **Documented, not built for this round:** the remaining lighter workflows beyond each role's flagships, full MCDA slider configurability (a fixed version ships instead), multi-day itineraries, and the full agent-level least-privilege enforcement plumbing (the demo shows its effect, not its infrastructure).

This document describes the complete, intended product. Which parts are live in front of judges at the regional round versus present as documented depth is governed by this tiering — not a discrepancy, a stated boundary.
