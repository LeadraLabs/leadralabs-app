# LEADRA App — Session Memory

## Project overview
React web app for LEADRA leadership development platform.
Vite + React → Cloudflare Pages → connects to Railway backend (`api.leadralabs.com`) + Supabase auth.

## Current status
- [x] Initial build complete
- [x] Connected to real Supabase project and Railway backend
- [x] Full flow tested live: signup → email confirmation → login → onboarding → journal entry →
      Claude insight → micro-action refresh → insights list → monthly patterns
- [x] Feedback button verified live end to end — real submission created a GitHub issue at
      https://github.com/LeadraLabs/leadralabs-feedback/issues/1
- [x] Backend migrated to custom domain `api.leadralabs.com` (was hitting Cisco Umbrella
      interception on the shared `*.up.railway.app` subdomain on a work laptop — see "Bugs found
      and fixed" below)
- [x] UAT Batch 1 (10 July 2026): onboarding/profile restructure, dashboard rework, navy/gold
      colour rebalance, copy fixes — see "UAT Batch 1" section below for full detail
- [x] UAT Round 1 (13 July 2026): fixed the onboarding-skip router bug, onboarding now fully
      self-contained, rebuilt the wellbeing check-in, forgot-password flow, capability detail view,
      rotating guided prompts, capability-chip grid fix, full copy/naming sweep — see "UAT Round 1"
      section below for full detail
- [ ] Not yet tested: Google OAuth sign-in, weekly summary generation (cron-only, no frontend
      trigger)
- [ ] In progress: Cloudflare Pages deployment, Supabase confirmation-email redirect fix (both
      being done manually via dashboard — see BACKLOG.md)

## What's been built
- Full Vite + React 18 app, plain JavaScript, CSS Modules only, no UI libraries
- Routing: `/login`, `/signup`, `/onboarding`, `/dashboard`, `/journal`, `/journal/success/:id`,
  `/insights`, `/summaries`, `/profile`, `/capabilities` — protected routes redirect to `/login`
- Supabase auth (email/password + Google OAuth button) via `src/hooks/useAuth.js`
- `src/hooks/useApi.js` — every backend call, with Supabase bearer token attached, matching the
  real `leadralabs-backend` routes
- All screens from the spec: Login, Signup, 4-step Onboarding (welcome, how-it-works, multi-select
  focus areas, career level/people management), Dashboard (greeting + New Reflection header,
  today's focus, streak card, mood check-in, weekly summary preview, recent reflections,
  leadership-capabilities link), Journal (mode select — Free text/Guided, free write, guided
  write), Journal success (insight card + micro-action refresh), Insights list, Summaries
  (weekly/monthly tabs), Profile (details, "My development" — focus areas/career level/people
  management/goals/context/self-rating sliders, subscription, account), Capabilities (static
  reference page, one card per capability)
- Mobile bottom nav that becomes a left sidebar at 768px+
- `src/utils/onboarding.js` — `needsOnboarding()` checks the user's profile after auth; both Login
  and the public-route guard use it to send users who haven't picked a `primary_capability` yet to
  `/onboarding` instead of straight to `/dashboard`
- Icons: every emoji in the app has been replaced with `@phosphor-icons/react` — none remain
  anywhere in `src/` (confirmed by a full regex scan across all `.jsx`/`.js`/`.css` files).
  - Capability icons (HeartStraight, Brain, Scales, Lightning, Handshake) render via a shared
    `CapabilityIcon` component (rounded-square tinted container, 28px icon) used at full size in
    Onboarding, Profile's capability picker, and the Journal capability chips; `CapabilityBadge`
    uses a smaller inline version of the same icons for compact contexts (Dashboard entries,
    Insights rows, Summaries pattern cards).
  - Bottom nav uses House/PencilSimple/Lightbulb/CalendarBlank/UserCircle with `currentColor` so
    the existing active-tab gold state just works.
  - Mood strip uses SmileyXEyes/SmileySad/SmileyMeh/Smiley/SmileyWink (same 1–10 value mapping).
  - NotificationBell uses `Bell`; the dashboard greeting had its wave emoji removed entirely
    (no replacement icon) rather than swapped.
  - Sparkle replaces the two decorative ✨ (journal-saved message, "Insight ready" heading);
    Compass replaces the Guided-mode emoji.
  - All arrow/refresh *symbols* (not emoji, but the same idea) were also swapped for consistency:
    `ArrowClockwise` (micro-action refresh, monthly-patterns refresh), `ArrowLeft` ("Change mode"
    back links), `ArrowRight` ("Write about it", "Read more", "Write your first entry" links).
- `src/components/FeedbackButton/FeedbackButton.jsx` — floating action button (bottom-right, above
  the bottom nav) mounted in `AppLayout` so it's on every authenticated screen. Opens a modal:
  type selector (Bug/Suggestion/General feedback, each with a Phosphor icon), "what were you
  trying to do" + "what happened instead" textareas. Submits via `useApi.submitFeedback()` to
  `POST /feedback`, automatically including `location.pathname` as the route — user id/email and
  timestamp are captured server-side from the auth token, not sent by the frontend.

## What's been tested live (real Supabase + real Railway backend + real Claude API)
Every core flow has now been verified end to end with real data, not mocks:
- **Signup** → email confirmation (this Supabase project requires it) → **Login** correctly routes
  new users to `/onboarding`, returning users to `/dashboard`
- **Onboarding** — all 4 steps; multi-select focus areas + career level + people management save
  via a single `POST /users/profile` and persist (re-verified in UAT Batch 1, 10 July 2026)
- **Journal submission (free write)** — entry saves correctly; Claude generates a real insight
  (sentiment, themes, 3 micro-actions, coaching note)
- **Micro-action refresh** — cycles through all 3 options, decrements the remaining count
  correctly, shows the right "you've explored all three" message when exhausted, and the exhausted
  state persists correctly on reload (confirmed via Insights list)
- **Insights list** — real entry shows with correct date/sentiment/preview; tap-to-expand renders
  the full InsightCard inline, including the persisted refresh state
- **Dashboard** — today's-focus card shows the real micro-action once generated; recent entries
  list, mood strip, and weekly-summary empty state all correct
- **Monthly patterns** — calls Claude live, renders overall_theme/patterns/encouragement exactly to
  spec (navy featured card, capability badge on pattern cards, gold-tinted encouragement)
- **Profile** — "My development" section (priority focus areas, career level, people management,
  development goals, current context, per-capability self-rating sliders) all save correctly and
  persist with real data (verified in UAT Batch 1). Streak dots/entry count/member-since date
  moved to Dashboard.
- Sign out works and correctly redirects to `/login`

## UAT Batch 1 (10 July 2026)
Addressed `leadralabs-feedback` issues #2, #3, #4, #5, #6, #7, #8, #10, #15, agreed with Kathleen
and Nova. Depended on a backend migration (`leadralabs-backend/migrations/2026-07-10-uat-batch-1.sql`)
which was confirmed run against live Supabase before building against the new columns.

- **Onboarding is now 4 steps.** Step 3 ("What would you like to work on first?") is multi-select,
  saving `primary_capabilities` (array, replacing the old singular `primary_capability`). New
  Step 4 collects `career_level` (4-point scale) and `manages_others` (boolean) in the same final
  `POST /users/profile` call as Step 3's selections — one save at the end, not per-step.
- **Critical fix:** `src/utils/onboarding.js`'s `needsOnboarding()` was still checking the old
  `profile.primary_capability` singular field. Since the backend upsert no longer writes that
  field going forward, this would have sent every user back into onboarding on next login if left
  unfixed. Now checks `primary_capabilities.length`.
- **Profile screen** gained a "My development" section: priority focus areas (multi-select,
  editable version of onboarding Step 3), career level, people management, development goals
  (free text, saves on blur), current context (free text, saves on blur, with helper text), and
  one 1–5 self-rating slider per capability (saves to `capability_self_ratings` JSON on release).
  Fixed the "buttons feel slow" complaint (#3) by tracking which specific capability button is
  mid-save (`savingField` state) instead of disabling the whole grid during any one save.
  "My streak" section removed from Profile — moved to Dashboard (see below).
- **Dashboard restructure:** greeting now prefers `profile.full_name` over the old email-prefix
  fallback; `+ New Reflection` moved to the header (kept as the one gold-filled CTA on the
  screen); streak card moved here from Profile; "Recent journal entries" relabelled "Recent
  reflections"; new link to `/capabilities`.
- **New `/capabilities` page** (`src/pages/Capabilities/Capabilities.jsx`) — static reference
  content, one card per capability with "Why it matters" / "What you'll gain" placeholder copy
  (marked `{/* NOVA: edit copy here */}` in both the component and `src/config/capabilities.js`,
  where the copy actually lives as `whyItMatters`/`whatYoullGain` fields). **Deviation from the
  original spec:** not added as a 6th bottom-nav/sidebar tab (would crowd the 5-item mobile nav)
  — reachable via a card on Dashboard and a link on Profile instead, per explicit user decision.
- **Navy/gold colour rebalance:** switched all full-width primary-CTA buttons (Login, Signup,
  Onboarding Next/Let's go, Journal submit, Journal success "Back to dashboard", Feedback modal
  submit) and the bottom-nav/sidebar active state from gold fill to navy fill. Left gold on:
  Dashboard's single `+ New Reflection` CTA, small dots/bullets/badges, selected-state borders on
  cards/chips/inputs, and the today's-focus/prompt highlight cards — these match the prompt's own
  examples of acceptable small-accent gold use. No hex values changed, only which variable each
  rule references.
- **Copy/layout fixes:** "Free write" → "Free text" (Journal mode selector); bottom nav "Home" →
  "Dashboard"; `.savedButton` (journal success "Back to dashboard") now uses
  `display: flex; align-items: center; justify-content: center` instead of relying on
  `text-align` + `min-height`, fixing the vertical-centering bug (#8).
- Not built this batch, flagged only per the prompt: #9 (rate/mark-done micro-actions — scope
  unconfirmed with Nova), #11 (thumbs up on summaries — low priority), #14 (progress graph across
  the 5 pillars — its own future batch, would be fed by `capability_self_ratings` history).
- Verified end-to-end against the live backend with a real test account: onboarding save,
  `needsOnboarding` no longer loops a fully-onboarded user back to `/onboarding`, all six new
  Profile fields round-trip correctly (confirmed via network payload inspection), and every
  touched screen checked at a 375px viewport with no overflow/breakage.

## UAT Round 1 (13 July 2026)
Full session covering Part A (investigate-first items) and Part B (direct fixes) from the UAT
Round 1 prompt.

**Part A — investigated, confirmed cause, then fixed:**
- **A1 — onboarding-skip bug, root cause found:** `src/App.jsx`'s catch-all route
  (`path="*"`) was hardcoded to `<Navigate to="/dashboard" replace />` with no onboarding check at
  all. Since the Supabase email-confirmation redirect is still pointing at an unreachable URL (see
  BACKLOG.md), a real signup landing on any unrecognised URL after confirming their email hit this
  catch-all and skipped onboarding completely, regardless of `primary_capabilities`. Fixed by
  replacing the catch-all with a new `CatchAllRoute` component that runs the same
  `needsOnboarding()` check as `PublicRoute` before deciding where to send the user.
- **A2 — Onboarding vs Profile field audit:** confirmed Onboarding only collected focus areas,
  career level, and people management; the 5 capability self-rating sliders, development goals,
  and current context existed only in Profile. Added a new Onboarding step 5 ("Where you're
  starting from") collecting all three, so onboarding alone now fully builds a new user's profile
  — Profile is purely for later editing, per Kathleen's confirmation.
- **A3 — wellbeing check-in, confirmed never built:** checked the full git history and current
  code; only a plain 1–10 mood-icon strip existed on the journal screen, no mood tags/growth
  rating/wellbeing sliders anywhere, and no backend columns for them. Rebuilt from the original
  spec: new shared `WellbeingCheckin` component (mood tags, 1–3 star Growth Rating, six 1–5
  wellbeing sliders — Sleep Quality, Nutrition, Movement, Stress Load, Physical Health,
  Relationships, all optional, labelled "informs AI insights") rendered once per entry on both
  Free write and Guided write. Required a schema change — see `leadralabs-backend`'s
  `migrations/2026-07-13-wellbeing-checkin.sql`, confirmed run against production and verified with
  a real end-to-end journal submission.

**Part B — direct fixes:**
- **B1:** Forgot password flow wired up via Supabase (`resetPasswordForEmail` /
  `updateUser`) — new `/forgot-password` and `/reset-password` screens. Verified live: reset email
  send confirmed against the real Supabase project.
- **B2:** Removed every em dash across the app (frontend and backend user-facing copy, and the
  Claude prompt text), capitalised both words in every capability title (Emotional Regulation,
  Critical Thinking, Situational Judgement, Change Agility), renamed Influence → Influencing
  everywhere (frontend `CAPABILITIES` config is the single source of truth; backend capability
  labels and Claude prompts updated to match). Added a career-level instructional line to
  Onboarding, renamed the people-management step heading to "A bit more about you".
- **B3:** Profile self-rating sliders now show "Very poor"/"Excellent" labels and use each
  capability's own icon colour as the slider accent colour; removed the `disabled` state that was
  making sliders feel sticky right after a drag release (it was disabling the input at the exact
  moment `onMouseUp` fired). Added a real capability detail view at `/capabilities/:key` with a
  back button (`navigate(-1)`, so it returns wherever the user actually came from — Profile's
  rating rows or the `/capabilities` list both link into it now).
- **B4:** Removed the orange "What moment shaped your day" banner (duplicated New Reflection +
  Journal nav). Renamed "Learn about the 5 leadership capabilities" → "Learn about Leadership
  Capabilities" (no hardcoded count). Greeting and streak-card totals were already correctly
  implemented in code — verified live that both work once real data exists (Kathleen's test
  account had 0 entries and no saved name at the time she reported these, which is why they looked
  broken).
- **B5:** Renamed the "Insights" nav item and its user-facing copy to "Reflections" throughout
  (bottom nav, empty-state text, journal-success fallback links). Left the `/insights` route path
  and internal `insight`/`InsightCard` naming as-is — that refers to the AI-generated insight
  object, a different concept from the reflections-list screen.
- **B6 (frontend):** Reordered `InsightCard` so the coaching note appears above the micro-action.
- **B7:** Replaced the single fixed guided-journal prompt with a pool of 6 prompts per capability
  (`src/config/guidedPrompts.js`), one shown per day per capability picked deterministically by
  day-of-year (stable within a day, varies day to day).
- **B9:** Full navy-dominance visual pass across Login, Signup, Onboarding, Dashboard, Journal,
  Reflections, Summaries, Profile — confirmed navy is already dominant (headings, primary CTAs,
  active nav state) following the prior UAT Batch 1 rebalance; no further colour changes needed.
- **B10:** Redesigned the journal-entry capability chips from a horizontally-scrolling pill row to
  a 5-column grid of square buttons (icon above, name wrapped below). Found and fixed a real CSS
  bug along the way: `grid-template-columns: repeat(5, 1fr)` doesn't shrink tracks below their
  content's natural minimum size by default, so the row was still overflowing at narrow widths even
  though the math should have fit — fixed with `min-width: 0` on the grid items. Verified at 360px
  and 375px, no horizontal scroll.

Backend-only changes (B6 capability anchoring, B8 person consistency, B2 backend copy/Influence
rename) are documented in `leadralabs-backend`'s CLAUDE.md.

Verified end-to-end against the live backend with the `claude-code-test@leadralabs.com` account: a
real Guided-mode Situational Judgement entry, submitted with wellbeing check-in data filled in,
correctly saved, generated a Situational-Judgement-anchored insight (not drifting to another
capability), rendered with the coaching note above the micro-action, and updated the Dashboard
streak card and Recent reflections list correctly.

## Bugs found and fixed this session
1. **Login always went to `/dashboard`, skipping onboarding entirely** for anyone who signed up
   through the email-confirmation path (i.e. everyone, since this Supabase project requires it).
   Fixed in `src/utils/onboarding.js` + `Login.jsx` + `App.jsx`'s `PublicRoute`.
2. **Backend: `GET /users/profile` threw a raw 500** instead of a graceful "not found" for any
   user who hadn't been upserted into the `users` table yet. Fixed in
   `leadralabs-backend/src/routes/users.js` — switched `.single()` to `.maybeSingle()` and return
   404. Deployed and confirmed live.
3. **Claude insight generation was failing with a 401 `invalid x-api-key`** — the `ANTHROPIC_API_KEY`
   value in Railway didn't authenticate even though it looked correct. Fixed by pasting a fresh key
   copy into Railway. Confirmed working with real generated insights afterward.
4. **Monthly patterns occasionally showed "couldn't load" even when Claude succeeded.** React
   StrictMode double-invokes effects in dev, firing two overlapping `GET /patterns/monthly`
   requests; if the second (duplicate) one failed, its result overwrote the first successful one.
   Fixed with a request-id guard in `Summaries.jsx` so only the latest request's result is applied.
5. `.env`'s `VITE_API_URL` had a typo (`yleadralabs-backend...` missing `https://`) — fixed locally
   (not committed, `.env` is gitignored).
6. **The shared `*.up.railway.app` backend subdomain was being intercepted by Cisco Umbrella/
   OpenDNS** on a work laptop — every request served a fake "malware" block page via a full
   untrusted cert chain (Cisco Umbrella Root CA → ... → leaf cert for the domain). Confirmed
   device-level, not network-level (persisted even over a phone hotspot). Fixed by moving the
   backend to `api.leadralabs.com` as a custom domain; `.env`'s `VITE_API_URL` updated to match.

## Known issues / backend gaps found while building
1. **No endpoint to update mood on an existing journal entry.** Mood is saved to `localStorage` for
   the day and used to prefill the *next* journal submission instead.
2. **No `GET /insights/:id` endpoint.** Journal success screen relies on navigation state; refresh
   loses it (graceful fallback in place, links to `/insights`).
3. **`GET /journal/entries` caps at 30.** Profile's total-entries count and streak will undercount
   for long-time users eventually.
4. **Supabase auth email templates redirect to an unreachable URL on confirmation.** Not just
   cosmetic — this was the real trigger behind the A1 onboarding-skip bug (13 July 2026): a user
   landing on that unreachable URL after confirming would hit the app's catch-all route. The
   catch-all itself is now fixed (always checks onboarding status), so this no longer skips
   onboarding — but the redirect still needs fixing before real users sign up, since it's still a
   broken/confusing landing experience on its own. **Flagging for Kathleen: needs a decision on
   what the confirmation redirect URL should actually be (the deployed Cloudflare Pages URL, once
   live) and the Supabase dashboard update to match.**

## Next session — pick up here
- **Decision needed from Kathleen:** confirm the Supabase confirmation-email redirect URL once
  Cloudflare Pages is live (see known issue #4 above)
- Test Google OAuth sign-in (not yet tried — needs a real browser interaction with Google's login)
- Finish the Supabase confirmation-email redirect fix and Cloudflare Pages deployment (both
  in progress via dashboard — see BACKLOG.md)
- Once Cloudflare Pages is live: set `VITE_API_URL=https://api.leadralabs.com` in its env vars,
  add its `.pages.dev` URL to Supabase's Redirect URLs, and consider locking backend CORS to it
- Consider addressing the backend gaps above

## Key URLs
- Backend API: https://api.leadralabs.com
- Supabase project: leadralabs-production (Asia-Pacific), ref `ruqpvieexhwndzwhvlst`
- Feedback repo: https://github.com/LeadraLabs/leadralabs-feedback (private)
- Deployed app: [Cloudflare Pages URL — to be added]
