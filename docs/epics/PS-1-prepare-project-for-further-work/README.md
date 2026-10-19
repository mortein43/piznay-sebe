# PS-1 Prepare the project for further work (close known tech debt)

- **Jira:** [PS-1](https://mortein43-1788434116115.atlassian.net/browse/PS-1)
- **Type:** Epic

> Last synced with Jira on 2026-10-19 (update the date on every re-sync). Jira is the source of truth for status; update this file when the scope changes.

## Goal

The project is safe and tidy enough to build new features on: production data cannot be changed through the public API, the quiz view does not crash on edge cases or break React rules, the tooling does not depend on deprecated commands, prod test content can be backed up before it is changed, and the documentation is easy to find for anyone who joins.

## Why / who benefits

- **Site visitors**: no one can inject or spoil tests in production through `POST /api/test`; the quiz page does not crash.
- **Developers**: a clean baseline — correct React code, a lint setup that survives Next.js 16, a real README, docs in a shared Confluence space.
- **Content editors**: a backup step before promoting tests to prod, so a bad promotion can be undone.

## In scope

- Make `/api/test` read-only (remove `POST`).
- Back up `piznay_sebe.tests` before `promote-tests-to-prod.mjs --apply`.
- Remove unneeded `console.*` calls.
- Migrate from deprecated `next lint` to the ESLint CLI and make it lint `.jsx` files.
- Fix React hooks called after an early return in `Test.jsx`.
- Fix the crash on a test without questions.
- Move Confluence docs to a team space; replace the boilerplate README.

## Out of scope

- New features or UI changes.
- An admin UI or any new way to write tests.
- TypeScript, a validation library or an automated test suite.
- Checking Vercel environment variables (done manually by the owner).
- Changing existing test documents in MongoDB.

## Success criteria

- `POST`/`PUT`/`DELETE` to `/api/test` on prod return `405`; `GET` still returns all tests.
- `Test.jsx` calls hooks unconditionally; `react-hooks/rules-of-hooks` passes on it.
- A test with empty or missing `questions` shows a Ukrainian message instead of crashing; existing tests still work.
- No `console.*` in client code; server code logs only error text.
- A documented command exports `piznay_sebe.tests` outside the repo, and the runbook requires it before `--apply`.
- `README.md` describes the project and links to Confluence.
- `npm run lint` runs the ESLint CLI, lints `.js`/`.jsx`/`.mjs` and passes.
- Confluence docs live in the team space `PS`.

## Risks

- Removing `POST` assumes nothing outside the site calls it.
- The ESLint migration may reveal existing lint errors.
- The Confluence team space must be created by a site admin.

## Tasks

In the order they should be done. PS-5 blocks the other three; PS-2, PS-3 and PS-4 do not depend on each other.

| # | Key | Title | Type | Doc | Jira |
|---|---|---|---|---|---|
| 1 | PS-5 | Add epic and task docs to the repo | Task | [doc](tasks/PS-5-add-epic-docs-to-repo.md) | [PS-5](https://mortein43-1788434116115.atlassian.net/browse/PS-5) |
| 2 | PS-2 | Protect production data: read-only API, backup step, log cleanup | Task | [doc](tasks/PS-2-protect-production-data.md) | [PS-2](https://mortein43-1788434116115.atlassian.net/browse/PS-2) |
| 3 | PS-3 | Fix quiz view bugs and make lint actually check .jsx | Bug | [doc](tasks/PS-3-fix-quiz-view-bugs-and-lint.md) | [PS-3](https://mortein43-1788434116115.atlassian.net/browse/PS-3) |
| 4 | PS-4 | Move docs to a Confluence team space and replace the README | Task | [doc](tasks/PS-4-move-docs-and-replace-readme.md) | [PS-4](https://mortein43-1788434116115.atlassian.net/browse/PS-4) |
