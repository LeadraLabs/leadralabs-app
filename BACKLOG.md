# LEADRA App — Backlog

## In progress
- Cloudflare Pages setup + Supabase redirect fix in progress (Kathleen doing the dashboard steps)
- Backend push blocked: `leadralabs-backend` git push returned 403 "Write access to repository not
  granted" — commit is sitting locally, needs a GitHub credentials/permissions check before retry

## High priority — pre-launch
- Set up `api.leadralabs.com` as a custom domain for the backend (see leadralabs-backend/BACKLOG.md)
  — the shared `*.up.railway.app` subdomain gets intercepted by Cisco Umbrella/OpenDNS on at least
  one work laptop, serving a fake "malware" block page instead of the real API. Once the custom
  domain is live, update `VITE_API_URL` here and on Cloudflare Pages.

## Up next
- Test Google OAuth sign-in end to end (not yet tried)
- Cloudflare Pages: once deployed, add the `.pages.dev` URL to Supabase's Redirect URLs
- Feedback button: needs `GITHUB_FEEDBACK_TOKEN` set on the backend before submissions actually
  create GitHub issues (frontend side is done and builds clean, not yet live-tested)

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

## Open decisions
- Forgot password flow (currently placeholder link)
- Subscription management UI (currently placeholder link)
- CORS domain lock on backend before launch
