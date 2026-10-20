# PS-9 Migrate all code to TypeScript

- **Jira:** [PS-9](https://mortein43-1788434116115.atlassian.net/browse/PS-9)
- **Type:** Task
- **Epic:** [PS-6](../README.md)
- **Mode:** feature · **Size:** M · **Tags:** [safety], [reversibility], [contracts], [clarity], [scope]
- **Depends on:** [PS-8](PS-8-set-up-strict-typescript-and-ci.md), [PS-7](PS-7-add-epic-docs-to-repo.md), [PS-2](../../PS-1-prepare-project-for-further-work/tasks/PS-2-protect-production-data.md) (epic PS-1)
- **Blocks:** [PS-23](https://mortein43-1788434116115.atlassian.net/browse/PS-23), [PS-24](https://mortein43-1788434116115.atlassian.net/browse/PS-24) (outside this epic)

> Last synced with Jira on 2026-10-20. Jira is the source of truth for status.

## What and why

Convert every source file to strict TypeScript using the shared test document type from PS-8, then remove `allowJs`. Behaviour must not change: this touches the production data paths (`pages/api/test`, `scripts/*`).

## Acceptance criteria

_Boxes are not ticked here; status is tracked in Jira._

- [ ] `pages/api/test`, `app/lib/mongodb`, `app/layout`, `app/page` and all components are `.ts`/`.tsx` and use the shared type from `types/test.ts`.
- [ ] Scripts in `scripts/` are TypeScript and run with `tsx` (Node 20 has no native TS support); `CLAUDE.md` and the Confluence Test Content Runbook show the new commands.
- [ ] Config files are TS where Next.js supports it (`next.config.ts`); the rest may stay `.mjs`.
- [ ] `allowJs` is removed; no `.js`/`.jsx` left in `app/`, `pages/`, `scripts/`; no `any`, `@ts-ignore` or `@ts-expect-error` in source.
- [ ] `npm run typecheck`, `npm run lint` and `npm run build` pass, and CI is green.
- [ ] Behaviour unchanged: `GET /api/test` returns all tests, other methods return `405`; promote prints the plan and `--apply` upserts; backup exports; the site's test list, taking a test, results and switching tests work on staging.
- [ ] `CLAUDE.md` and the my-loop contract say "strict TypeScript" instead of "plain JavaScript".
- [ ] Real bugs that `strict` reveals beyond what typing requires are listed under Follow-ups in the PR, not fixed in it.
