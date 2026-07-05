# leadralabs-app

The LEADRA web app — the user-facing React app where LEADRA users log in, write journal entries,
see AI-generated insights, review weekly summaries, and track their patterns over time.

Built with Vite + React 18, plain JavaScript, CSS Modules, and `@supabase/supabase-js` for auth.
Connects to the LEADRA Intelligence Backend (Node.js/Express API on Railway).

## Local development

1. Copy `.env.example` to `.env` and fill in your Supabase project URL/anon key and your local or
   deployed backend URL.
2. `npm install`
3. `npm run dev`

## Deployment

This app deploys to Cloudflare Pages:

1. Push to the `main` branch on GitHub (`leadralabs-app` repo)
2. Cloudflare Pages auto-deploys
3. Build command: `npm run build`
4. Output directory: `dist`

To set this up for the first time, create a new Cloudflare Pages project connected to this repo —
same process as the marketing site, but with build command `npm run build` and output directory
`dist`.
