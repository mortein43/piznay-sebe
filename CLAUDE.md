# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Пізнай себе" (piznay-sebe.pp.ua) — a Ukrainian-language site for taking psychological self-assessment tests. Next.js 15 (React 19, strict TypeScript), styled with SCSS modules, data in MongoDB, deployed on Vercel (uses `@vercel/analytics`). Only UI text (what users see on the site) is in Ukrainian — keep it that way. Everything else is English only: API messages, log messages (including script output), documentation (README, CLAUDE.md), code comments in every file type (TS, SCSS, config), commit messages, PR titles and PR descriptions.

## Commands

```bash
npm run dev        # dev server with Turbopack on http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint CLI with next/core-web-vitals over .js, .jsx, .mjs, .ts, .tsx and .mts, plus typescript-eslint over .ts, .tsx and .mts
npm run typecheck  # tsc --noEmit (strict; allowJs is false, so source files must be .ts, .tsx or .mts)
```

There is no automated test suite. ("Tests" in this codebase and in commit messages means the psychological quizzes stored in MongoDB.)

Requires `MONGODB_URI` in `.env.local`; `app/lib/mongodb.ts` throws at import time without it. Optional `MONGODB_DB` selects the database (defaults to `piznay_sebe`, the production one) — staging should point at a separate database.

The admin panel (see Architecture) reads these keys. Their values live only in Vercel env (Preview, scoped to the `staging` branch) and in `.env.local`: never in git, logs or responses.

| Key | What |
| --- | --- |
| `ADMIN_ENABLED` | `true` turns the admin panel on; anything else (production) makes `/admin`, `/api/admin/*` and `/api/auth/*` answer 404 |
| `ADMIN_GITHUB_LOGINS` | Comma-separated GitHub logins allowed in (case-insensitive); empty means nobody |
| `AUTH_SECRET` | Auth.js secret that signs the session cookie |
| `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` | The GitHub OAuth App's client id and secret |
| `MONGODB_DB` | Must be `piznay_sebe_staging` on staging, or the admin panel refuses to save |

Set up for staging: a GitHub OAuth App with callback `https://staging.piznay-sebe.pp.ua/api/auth/callback/github` (sign-in does not work on per-commit preview URLs). Give the Preview `MONGODB_URI` an Atlas user with `readWrite` on `piznay_sebe_staging` only, separate from the `.env.local` user that the backup and promote scripts need. If an allowlisted GitHub account is renamed, update `ADMIN_GITHUB_LOGINS` the same day: the old login can be claimed by someone else.

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
- Test content lives in MongoDB, not in git, so merging code does not move it. New or edited tests are made in the admin panel on staging (`https://staging.piznay-sebe.pp.ua/admin`), which writes to `piznay_sebe_staging`; they are checked on the staging site, prod is backed up (next item), then they are promoted with `npx --no -- tsx --env-file=.env.local scripts/promote-tests-to-prod.mts` (prints the plan; add `--apply` to write, `--only="<name or _id>,..."` to limit). It upserts by `_id` (the admin panel keeps a test's `_id` when it is edited), never deletes from prod, and counts a change of answer order as a change. `npx --no -- tsx --env-file=.env.local scripts/check-tests-schema.mts` checks every test in both databases against the admin panel's schema; it only reads.
- Before every `promote-tests-to-prod.mts --apply` (and any manual change to prod tests), back up prod first: `npx --no -- tsx --env-file=.env.local scripts/backup-prod-tests.mts <file outside the repo>`. The scripts are TypeScript run with `tsx` (a dev dependency); `--no` makes `npx` fail instead of downloading `tsx` when `npm install` has not been run. This is required: the Atlas cluster has no automated backups and git does not hold test content. The script only reads `piznay_sebe.tests`, writes canonical Extended JSON, and refuses paths inside the repository and existing files.

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

- **Mixed routers**: UI lives in the App Router (`app/`). The public API is a Pages Router route, `pages/api/test.ts` → `/api/test`. It is read-only: `GET` returns every document from the `tests` collection of `MONGODB_DB`; any other method gets `405` with `Allow: GET`. Tests reach prod only through `scripts/promote-tests-to-prod.mts`. The admin panel's endpoints are App Router route handlers under `app/api/admin/` and `app/api/auth/`.
- **Admin panel** (staging only): `/admin` lists, creates, edits and imports (JSON) tests in `piznay_sebe_staging`, with a preview that renders the public `Test` component. Sign-in is Auth.js (`app/lib/auth.ts`) with GitHub and JWT sessions (no database adapter), allowed only for `ADMIN_GITHUB_LOGINS`, re-checked on every request (`app/lib/adminSession.ts`). Layers: `middleware.ts` answers 404 when `ADMIN_ENABLED` is not `true`; `app/admin/layout.tsx` and every handler check the flag again; `app/admin/(protected)/layout.tsx` answers 401 / 403 through `unauthorized()` / `forbidden()` (`experimental.authInterrupts` in `next.config.ts`). Writes (`app/api/admin/tests`, `.../[id]`: `GET`, `POST`, `PUT`, no `DELETE`) go through `app/lib/adminRequest.ts` (same-origin `Origin`, JSON only, 1 MB, zod schema → 400 with field paths, `MONGODB_DB` must be `piznay_sebe_staging` → else 503) and `app/lib/adminTests.ts`, which writes only to the hard-coded `piznay_sebe_staging` (insert, replace by `_id`, names unique → 409). Admin pages are left out of Vercel Analytics (`app/components/site_analytics/SiteAnalytics.tsx`). Two editors saving the same test: the last save wins.
- **Mongo client**: `app/lib/mongodb.ts` exports a shared `clientPromise`, cached on `global` in development to survive HMR.
- **Single-page flow**: `app/page.tsx` is a client component holding `selectedTest` state. `Header` (logo click resets the selection) and `Main` sit under it. `Main` toggles the slide-out `TestList` (which fetches `/api/test` on mount) and renders `Test`, keyed by `selectedTest._id` so switching tests remounts it and resets its state.
- **Test document shape** (the `Test` type in `types/test.ts`, used by the API and the components; the zod schema `app/lib/testSchema.ts` validates every admin write and import):
  - `name`, `description`, `instruction`: strings
  - `questions`: array of `{ question, scale, answers }`, where `answers` maps answer label → integer score, in the order shown
  - legacy fields on some documents, kept unchanged and not shown: `title` (a string or `null`) and `questions[].currentAnswer` (a string)
  - `interpretation`: a single string; double spaces (`"  "`) are treated as paragraph breaks when rendered
  - Scores are summed per `scale`; per-scale results are shown only when there is more than one scale.

## Styling

- Each component has a co-located `*.module.scss` using BEM-style class names (`block__element`).
- Responsive breakpoints are SCSS mixins in `app/styles/media.scss` (`desktop`, `tablet`, `mobile`, `mobile-s`, plus `*-above` variants); import with `@use "../../../styles/media.scss" as *;` (relative path).
- Tailwind v4 is wired in via `app/styles/globals.scss` (`@use "tailwindcss"`) and PostCSS, but components rely almost entirely on SCSS modules.
- Path alias `@/*` maps to the repo root (`tsconfig.json`).
- SEO metadata, OG tags and Google site verification are in `app/layout.tsx`; `app/robots.txt` and `app/sitemap.xml` are static files.
