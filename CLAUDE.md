# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Пізнай себе" (piznay-sebe.pp.ua) — a Ukrainian-language site for taking psychological self-assessment tests. Next.js 15 (React 19, plain JavaScript, no TypeScript), styled with SCSS modules, data in MongoDB, deployed on Vercel (uses `@vercel/analytics`). All user-facing text, log messages and API messages are in Ukrainian — keep it that way.

## Commands

```bash
npm run dev      # dev server with Turbopack on http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # next lint (eslint, next/core-web-vitals)
```

There is no automated test suite. ("Tests" in this codebase and in commit messages means the psychological quizzes stored in MongoDB.)

Requires `MONGODB_URI` in `.env.local`; `app/lib/mongodb.js` throws at import time without it. Optional `MONGODB_DB` selects the database (defaults to `piznay_sebe`, the production one) — staging should point at a separate database.

## Branches and deploys

- `staging` is the working branch: feature branches open PRs into it, and Vercel gives it a Preview deployment.
- `main` is production: it only receives `staging → main` PRs (use a merge commit, not squash), and every push to it redeploys prod on Vercel.
- Hotfixes branch from `main`, merge into `main`, then `main` is merged back into `staging`.
- Test content lives in MongoDB, not in git, so merging code does not move it. New or edited tests are made in `piznay_sebe_staging`, checked on staging, then promoted with `node --env-file=.env.local scripts/promote-tests-to-prod.mjs` (prints the plan; add `--apply` to write, `--only="<name or _id>,..."` to limit). It upserts by `_id` and never deletes from prod.

## Architecture

- **Mixed routers**: UI lives in the App Router (`app/`), but the only API endpoint is a Pages Router route, `pages/api/test.js` → `/api/test`. `GET` returns every document from the `piznay_sebe.tests` collection; `POST` inserts the request body as a new test (no auth or validation).
- **Mongo client**: `app/lib/mongodb.js` exports a shared `clientPromise`, cached on `global` in development to survive HMR.
- **Single-page flow**: `app/page.js` is a client component holding `selectedTest` state. `Header` (logo click resets the selection) and `Main` sit under it. `Main` toggles the slide-out `TestList` (which fetches `/api/test` on mount) and renders `Test`, keyed by `selectedTest._id` so switching tests remounts it and resets its state.
- **Test document shape** (inferred from `app/components/main/test/Test.jsx`):
  - `name`, `description`, `instruction`: strings
  - `questions`: array of `{ question, scale, answers }`, where `answers` maps answer label → numeric score
  - `interpretation`: a single string; double spaces (`"  "`) are treated as paragraph breaks when rendered
  - Scores are summed per `scale`; per-scale results are shown only when there is more than one scale.

## Styling

- Each component has a co-located `*.module.scss` using BEM-style class names (`block__element`).
- Responsive breakpoints are SCSS mixins in `app/styles/media.scss` (`desktop`, `tablet`, `mobile`, `mobile-s`, plus `*-above` variants); import with `@use "../../../styles/media.scss" as *;` (relative path).
- Tailwind v4 is wired in via `app/styles/globals.scss` (`@use "tailwindcss"`) and PostCSS, but components rely almost entirely on SCSS modules.
- Path alias `@/*` maps to the repo root (`jsconfig.json`).
- SEO metadata, OG tags and Google site verification are in `app/layout.js`; `app/robots.txt` and `app/sitemap.xml` are static files.
