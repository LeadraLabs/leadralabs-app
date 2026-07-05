# LEADRA App — Session Memory

## Project overview
React web app for LEADRA leadership development platform.
Vite + React → Cloudflare Pages → connects to Railway backend + Supabase auth.

## Current status
- [x] Initial build complete
- [ ] Connected to real Supabase project and Railway backend
- [ ] Tested end to end with real data

## What's been built
- Full Vite + React 18 app, plain JavaScript, CSS Modules only, no UI libraries
- Routing: `/login`, `/signup`, `/onboarding`, `/dashboard`, `/journal`, `/journal/success/:id`,
  `/insights`, `/summaries`, `/profile` — protected routes redirect to `/login`
- Supabase auth (email/password + Google OAuth button) via `src/hooks/useAuth.js`
- `src/hooks/useApi.js` — every backend call, with Supabase bearer token attached, matching the
  real `leadralabs-backend` routes (checked against that repo's source, not guessed)
- All screens from the spec: Login, Signup, 3-step Onboarding, Dashboard (today's focus, mood
  check-in, weekly summary preview, recent entries, quick journal button), Journal (mode select,
  free write, guided write), Journal success (insight card + micro-action refresh), Insights list,
  Summaries (weekly/monthly tabs), Profile
- Mobile bottom nav that becomes a left sidebar at 768px+
- Made one small addition to `leadralabs-backend/src/routes/users.js`: `POST/GET /users/profile`
  now reads and writes `primary_capability` (needed for onboarding step 3 and the profile screen)

## What's been tested
- `npm install` and `npm run build` both run clean, no errors
- Visually verified every screen in the browser (mobile width + desktop width) using a
  placeholder `.env` — layout, responsive breakpoints, empty states, and the sidebar/bottom-nav
  switch all confirmed working
- Not yet tested: real sign-in/sign-up, real journal submission, real Google OAuth — all of that
  needs a real Supabase project and a running backend (see "Next session" below)

## Known issues / backend gaps found while building
These aren't bugs in the frontend — they're real gaps in `leadralabs-backend` that limit what the
frontend can do until addressed:
1. **No endpoint to update mood on an existing journal entry.** The dashboard's mood check-in
   strip can't PATCH an already-submitted entry, so if today's entry already exists, tapping a
   mood emoji doesn't persist anywhere. Currently the mood is only saved to `localStorage` for the
   day and used to prefill the mood rating on your *next* journal submission.
2. **No `GET /insights/:id` endpoint.** The journal success screen gets its insight from
   navigation state (passed directly after submission) rather than the URL. If you refresh that
   page, the insight is gone — there's a graceful fallback message linking to `/insights`, but a
   real fix needs a single-insight GET endpoint.
3. **`GET /journal/entries` caps at 30 entries.** The Profile screen's "total entries" count and
   streak dots are based on this capped list, so heavy users will see an undercount. A dedicated
   count endpoint would fix this properly.
4. **`primary_capability` requires a Supabase column.** I added the field to the backend route,
   but if the `users` table doesn't already have a `primary_capability` (text, nullable) column,
   onboarding step 3 and the profile capability picker will fail to save. See BACKLOG.md.

## Next session — pick up here
- Create a real `.env` with Supabase + Railway values (see `.env.example`)
- Confirm the `users` table in Supabase has a `primary_capability` column (add it if not)
- Test login/signup flow end to end, including Google OAuth
- Test journal entry submission and insight display end to end
- Decide whether to address the backend gaps listed above

## Key URLs
- Backend API: [Railway URL — to be added]
- Supabase project: leadralabs-production (Asia-Pacific)
- Deployed app: [Cloudflare Pages URL — to be added]
