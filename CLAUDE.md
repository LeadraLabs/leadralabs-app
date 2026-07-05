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
- [ ] Not yet tested: Google OAuth sign-in, weekly summary generation (cron-only, no frontend
      trigger)
- [ ] In progress: Cloudflare Pages deployment, Supabase confirmation-email redirect fix (both
      being done manually via dashboard — see BACKLOG.md)

## What's been built
- Full Vite + React 18 app, plain JavaScript, CSS Modules only, no UI libraries
- Routing: `/login`, `/signup`, `/onboarding`, `/dashboard`, `/journal`, `/journal/success/:id`,
  `/insights`, `/summaries`, `/profile` — protected routes redirect to `/login`
- Supabase auth (email/password + Google OAuth button) via `src/hooks/useAuth.js`
- `src/hooks/useApi.js` — every backend call, with Supabase bearer token attached, matching the
  real `leadralabs-backend` routes
- All screens from the spec: Login, Signup, 3-step Onboarding, Dashboard (today's focus, mood
  check-in, weekly summary preview, recent entries, quick journal button), Journal (mode select,
  free write, guided write), Journal success (insight card + micro-action refresh), Insights list,
  Summaries (weekly/monthly tabs), Profile
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
- **Onboarding** — all 3 steps; capability selection saves via `POST /users/profile` and persists
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
- **Profile** — streak dots, entry count, member-since date, and primary_capability selection all
  correct with real data
- Sign out works and correctly redirects to `/login`

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
4. **Supabase auth email templates** redirect to an unreachable URL on confirmation — cosmetic
   (confirmation still works), but worth fixing before real users sign up.

## Next session — pick up here
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
