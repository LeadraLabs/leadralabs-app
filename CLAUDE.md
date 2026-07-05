# LEADRA App — Session Memory

## Project overview
React web app for LEADRA leadership development platform.
Vite + React → Cloudflare Pages → connects to Railway backend + Supabase auth.

## Current status
- [x] Initial build complete
- [x] Connected to real Supabase project and Railway backend
- [x] Full flow tested live: signup → email confirmation → login → onboarding → journal entry →
      Claude insight → micro-action refresh → insights list → monthly patterns
- [ ] Not yet tested: Google OAuth sign-in, weekly summary generation (cron-only, no frontend
      trigger), Cloudflare Pages deployment

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
- Fix the Supabase confirmation-email redirect URL (Authentication → URL Configuration)
- Set up Cloudflare Pages deployment (build command `npm run build`, output `dist`)
- Consider addressing the backend gaps above

## Key URLs
- Backend API: https://leadralabs-backend-production.up.railway.app
- Supabase project: leadralabs-production (Asia-Pacific), ref `ruqpvieexhwndzwhvlst`
- Deployed app: [Cloudflare Pages URL — to be added]
