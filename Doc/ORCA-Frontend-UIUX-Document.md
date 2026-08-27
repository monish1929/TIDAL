# ORCA — Frontend, UI/UX & Application Flow Document
### The Complete Frontend and Application Experience

**Status:** This is a dedicated companion to `ORCA-Master-UX-Document-Final.md`. That document defines what each screen's purpose is and what workflows live where; this document defines what everything looks like, how it's laid out, and how it behaves. Every section below assumes the reader already knows a page's *purpose* and focuses only on its *presentation*. Two rendered mockups accompany this document: `orca-voyage-planner-mockup.html` and `orca-imbl-alert-mockup.html`, for the two highest-stakes screens.

---

## 1. Design System Foundations

**Design direction:** ORCA is a safety instrument, not a consumer app — the visual language is drawn from actual nautical chart conventions (depth soundings, chart-paper tones, hazard hatching, boundary line conventions) rather than generic dashboard aesthetics. This is a deliberate choice: a fishing-safety tool that looks like a trading dashboard undersells its own stakes.

**Color system (named tokens, used consistently everywhere):**

| Token | Hex | Use |
|---|---|---|
| `--deep` | `#0B2E4A` | Primary chrome — top bar, nav, dark panels |
| `--chart` | `#1B4965` | Secondary — routes, chat bubbles, structural accents |
| `--shallow` | `#5FA8D3` | Safe/informational accent — PFZ zones, confidence indicators |
| `--land` | `#E8DFC8` | Chart-paper tone — land masses, light backgrounds |
| `--hazard` | `#C1272D` | Critical alerts, boundary lines, danger markers |
| `--signal` | `#F2A93B` | Caution-tier alerts, medium-risk indicators |
| `--ink` | `#16222A` | Body text |

**Typography:** `Space Grotesk` for headers and labels (technical, distinctive character, used with restraint), `IBM Plex Sans` for body text, `IBM Plex Mono` for anything data-like — coordinates, timestamps, confidence values, the reasoning trace. This last choice is deliberate: rendering evidence and reasoning in a monospace, instrument-readout typeface reinforces the "real data, not a guess" claim typographically, not just verbally.

**Iconography:** simple line icons (stroke-based, not filled), nautical where it fits naturally (a compass-adjacent mark, a vessel triangle for position) rather than generic dashboard iconography.

**Severity encoding, used identically everywhere:** amber (`--signal`) = caution/medium, red (`--hazard`) = critical, and this mapping never changes meaning between screens or roles — an amber marker means the same thing on the Fisher's map as it does on the Authority's compliance dashboard.

---

## 2. The Global UI Shell

Present, pixel-identical in structure, on every single screen:

- **Top bar** (56px, `--deep` background): the ORCA wordmark, a language toggle (EN / Tamil for the demo), and the role badge on the right — showing the current role and context (e.g., "FISHER · Nagapattinam").
- **Left navigation rail** (76px, `--deep`): icon-plus-label items for that role's pages (3 per role), the active page highlighted with a `--chart` background fill. The role switcher lives here too, as an additional item.
- **The chat shell:** docked as a right-side panel (380px wide) on desktop, always visible — never a floating bubble that has to be summoned, never a separate route. This is the single most important shell decision: the chat is not a *feature* of a page, it's a permanent *pane* alongside whatever page is active.
- **Main content pane:** everything specific to the current page — the map, the dashboard, the analytics view.

This exact three-column structure (nav / main content / chat) repeats on all thirteen screens. What changes between roles is never the shell — only the main pane's content and the chat's default bias.

---

## 3. Screen-by-Screen Layout Specification

For each of the thirteen screens, main-pane layout only (shell is constant, per §2):

**Universal Landing:** no nav rail (pre-role), the chat shell takes visual priority, centered, with an ambient hazard-overview map behind/around it at reduced opacity — inviting a first query without demanding one.

**Fisher — Home:** top strip = today/tomorrow safety indicator (large, color-coded). Below: the most recent still-valid decision, shown as a compact recap card if one exists, otherwise an empty state inviting a first query.

**Fisher — Voyage Planner:** map-dominant (roughly 60% of the main pane), chart-styled with route overlay, PFZ zone, and hazard markers; chat pane on the right carries the AlertCard, the reasoning trace, and the artifact card in sequence, top to bottom, matching the order a decision actually forms. *See `orca-voyage-planner-mockup.html` for the full rendered layout.*

**Fisher — Alerts & Safety:** a list view of subscribed alerts and past Safety Cards, with the standalone IMBL/geofence proximity monitor and the Simulate Voyage control at the top. *See `orca-imbl-alert-mockup.html` for the proximity-alert moment specifically.*

**Authority — Home:** sector hazard heatmap as the dominant visual, advisory-status strip above it.

**Authority — Advisory Desk:** the decision workflow on the left (tradeoff sliders, explanation), an Approve/Deny ActionCard docked at the bottom, always visible while scrolling the reasoning above it.

**Authority — Compliance:** a data-table-and-chart layout; aggregate statistics only, with a visible "aggregated, minimum sample size enforced" note wherever a threshold is actively suppressing a value.

**Operator — Home:** fleet map with all active/recent routes overlaid, hazard summary strip.

