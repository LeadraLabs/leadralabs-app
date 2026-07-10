# LEADRA App — Backlog

## In progress
- Cloudflare Pages setup + Supabase redirect fix in progress (Kathleen doing the dashboard steps)

## Up next
- Test Google OAuth sign-in end to end (not yet tried) — deferred until after deployment
- Cloudflare Pages: once deployed, add the `.pages.dev` URL to Supabase's Redirect URLs, and set
  `VITE_API_URL=https://api.leadralabs.com` in its environment variables
- CORS domain lock on backend before launch, once the Cloudflare Pages domain is known
- UAT feedback #9 (rate/mark-done on micro-actions) — needs scope confirmation with Nova before
  starting, she partially retracted this mid-issue
- UAT feedback #11 (thumbs up on summaries page) — low priority, not scheduled
- UAT feedback #14 (progress graph across the 5 pillars) — own scoped piece of work, fed by
  `capability_self_ratings` history over time; see Phase 2 below

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
- Progress graph across the 5 capabilities (UAT feedback #14) — chart component fed by
  `capability_self_ratings` history over time

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

## Resolved — UAT Batch 1 (10 July 2026)
- Onboarding restructured to 4 steps: multi-select focus areas (`primary_capabilities`), new
  career-level + people-management step — addressed issues #2, #3, #6, #7
- Profile gained a full "My development" section (focus areas, career level, people management,
  development goals, current context, per-capability self-ratings) — addressed #6
- Dashboard restructured into an actual home/summary screen: profile-based greeting, header
  `+ New Reflection`, streak card (moved from Profile), renamed "Recent reflections" list — #2, #4
- New static `/capabilities` reference page, linked from Dashboard + Profile (not added as a 6th
  nav tab, per decision to avoid crowding the 5-item mobile bottom nav) — #15
- Navy/gold colour rebalance: primary CTAs and nav active-state switched from gold fill to navy;
  gold reserved for the one CTA per screen, small accents, and highlight cards — #5
- Fixed vertical-centering bug on journal success "Back to dashboard" button, renamed nav "Home" →
  "Dashboard", renamed "Free write" → "Free text" — #8, #10
- **Not built, flagged for future batches:** #9 (rate/mark-done micro-actions, scope unconfirmed
  with Nova), #11 (thumbs up on summaries), #14 (progress graph across the 5 pillars, fed by
  `capability_self_ratings` history — see Phase 2/3 below)

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
