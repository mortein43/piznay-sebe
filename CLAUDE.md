# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Пізнай себе" (piznay-sebe.pp.ua) — a Ukrainian-language site for taking psychological self-assessment tests. Next.js 15 (React 19, plain JavaScript, no TypeScript), styled with SCSS modules, data in MongoDB, deployed on Vercel (uses `@vercel/analytics`). Only UI text (what users see on the site) is in Ukrainian — keep it that way. Everything else is English only: API messages, log messages (including script output), documentation (README, CLAUDE.md), code comments in every file type (JS, SCSS, config), commit messages, PR titles and PR descriptions.

## Commands

```bash
npm run dev        # dev server with Turbopack on http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint CLI with next/core-web-vitals over .js, .jsx and .mjs, plus typescript-eslint over .ts and .tsx
npm run typecheck  # tsc --noEmit (strict; JavaScript is allowed but not type-checked until it is converted)
```

There is no automated test suite. ("Tests" in this codebase and in commit messages means the psychological quizzes stored in MongoDB.)

Requires `MONGODB_URI` in `.env.local`; `app/lib/mongodb.js` throws at import time without it. Optional `MONGODB_DB` selects the database (defaults to `piznay_sebe`, the production one) — staging should point at a separate database.

## Branches and deploys

- `staging` is the working branch: work branches open PRs into it, and Vercel gives it a Preview deployment at https://staging.piznay-sebe.pp.ua. It is protected by Vercel Authentication: to give someone access, generate a share link in Vercel (Deployments → the deployment → Share) and send it privately. Never put share links (`?_vercel_share=...`) in the repo, Confluence or Jira — the token works like a password.
- Work branches are cut from `staging` and named `<prefix>/PS-<n>-<short-kebab-description>`, where `PS-<n>` is the Jira issue key (project `PS`):
  - `feature/` — new functionality visible to users (e.g. `feature/PS-12-test-results-share`)
  - `fix/` — bug fixes (e.g. `fix/PS-14-empty-test-list`)
  - `chore/` — maintenance that doesn't change app behavior: dependency upgrades, config, tooling, scripts, docs (e.g. `chore/PS-15-upgrade-next`)
  - Work with no Jira issue drops the key: `<prefix>/<short-kebab-description>`.
- CI (`.github/workflows/ci.yml`) runs lint, typecheck and build on every pull request into `staging` and `main`.
- `main` is production: it only receives `staging → main` PRs (use a merge commit, not squash), and every push to it redeploys prod on Vercel.
- Hotfixes branch from `main`, merge into `main`, then `main` is merged back into `staging`.
- Test content lives in MongoDB, not in git, so merging code does not move it. New or edited tests are made in `piznay_sebe_staging`, checked on staging, then promoted with `node --env-file=.env.local scripts/promote-tests-to-prod.mjs` (prints the plan; add `--apply` to write, `--only="<name or _id>,..."` to limit). It upserts by `_id` and never deletes from prod.
- Before every `promote-tests-to-prod.mjs --apply` (and any manual change to prod tests), back up prod first: `node --env-file=.env.local scripts/backup-prod-tests.mjs <file outside the repo>`. This is required: the Atlas cluster has no automated backups and git does not hold test content. The script only reads `piznay_sebe.tests`, writes canonical Extended JSON, and refuses paths inside the repository and existing files.

## Epics and task docs

Epics and their tasks live in Jira (project `PS`), and a copy of each epic's specs is versioned in the repo:

```
docs/epics/
├── <epic key>-<short-kebab-name>/
│   ├── README.md                              # the epic: goal, why, in/out of scope, success criteria, risks, task table
│   └── tasks/
│       └── <task key>-<short-kebab-name>.md   # one per task: Jira link, type, what and why, acceptance criteria, dependencies
└── <issue key>-<short-kebab-name>.md          # a standalone issue with no epic: same format, "Epic: none (standalone)"
```

- All files are `.md` and in English; UI strings and proper names (e.g. Confluence space names) may be quoted in Ukrainian as they appear.
- The first task of every epic is "Add epic and task docs to the repo" (branch `chore/PS-<n>-add-epic-docs`): it writes these files, and in Jira it blocks every other task of the epic.
- Jira is the source of truth for status; the docs are a snapshot of the scope. Update them when an epic's or task's scope changes, not when its status does, and bump the "Last synced with Jira on" date in the note under each file's metadata list when you re-sync it. Acceptance-criteria checkboxes are never ticked.
- Example: `docs/epics/PS-1-prepare-project-for-further-work/`.

## Architecture

- **Mixed routers**: UI lives in the App Router (`app/`), but the only API endpoint is a Pages Router route, `pages/api/test.js` → `/api/test`. It is read-only: `GET` returns every document from the `piznay_sebe.tests` collection; any other method gets `405` with `Allow: GET`. Tests reach prod only through `scripts/promote-tests-to-prod.mjs`.
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
- Path alias `@/*` maps to the repo root (`tsconfig.json`).
- SEO metadata, OG tags and Google site verification are in `app/layout.js`; `app/robots.txt` and `app/sitemap.xml` are static files.