**Operator — Route Planner:** near-identical map-dominant layout to the Fisher Voyage Planner (same MapView component), with a ComparisonTable replacing the single AlertCard when two routes are being compared side by side.

**Operator — Fleet Status:** table-and-chart layout, same visual language as Authority Compliance.

**Researcher — Home:** analytics-dominant from the start — trend charts visible immediately, not behind a query.

**Researcher — Productivity Explorer:** AnalyticsPanel-dominant main pane, with the evidential-status labeling (empirical vs. hypothesized) visually distinct — hypothesized relationships rendered with a dashed/lighter treatment, never visually identical to empirical ones.

**Researcher — Reports & Comparisons:** a document-list layout, closer to a file browser than a dashboard.

---

## 4. Component Visual Anatomy

- **AlertCard:** white surface, 5px left border in the severity color, bold `Space Grotesk` verdict line, plain-language body text, a metadata row in `IBM Plex Mono` (confidence, validity window).
- **MapView:** chart-paper background, land rendered in `--land`, routes as dashed `--chart` lines, PFZ zones as soft `--shallow`-tinted irregular polygons (never a hard rectangle — real zones aren't rectangular and shouldn't look invented), hazard/boundary markers in `--hazard`.
- **EvidencePanel / Reasoning Trace:** dark (`--deep`) panel, styled as a ship's log — monospace, timestamped, one line per agent step, live-appending as steps complete. Collapsed by default on lower-stakes queries, expanded by default on the two flagship screens.
- **TimelineRoadmap:** a vertical stepped list, each step numbered and timestamped, used for multi-stage plans.
- **AnalyticsPanel:** chart-first, `IBM Plex Mono` axis labels, `--chart`/`--shallow` for data series, `--hazard` reserved exclusively for anomalies/risk — never used decoratively in a chart.
- **ComparisonTable:** two or three columns, differences between options highlighted, not just listed.
- **ActionCard:** the only component with real buttons — Approve/Deny, Subscribe, Commit — always in `Space Grotesk`, always naming the exact action ("Approve advisory," never "Submit").
- **ArtifactExport:** a bordered card with a document-type icon, filename-style metadata, and an Export button — visually distinct from all other cards so a user immediately recognizes "this is a thing I can keep."

---

## 5. Navigation & Page Relationships

*(See the rendered sitemap diagram above.)* Universal branches into four role hubs on role emergence; each hub contains its three pages; the chat shell sits beneath/alongside all of it as a constant, not a fifth branch — it's not a destination, it's always present regardless of which node you're on. Role switching (§ B.9 of the Master UX doc) is a lateral jump between hubs, not a return to Universal.

---

## 6. Interaction Patterns & Micro-states

- **Loading:** never a generic spinner. The reasoning trace itself *is* the loading state — "checking latest wave data…" appears as a live trace line, so waiting time doubles as transparency, not dead air.
- **The Simulate Voyage animation:** a vessel marker moves along a plotted path at accelerated time; as it crosses the 10nm ring, the ring's opacity increases and a caution-tier note appears in the trace; crossing the 5nm ring triggers the full critical alert banner and dispatch, exactly as shown in the IMBL mockup.
- **Empty states:** never blank. A first-time Voyage Planner visit shows a prompt ("Ask ORCA about tomorrow's trip") rather than an empty map.
- **Error/outage states:** the "data temporarily unavailable" treatment uses the same visual severity language as an AlertCard, at the amber tier, with the last-known-good timestamp shown in mono type.
- **Success confirmations:** an approved advisory or a committed route gets a brief, specific confirmation ("Advisory dispatched to Sector 4") — never a generic checkmark toast.

---

## 7. Voice & Multilingual UI Treatment

The mic control sits directly in the input bar (see the Voyage Planner mockup), a filled circle in `--chart` with a simple mic glyph; during active listening it pulses gently. Voice responses are read aloud through the same summarized text already shown in the AlertCard — no separate voice-only script. Tamil text renders through IBM Plex's multi-script support; layout accommodates variable string length (Tamil translations of English phrases can run meaningfully longer) by never fixed-width-truncating a response body.

---

## 8. Accessibility & Responsive Behavior

Web/desktop-primary per the platform decision, but not fixed-width-assumed: the three-column shell collapses to nav-rail-plus-content with the chat as a slide-over panel below roughly 1100px width, since a judge's laptop window is not guaranteed to be maximized. Baseline standards: visible keyboard focus states on every interactive element, sufficient contrast on all text against its background (checked against the palette in §1, not assumed), and no motion that can't be paused (the Simulate Voyage animation has a pause control).

---

## 9. The Complete App Flow, Visualized

Walking the demo script from the solution design document with the visual specifics above applied: a judge opens the Universal landing (chat-centered, ambient map, no chrome beyond the top bar) → asks a quick question, gets an AlertCard and MapView with zero role commitment → switches to Fisher, asks the full trip-safety query, watches the reasoning trace populate live in the dark ship's-log panel while the map renders the route → opens Simulate Voyage, watches the vessel approach the IMBL boundary, sees the ring escalate from amber to red and the critical banner fire, exactly as rendered in the mockup → switches to Authority, sees the sector dashboard, approves an advisory via the docked ActionCard → the loop closes back on the Fisher side. Every visual decision in this document exists to make that walk-through legible and consistent, screen to screen, without the underlying platform ever looking like five different products stitched together.
