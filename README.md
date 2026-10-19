# Пізнай себе (piznay-sebe)

A Ukrainian-language website for taking psychological self-assessment tests. A visitor picks a test from the list, answers the questions one by one and gets a total score, per-scale scores (for multi-scale tests) and an interpretation.

## Links

| What | Where |
| --- | --- |
| Production | https://piznay-sebe.pp.ua |
| Staging | https://staging.piznay-sebe.pp.ua (protected by Vercel Authentication; ask the project owner for access) |
| Documentation | [Confluence space «Пізнай себе»](https://mortein43-1788434116115.atlassian.net/wiki/spaces/PS) |
| Task tracking | [Jira project `PS`](https://mortein43-1788434116115.atlassian.net/jira/software/projects/PS) |

Never commit Vercel share links (`?_vercel_share=...`) or other secrets: a share link works like a password.

## Tech stack

Next.js 15 (React 19) in plain JavaScript, SCSS modules, MongoDB, hosted on Vercel.

## Local setup

Requires Node.js 20.6+ and npm.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the repository root (it is git-ignored):

   ```bash
   MONGODB_URI=<connection string>
   MONGODB_DB=piznay_sebe_staging
   ```

   `MONGODB_URI` is required. `MONGODB_DB` is optional, but without it the app uses `piznay_sebe`, **the production database**, so set it to `piznay_sebe_staging` for local work.

3. Start the dev server and open http://localhost:3000:

   ```bash
   npm run dev
   ```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with Turbopack on http://localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (`next/core-web-vitals`) over `.js`, `.jsx` and `.mjs` |

There is no automated test suite. "Tests" in this project usually means the psychological quizzes stored in MongoDB.

## More documentation

- [Confluence space «Пізнай себе»](https://mortein43-1788434116115.atlassian.net/wiki/spaces/PS): architecture and data model, local development, development and release process, test content runbook.
- [`CLAUDE.md`](CLAUDE.md): the engineering rules (branches, deploys, conventions); the source of truth when docs disagree.
