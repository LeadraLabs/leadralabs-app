# LEADRA App — Backlog

## In progress
- Nothing in progress — initial build just completed

## Up next
- Add real Supabase and Railway values to `.env` and test the full auth + journal flow live
- Confirm/add a `primary_capability` (text, nullable) column on the Supabase `users` table —
  `POST /users/profile` now reads/writes it but I couldn't verify the column exists
- Test auth flow (email + Google) against the real Supabase project
- Test journal entry → insight flow end to end against the real backend

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

## Bugs
- None found yet — not tested against a live backend

## Open decisions
- Forgot password flow (currently placeholder link)
- Subscription management UI (currently placeholder link)
- CORS domain lock on backend before launch
