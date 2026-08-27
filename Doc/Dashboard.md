# TIDAL — Dashboard Layout & Sidebar Navigation Spec

**Purpose of this document:** Define the Main Dashboard's structure — sidebar navigation, center workspace, and how role-gating works — resolving the open questions carried forward from the Login/Preference spec. This is the first concrete design for the Main Dashboard.

**Note on source material:** An external research document (marine dashboard sitemap, covering INCOIS/AOOS-style patterns) was reviewed as input. Where it conflicts with TIDAL's core architecture (common platform, agentic decision core, flagship-query MVP scope), this document overrides it. Useful patterns from that research have been incorporated below; conflicting patterns (per-role separate apps, role selection at login, out-of-scope pages like Vessel Tracker/Incident Dashboard) are explicitly excluded — see Section 6.

---

## 1. Resolving the Open Questions (from Login/Preference spec, Section 4)

| Open question | Resolution |
|---|---|
| Chat-first vs. widget-first interaction model? | **Hybrid.** Sidebar for navigation between focus areas; center workspace is agent/copilot-first (chat + structured decision cards); supporting panel available for map/chart detail. |
| Does the default view persist permanently, or once per session? | **Persists permanently** as the Home view's content, but is not a separate locked page — the user can always navigate elsewhere via the sidebar and return. |
| Screen ratio between chat and persistent widgets? | Center workspace (copilot) is the dominant area. Sidebar is narrow/fixed. A supporting detail panel is present but collapsible — see Section 3. |

---

## 2. Overall Layout Structure

```
┌───────────┬──────────────────────────────────────┬─────────────────┐
│           │              HEADER                  │                 │
│           ├──────────────────────────────────────┤                 │
│  SIDEBAR  │                                       │  SUPPORTING     │
│  (fixed,  │         CENTER WORKSPACE              │  PANEL          │
│  narrow)  │      (Copilot / Decision Cards)       │  (map/chart/    │
│           │                                       │  evidence,      │
│           │                                       │  collapsible)   │
└───────────┴──────────────────────────────────────┴─────────────────┘
```

- **Sidebar** — always visible on desktop, collapses to bottom nav on mobile (per existing design system responsive rules)
- **Header** — TIDAL logo, current role badge, language selector, Research Mode toggle, profile/sign-out
- **Center Workspace** — the copilot: chat input, structured `DecisionResponse` cards, alerts inline
- **Supporting Panel** — map, charts, and expanded evidence/explanation detail; collapsible so the center workspace can go full-width when not needed

This directly implements the "sidebar for focus areas, center screen for agent decisions/alerts" idea — the sidebar does not load disconnected separate apps; every sidebar item scopes the same underlying agent/copilot to a different topic.

---

## 3. Center Workspace — The Copilot

This is the default and primary view regardless of which sidebar item is selected.

- **Chat/query input** — always present, always accessible, per TIDAL's core framing (Section 5.2 of the main project overview)
- **Structured decision cards** — every AI response renders as a card matching the `DecisionResponse` schema fields: recommendation, risk tier, confidence, key evidence, causal explanation, counterfactual alternatives, critical uncertainty, validity period, approval status
- **Inline alerts** — active hazard/warning alerts surface directly in the copilot stream, not only in a separate Alerts page (see Section 5)
- **Risk-tier gating visible here** — a "Pending Approval" state renders inline in the copilot when a high-risk decision is returned, per Pillar 6

The supporting panel (Section 4) expands automatically when a response includes a map or chart-relevant element (e.g., a route, a PFZ zone, a hazard overlay) — the user is not required to manually switch views to see it.

---

## 4. Supporting Panel

- Renders whatever visual accompanies the current decision card: map (MapLibre), chart (Recharts/ECharts), or expanded evidence list
- Collapsible — when collapsed, center workspace expands to full width
- Not a separate page/route — it is state tied to whatever the copilot is currently displaying

---

## 5. Sidebar Navigation Items

Each item scopes the copilot + supporting panel to a topic. None of these are disconnected standalone apps — selecting one changes what the center workspace is focused on, not which system is powering it.

