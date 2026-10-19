# PS-2 Protect production data: read-only API, backup step, log cleanup

- **Jira:** [PS-2](https://mortein43-1788434116115.atlassian.net/browse/PS-2)
- **Type:** Task
- **Epic:** [PS-1](../README.md)
- **Mode:** feature · **Size:** M · **Tags:** [safety], [reversibility], [privacy]
- **Depends on:** [PS-5](PS-5-add-epic-docs-to-repo.md) (Jira: blocked by)

> Last synced with Jira on 2026-10-19 (update the date on every re-sync). Jira is the source of truth for status.

## What and why

Close the ways production data can be changed or lost, and stop logging noise.

- `POST /api/test` accepts any body with no auth or validation and writes it to the production `piznay_sebe.tests` collection. The site never uses it (tests are edited in `piznay_sebe_staging` and promoted with `scripts/promote-tests-to-prod.mjs`), so the endpoint becomes read-only.
- The Atlas cluster is a free tier without automated backups, and git does not hold test content, so there must be a backup step before promoting tests to prod.
- Client code and the Mongo client log debug messages that are not needed.

## Acceptance criteria

_Boxes are not ticked here; status is tracked in Jira._

- [ ] `pages/api/test.js` handles only `GET`; `POST`, `PUT`, `DELETE` and other methods return `405`; `GET` still returns all tests and the site works.
- [ ] `scripts/backup-prod-tests.mjs` exports `piznay_sebe.tests` to a JSON file at a path given as an argument, outside the repository; it only reads the database.
- [ ] The Test Content Runbook (Confluence) and `CLAUDE.md` make the backup a required step before `promote-tests-to-prod.mjs --apply`.
- [ ] No `console.*` in `app/components/`, `app/page.js`, `app/layout.js`; no info logs in `app/lib/mongodb.js`; `pages/api/test.js` logs only the error text.
- [ ] Confluence "Architecture & Data Model" no longer documents `POST`; the related known limitation is removed.
- [ ] `npm run lint` and `npm run build` pass.
- [ ] The API change is reviewed by the project owner before merge.
