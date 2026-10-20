# PS-23 Add an admin panel on staging to create, edit and import tests

- **Jira:** [PS-23](https://mortein43-1788434116115.atlassian.net/browse/PS-23)
- **Type:** Feature
- **Epic:** none (standalone)
- **Depends on:** [PS-9](PS-6-move-codebase-to-typescript/tasks/PS-9-migrate-all-code-to-typescript.md) (epic PS-6)

> Last synced with Jira on 2026-10-20. Jira is the source of truth for status.

## What and why

Add an admin panel at `/admin` on staging where the owner can add psychological tests to the database without editing MongoDB documents by hand:

- see the list of tests in `piznay_sebe_staging`
- create a test with a form: name, description, instruction, questions (question, scale, answers label → score), interpretation (paragraphs)
- edit an existing test, keeping its `_id` so the promotion script updates it in production
- import a test from JSON (paste or file), then edit it before saving
- preview and play the unsaved test with the public test component, including scoring and results

Sign-in is Auth.js (`next-auth`) with GitHub and an allowlist of GitHub logins from env. Validation uses one `zod` schema of the test document, shared by the browser and the server. Both libraries are approved for this feature.

Tests still reach production only through `scripts/promote-tests-to-prod.mjs`, after `scripts/backup-prod-tests.mjs`.

## How

The work runs end to end with no approval steps. The result is judged in a draft PR into `staging`.

## Acceptance criteria

_Boxes are not ticked here; status is tracked in Jira._

- [ ] On staging, a GitHub user from `ADMIN_GITHUB_LOGINS` can sign in and reach `/admin`; anyone else, including people with a Vercel share link, gets 401/403 from admin pages and admin endpoints.
- [ ] In production, `/admin` and admin endpoints return 404 (admin is enabled by an env flag set only for Preview/staging).
- [ ] The server refuses every admin write unless the configured database is `piznay_sebe_staging`; no code path writes to `piznay_sebe`.
- [ ] A new test can be created through the form and through JSON import, and appears in the public test list on staging.
- [ ] Editing an existing test keeps its `_id`, and `promote-tests-to-prod.mjs` (dry run) lists it as changed.
- [ ] Questions and answers can be added, removed and reordered in the form.
- [ ] Every admin write is validated with the zod schema; invalid input is rejected with 400, errors are shown next to the fields in Ukrainian, and nothing invalid is stored.
- [ ] Before the schema is enforced, a read-only check runs it against every document in `piznay_sebe_staging` and `piznay_sebe`; all pass, or the mismatches are listed in the PR.
- [ ] The preview gives the same total and per-scale scores as the public site for the same answers.
- [ ] No delete of tests anywhere; `/api/test` stays read-only (`GET` only).
- [ ] `AUTH_SECRET`, the GitHub client id/secret and the allowlist live only in Vercel env and `.env.local`; never logged or returned; the keys (without values) are documented in `CLAUDE.md`.
- [ ] Admin UI text is in Ukrainian; styling uses SCSS modules with BEM and the `media.scss` mixins, no Tailwind.
- [ ] `CLAUDE.md` and the Confluence Test Content Runbook describe the flow: admin on staging → check on staging → backup → promote.
- [ ] `npm run lint` and `npm run build` pass (plus typecheck and CI once PS-9 has landed).

## Notes

- Start after PS-9 (TypeScript migration); don't run in parallel with it or with [PS-22](PS-22-redesign-the-site.md), which touch the same files.
- Staging sits behind Vercel Authentication: check early that the GitHub OAuth callback on `https://staging.piznay-sebe.pp.ua` works through it. Per-commit preview URLs won't support sign-in, which is fine.
- Out of scope: any write to production from the web, a "publish to prod" button, deleting tests, roles or user management, the new design from PS-22.
- The planned user-registration feature ([PS-24](PS-24-add-user-accounts-and-saved-results.md)) may also use Auth.js; keep the admin allowlist separate from future visitor accounts.
