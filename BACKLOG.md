# LEADRA App — Backlog

## In progress
- Waiting on Railway `ANTHROPIC_API_KEY` check — Claude insight generation is failing live (see
  CLAUDE.md "Blocked" section)

## Up next
- Once insight generation works, test: insight display, micro-action refresh, insights list,
  weekly summary, monthly patterns
- Test Google OAuth sign-in end to end (not yet tried)
- Fix the Supabase confirmation-email redirect URL (Authentication → URL Configuration) — the link
  itself confirms correctly, but the redirect target errors in the browser afterward

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
  email-confirmation path — fixed (see CLAUDE.md)
- Backend `GET /users/profile` threw a 500 instead of 404 for a not-yet-onboarded user — fixed and
  deployed

## Open decisions
- Forgot password flow (currently placeholder link)
- Subscription management UI (currently placeholder link)
- CORS domain lock on backend before launch
