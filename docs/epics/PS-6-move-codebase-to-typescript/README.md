# PS-6 Move the codebase to TypeScript

- **Jira:** [PS-6](https://mortein43-1788434116115.atlassian.net/browse/PS-6)
- **Type:** Epic

> Last synced with Jira on 2026-10-20. Jira is the source of truth for status; update this file when the scope changes.

## Goal

The whole codebase is strict TypeScript, and every pull request is checked automatically: type errors, lint errors and broken builds are caught before merge instead of on staging or in production.

## Why / who benefits

- **Developers**: the test document shape (`questions`, `scale`, `answers`, `interpretation`) becomes a real type instead of something inferred from `Test.jsx`; mistakes show up in the editor and in CI.
- **Site visitors**: fewer runtime crashes like the empty-`questions` one.
- **Reviewers**: a green CI check on every PR replaces "I ran lint and build locally".

## In scope

- TypeScript setup: `tsconfig.json` with `strict: true` (replacing `jsconfig.json`, keeping `@/*`), `typescript-eslint`, `npm run typecheck`.
- A shared type for the test document used by the API, the Mongo client and the components.
- Migrate server code, scripts, config and UI to `.ts`/`.tsx`.
- CI: GitHub Actions running lint, typecheck and build on every PR into `staging` and `main`, required before merge.

## Out of scope

- Any behaviour or UI change.
- Runtime validation of request bodies or Mongo documents (zod or similar needs a separate decision).
- An automated test suite.
- Changing test documents in MongoDB.
- Upgrading Next.js / React major versions.

## Success criteria

- No `.js`/`.jsx` source files left in `app/`, `pages/`, `scripts/`.
- `strict: true`; `npm run typecheck` passes; no `any`, `@ts-ignore` or `@ts-expect-error` in source.
- The test document type is defined once and used everywhere.
- `npm run lint` uses `typescript-eslint` and passes; `npm run build` passes.
- CI runs lint, typecheck and build on every PR into `staging` and `main`, and branch protection requires it.
- Staging and production behave as before.

## Constraints

- **Starts after epic PS-1**, at least after [PS-2](../PS-1-prepare-project-for-further-work/tasks/PS-2-protect-production-data.md) (read-only API, backup script) and [PS-3](../PS-1-prepare-project-for-further-work/tasks/PS-3-fix-quiz-view-bugs-and-lint.md) (ESLint CLI) are merged — they touch the same files and the lint config.
- In Jira, PS-3 blocks PS-8 and PS-2 blocks PS-9.

## Risks

- `strict: true` may surface real bugs; anything beyond typing goes to follow-ups.
- `typescript-eslint` with Next 15.5 flat config may need extra setup.
- Branch protection is a repository setting the owner turns on.

## Tasks

In the order they should be done. PS-7 blocks the other two; PS-8 blocks PS-9.

| # | Key | Title | Type | Doc | Jira |
|---|---|---|---|---|---|
| 1 | PS-7 | Add epic and task docs to the repo (TypeScript epic) | Task | [doc](tasks/PS-7-add-epic-docs-to-repo.md) | [PS-7](https://mortein43-1788434116115.atlassian.net/browse/PS-7) |
| 2 | PS-8 | Set up strict TypeScript, the test document type and CI | Task | [doc](tasks/PS-8-set-up-strict-typescript-and-ci.md) | [PS-8](https://mortein43-1788434116115.atlassian.net/browse/PS-8) |
| 3 | PS-9 | Migrate all code to TypeScript | Task | [doc](tasks/PS-9-migrate-all-code-to-typescript.md) | [PS-9](https://mortein43-1788434116115.atlassian.net/browse/PS-9) |
