# LEADRA App — Backlog

## In progress
- Nothing blocking — full flow verified live (signup through monthly patterns)

## Up next
- Test Google OAuth sign-in end to end (not yet tried)
- Fix the Supabase confirmation-email redirect URL (Authentication → URL Configuration) — the link
  itself confirms correctly, but the redirect target errors in the browser afterward
- Set up Cloudflare Pages deployment

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
