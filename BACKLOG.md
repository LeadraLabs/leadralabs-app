# LEADRA App — Backlog

## In progress
- Cloudflare Pages setup + Supabase redirect fix in progress (Kathleen doing the dashboard steps)

## Up next
- Test Google OAuth sign-in end to end (not yet tried) — deferred until after deployment
- Cloudflare Pages: once deployed, add the `.pages.dev` URL to Supabase's Redirect URLs, and set
  `VITE_API_URL=https://api.leadralabs.com` in its environment variables
- CORS domain lock on backend before launch, once the Cloudflare Pages domain is known

## Backend gaps found during this build (not frontend bugs — see CLAUDE.md for detail)
- No endpoint to update `mood_rating` on an already-submitted journal entry
- No `GET /insights/:id` endpoint for fetching a single insight (journal success screen currently
  relies on navigation state, which is lost on refresh)
- `GET /journal/entries` is capped at 30 — Profile screen's total entry count and streak will
  undercount for long-time users; needs a dedicated count endpoint eventually

## Planned — Phase 2
- Micromoment capture screen
- Push notifications (when mobile PWA is added)
- Offline journaling (save draft, sync when online)
- Dark mode
- Playbook integration — show relevant playbook content after insight

## Planned — Phase 3
- Progressive Web App (PWA) setup for home screen install
- Telegram mini app version
- Team/cohort dashboard (B2B)

## Bugs fixed this session
- Login always redirected to `/dashboard`, skipping onboarding for anyone signing up through the
  email-confirmation path — fixed
- Backend `GET /users/profile` threw a 500 instead of 404 for a not-yet-onboarded user — fixed and
  deployed
- Claude insight generation failed with a 401 invalid-key error — root cause was a bad
  `ANTHROPIC_API_KEY` value in Railway, not a code issue; fixed by re-pasting the key
- Monthly patterns occasionally showed a false "couldn't load" error due to a React StrictMode
  double-fetch race condition overwriting a successful response — fixed with a request-id guard

## Resolved — custom domain + feedback
- Backend moved from the shared `*.up.railway.app` subdomain to `api.leadralabs.com` — the shared
  subdomain was being intercepted by Cisco Umbrella/OpenDNS on a work laptop (device-level, not
  network-level — persisted even over a phone hotspot), serving a fake "malware" block page.
  `VITE_API_URL` updated locally to the new domain.
- Feedback button verified live end to end: a real submission created
  https://github.com/LeadraLabs/leadralabs-feedback/issues/1

## Open decisions
- Forgot password flow (currently placeholder link)
- Subscription management UI (currently placeholder link)