| Sidebar item | Universal or role-gated | What it scopes the copilot to |
|---|---|---|
| **Home** | Universal | Default view — role-based default focus (see Section 7) |
| **Fishing Intelligence** | Fisherman (primary); visible to General with reduced default emphasis | PFZ, trip safety, route safety flagship queries |
| **Weather & Marine Conditions** | Universal | Wind, wave, tide, current conditions for a location/region |
| **Alerts & Warnings** | Universal | Full alert history/list (the inline alerts in the copilot are a subset of this) |
| **Research** | Universal (not role-gated — per earlier architecture decision, this is a mode, not a persona-exclusive page) | Deeper historical/aggregated/comparative queries — see Section 8 |
| **Route Planning** | Maritime Operator (primary); visible to Fisherman in simplified form | Safest-route flagship query |
| **Zone & Boundary Watch** | Coastal Authority, Disaster Management (primary); visible to all in simplified form | Zone-avoidance/geofencing flagship query |
| **Profile & Settings** | Universal | Account, role/preferences editing, language |

**Important distinction from the external research doc:** that document proposed role-exclusive pages (e.g., Route Planner "operator only," PFZ "fisherman only," Data Explorer "researcher only"). TIDAL does not hard-gate pages this way — every sidebar item is visible to every user, since the underlying agents and data are shared. What changes per role is the **default emphasis and pre-filled scope**, not access. This preserves the common-platform, non-siloed architecture already decided.

---

## 6. Explicitly Excluded From This Phase (from the external research doc)

The following ideas from the reviewed research document are **not** part of TIDAL's current scope, because they conflict with or exceed the established MVP:

- **Role selection at Login** — role selection stays on the Onboarding page, as already specified
- **Vessel Tracker / Fleet Monitor** — requires real AIS data not available to this project
- **Incident / Operations Dashboard, Public Alert Generator (send/dispatch)** — TIDAL drafts alerts (per Disaster Management research) but does not claim to dispatch them
- **Catch Log / Fishing History** — not one of the four flagship queries; possible future addition
- **Trend & Forecast Simulator, Offline Mode, Community Forum, Gamification** — explicitly future-only, not MVP
- **Separate per-role "pages" with independent APIs** — TIDAL uses one shared agent core; sidebar items scope focus, they do not correspond to separate backend systems

These may be revisited later, but should not influence the current dashboard build.

---

## 7. Home View — Default Focus Per Role

The Home sidebar item is universal, but its default content differs by role (attribute-driven, not a different page):

| Role | Home default shows |
|---|---|
| Fisherman | Trip safety status (flagship query 1) + nearest PFZ, prominently |
| Researcher | Recent/saved analyses, quick access to Research mode |
| Coastal Authority | Jurisdiction hazard summary, boundary/zone watch status |
| Disaster Management | Active hazard tracker, exposure summary |
| Maritime Operator | Active route status, compliance/geofence check summary |
| General/Other | Copilot chat only, no default widget — matches the fallback behavior already specified |

This is the only place role meaningfully changes what's shown by default — everywhere else in the sidebar, all users have access to the same items.

---

## 8. Research Mode (Reaffirming Existing Decision)

Research Mode is a **toggle in the header**, not a sidebar item exclusive to a role, per the earlier architecture decision. Activating it shifts the copilot's query handling to support historical, comparative, and aggregated questions (longer time ranges, multi-source correlation, exportable output) — the same agents are used, just with deeper query handling enabled. This applies to any user, reaffirming that "Researcher" is not a gated page but a query pattern available to everyone.

---

## 9. What This Resolves vs. What's Still Open

**Resolved by this document:**
- Overall dashboard layout (sidebar + center copilot + supporting panel)
- What lives in the sidebar and how role-gating actually works (default emphasis, not access control)
- Where Research Mode lives (header toggle, confirmed)
- Explicit exclusion list from the external research doc

**Still open, to decide before building:**
1. Exact visual treatment of the "Pending Approval" gated state within the copilot stream (badge? banner? blocked card with an unlock action?)
2. Whether the supporting panel defaults to expanded or collapsed on first load
3. Mobile layout specifics for the three-region layout (sidebar becomes bottom nav — confirmed by design system — but how do center workspace and supporting panel behave on a single mobile screen: stacked, tabbed, or swipeable?)

---

## 10. Summary for the Build Agent

Build the Main Dashboard as a three-region layout: a fixed sidebar (collapsing to bottom nav on mobile) for navigating between topic-scoped views, a center workspace that is always the agent copilot (chat input + structured `DecisionResponse` cards), and a collapsible supporting panel for maps/charts/evidence tied to whatever the copilot currently shows. Sidebar items are visible to all users regardless of role — role only changes the Home view's default content and each section's default query scope, never access. Research Mode is a header-level toggle available to all users, not a separate page. Do not implement per-role exclusive pages, Vessel Tracking, Incident Management, or alert-dispatch features — these are out of scope per Section 6.