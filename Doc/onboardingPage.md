# ORCA — Login & Preference Page Specification

**Scope of this document:** Login/Sign-Up page and Preference (Role Selection) page only.
Main Dashboard is intentionally out of scope here — to be designed separately once the interaction model (chat-first vs. widget-first) is decided.

---

## 1. Login / Sign-Up Page

### 1.1 Purpose
Authenticate the user. This page handles identity only — no role-related questions belong here.

### 1.2 Fields to capture

**Sign-up (new user):**
- Name
- Email or phone number
- Password

**Login (returning user):**
- Email/phone + password

**Note:** OTP-based login is a good future addition for accessibility, but requires third-party integration (SMS gateway, etc.). Keeping this out of scope for now — plain email/phone + password is enough for the MVP.

### 1.3 Language selector
Include a language selector directly on this page, before login/signup is even completed. Do not force users through an English-only signup flow first — this reflects the platform's multilingual requirement from the very first screen.

### 1.4 Routing logic after authentication

| User type | Next screen |
|---|---|
| New user (first-time sign-up) | Preference / Role Selection Page |
| Returning user (role already set) | Main Dashboard directly (skip Preference Page) |

---

## 2. Preference / Role Selection Page

### 2.1 Purpose
Capture the user's role, which sets the `role` attribute on their profile. This attribute later determines the default view shown on the Main Dashboard — it does not create a separate app or separate login system (per the common-platform architecture decision).

### 2.2 Question 1 — Primary Role (single-select, required)

- Fisherman
- Researcher
- Coastal Authority
- Disaster Management Agency
- Maritime Operator
- **Other / General User** — required fallback option; ensures the platform supports any marine stakeholder, not only the five explicitly named in the problem statement, matching its "such as" (non-exhaustive) framing.

### 2.3 Question 2 — Role-Specific Follow-Up (conditional, shown based on Q1 answer)

| If role = | Ask |
|---|---|
| Fisherman | Boat size/type; home harbour or region; typical fishing range (near-shore vs. deep-sea) |
| Researcher | Area of interest (fisheries science / oceanography / conservation); preferred depth of output (quick summaries vs. raw data access) |
| Coastal Authority | Jurisdiction / district overseen |
| Disaster Management Agency | District / region of responsibility |
| Maritime Operator | Vessel type; typical route range |
| Other / General User | No follow-up shown — skip directly to Question 3 |

### 2.4 Question 3 — Language Preference (confirm/select, if not already set at login)

- Confirm or change the language selected during login/signup

### 2.5 Design constraints
- Keep this page to a maximum of 3 questions/steps — a long onboarding form will hurt adoption, particularly for less tech-comfortable users such as fishermen.
- This page must remain skippable/editable later — a user should be able to revisit and change their role/preferences from account settings after initial setup (does not need to be built for MVP, but should not be architecturally blocked).

### 2.6 What this page sets, technically
Completion of this page sets (at minimum):
- `user.role` — one of the six values above
- `user.role_details` — the conditional follow-up answers specific to their role
- `user.language_preference`

These values are read by the Main Dashboard later to determine default view/widgets — no other page or system depends on this data at this stage.

---

## 3. Explicitly Out of Scope Here

- Main Dashboard layout, content, and interaction model (chat-first vs. widget-first) — to be designed in a separate document once decided
- Any role-specific dashboard visuals or components
- Backend/data schema implementation details beyond the three fields listed in 2.6

---

## 4. Open Questions Carried Forward (not part of this page, needed before Main Dashboard work begins)

1. Is the Main Dashboard a single scrollable page with widgets stacked, or a chat-first interface where components appear inline within the conversation?
2. Does the role-based "default view" persist permanently on-screen, or only appear once per session/day?
3. What is the intended screen ratio between the chat interface and persistent widgets?

These should be resolved before starting Main Dashboard design, but do not block building the Login and Preference pages specified above.