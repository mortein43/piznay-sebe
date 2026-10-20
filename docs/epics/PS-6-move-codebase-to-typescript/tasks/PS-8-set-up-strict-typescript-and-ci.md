# PS-8 Set up strict TypeScript, the test document type and CI

- **Jira:** [PS-8](https://mortein43-1788434116115.atlassian.net/browse/PS-8)
- **Type:** Task
- **Epic:** [PS-6](../README.md)
- **Mode:** feature · **Size:** M · **Tags:** [clarity], [contracts]
- **Depends on:** [PS-7](PS-7-add-epic-docs-to-repo.md), [PS-3](../../PS-1-prepare-project-for-further-work/tasks/PS-3-fix-quiz-view-bugs-and-lint.md) (epic PS-1)
- **Blocks:** [PS-9](PS-9-migrate-all-code-to-typescript.md)

> Last synced with Jira on 2026-10-20. Jira is the source of truth for status.

## What and why

Lay the foundation for the TypeScript migration and add automatic checks on every PR, so the migration itself (next task) is verified by CI. No source file is converted here except what the setup needs; `allowJs` keeps the existing JavaScript working.

## Acceptance criteria

_Boxes are not ticked here; status is tracked in Jira._

- [ ] `typescript` and needed `@types/*` are dev dependencies; `tsconfig.json` with `strict: true`, `allowJs: true` (temporary, for the migration) and the `@/*` alias replaces `jsconfig.json`.
- [ ] The ESLint config uses `typescript-eslint` on top of `next/core-web-vitals`; `npm run lint` passes.
- [ ] `npm run typecheck` (`tsc --noEmit`) exists and passes.
- [ ] `types/test.ts` defines the test document (`Test`, `Question`, scale scores); fields that existing Mongo documents may lack are optional (e.g. `questions?`).
- [ ] `.github/workflows/ci.yml` runs `npm ci`, lint, typecheck and build (with a dummy `MONGODB_URI`; the build never connects) on pull requests into `staging` and `main`; it is green on this task's own PR.
- [ ] The PR body explains how the owner makes the check required in branch protection for `staging` and `main`.
- [ ] No behaviour change; `npm run build` passes.
