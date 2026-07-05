# LEADRA App — Session Memory

## Project overview
React web app for LEADRA leadership development platform.
Vite + React → Cloudflare Pages → connects to Railway backend + Supabase auth.

## Current status
- [x] Initial build complete
- [x] Connected to real Supabase project and Railway backend
- [x] Signup, login, onboarding, journal submission tested live with real data
- [ ] Claude insight generation — currently failing on the live backend, blocked on Railway env check

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

## What's been tested live (real Supabase + real Railway backend)
- **Signup** — creates a Supabase auth user; this project requires email confirmation, so the app
  correctly shows "check your email" rather than a session
- **Email confirmation** — the confirmation link's redirect page errors in the browser (its
  redirect target isn't reachable), but the confirmation itself succeeds server-side before that
  redirect — this is expected and not an app bug. See BACKLOG.md if you want the redirect fixed.
- **Login** — signs in and correctly routes to `/onboarding` (new user) or `/dashboard` (returning
  user) based on whether `primary_capability` is set
- **Onboarding** — all 3 steps, capability selection saves via `POST /users/profile` and persists
  (confirmed by reloading Profile and seeing it selected)
- **Journal submission (free write)** — entry saves correctly (content, module, capability,
  mood_rating all round-trip correctly); confirmed via the raw network response
- **Dashboard, Insights, Profile** — all correctly show graceful empty/pending states when there's
  no insight yet; Profile's streak dots and entry count update correctly from real data
- Sign out works and correctly redirects to `/login`

## Blocked — needs your input
**Claude insight generation is failing on the live backend.** A real journal entry saved fine, but
`insight` came back `null` with the message "Our thinking cap is taking a quick breather." The
backend's own error logging points at `ANTHROPIC_API_KEY` — check Railway → leadralabs-backend →
Variables, and confirm it's set to a valid key (starts with `sk-ant-`). Once that's fixed, still
to verify: insight card display, micro-action refresh, insights list with real content, weekly
summary generation, monthly patterns.

## Bugs found and fixed this session
1. **Login always went to `/dashboard`, skipping onboarding entirely** for anyone who signed up
   through the email-confirmation path (i.e. everyone, since this Supabase project requires it).
   Fixed in `src/utils/onboarding.js` + `Login.jsx` + `App.jsx`'s `PublicRoute`.
2. **Backend: `GET /users/profile` threw a raw 500** instead of a graceful "not found" for any
   user who hadn't been upserted into the `users` table yet (i.e. every new signup before they
   finish onboarding). Fixed in `leadralabs-backend/src/routes/users.js` — switched `.single()` to
   `.maybeSingle()` and return 404. Deployed and confirmed live.
3. `.env`'s `VITE_API_URL` had a typo (`yleadralabs-backend...` missing `https://`) — fixed locally
   (not committed, `.env` is gitignored).

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
- Once `ANTHROPIC_API_KEY` is fixed, re-test: insight display, micro-action refresh (3 options),
  insights list, weekly summary (`POST /summaries/generate` — no frontend trigger for this
  currently, it's cron-only via the backend scheduler), monthly patterns
- Test Google OAuth sign-in (not yet tried — needs a real browser interaction with Google's login)
- Fix the Supabase confirmation-email redirect URL (Authentication → URL Configuration)
- Consider addressing the backend gaps above

## Key URLs
- Backend API: https://leadralabs-backend-production.up.railway.app
- Supabase project: leadralabs-production (Asia-Pacific), ref `ruqpvieexhwndzwhvlst`
- Deployed app: [Cloudflare Pages URL — to be added]
