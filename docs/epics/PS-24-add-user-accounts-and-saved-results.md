# PS-24 Add user registration and a personal account with saved test results

- **Jira:** [PS-24](https://mortein43-1788434116115.atlassian.net/browse/PS-24)
- **Type:** Feature
- **Epic:** none (standalone)
- **Depends on:** [PS-9](PS-6-move-codebase-to-typescript/tasks/PS-9-migrate-all-code-to-typescript.md) (epic PS-6)

> Last synced with Jira on 2026-10-21. Jira is the source of truth for status.

## What and why

Let visitors create an account and keep the results of the tests they take in a personal account («кабінет»):

- sign in / register with Auth.js (`next-auth`): Google OAuth and a passwordless email magic link sent through Resend; users, accounts, sessions and verification tokens are stored with `@auth/mongodb-adapter` in the configured database
- header: «Увійти» when signed out; the user's name, a link to the account and «Вийти» when signed in
- when a signed-in user finishes a test, its result is saved: user id (from the session), test `_id`, a snapshot of the test name, date, total score and per-scale scores. **Scores only — individual answers are never stored**
- an anonymous visitor who finishes a test sees «Увійдіть, щоб зберегти результат»; the pending result is kept only in the browser and saved once after sign-in
- account page: result history (newest first), result detail with the test's interpretation, and a progress chart of scores for tests taken more than once (plain SVG, no chart library)
- profile: name and email, edit the display name, sign out
- deletion: delete one result, or the whole account with all its data (hard delete, after confirmation)
- a Ukrainian privacy policy page (what is stored, why, how to delete it) and a consent line at sign-in that links to it; the owner provides or approves the text
- a feature flag (`ACCOUNTS_ENABLED`) so accounts are checked on staging first and switched on in production separately

Tests stay open to everyone; no test requires an account. `next-auth`, `@auth/mongodb-adapter`, `zod` and Resend are approved for this feature.

## How

Too big for one PR (roughly 2–3 weeks). Split into three subtasks, one PR each, run in this order with `/my-loop:run` (each only after the previous one's PR is merged into `staging`; linked in Jira as PS-25 blocks PS-26 blocks PS-27):

1. [PS-25](https://mortein43-1788434116115.atlassian.net/browse/PS-25) Sign in with Google and an email link, show the account in the header (Auth.js, the `ACCOUNTS_ENABLED` flag, header state, profile with display name and sign-out; the risky part goes first: OAuth and email links on staging behind Vercel Authentication)
2. [PS-26](https://mortein43-1788434116115.atlassian.net/browse/PS-26) Save test results to the account and show history, detail and progress (saving for signed-in users, the anonymous result saved after sign-in, history, detail with interpretation, SVG progress chart)
3. [PS-27](https://mortein43-1788434116115.atlassian.net/browse/PS-27) Delete results and the account, add the privacy policy and consent at sign-in

Decisions shared by the three subtasks are written in each one's «Shared decisions» section in Jira, so a run finds them in its ticket.

Then, by hand in this issue (not a my-loop task): turn accounts on in production: production Google consent screen published, Resend domain verified (SPF/DKIM) and `AUTH_EMAIL_FROM` on the domain, prod env in Vercel, a backup approach for user data, a check on staging, then `ACCOUNTS_ENABLED=true` in Production.

## Acceptance criteria

_Boxes are not ticked here; status is tracked in Jira._

- [ ] On staging, a visitor can register and sign in with Google and with an email link, and sign out; the header shows the right state.
- [ ] A signed-in user who finishes a test finds exactly one new result in their account, with the same total and per-scale scores as on the result screen.
- [ ] An anonymous visitor who finishes a test, clicks «Увійдіть, щоб зберегти результат» and signs in finds that result in their account exactly once.
- [ ] The account shows the history, the result detail with interpretation, and a progress chart for tests taken two or more times.
- [ ] A user can rename themselves, delete one result and delete their account; after account deletion nothing with their user id remains in `users`, `accounts`, `sessions` or `results`, and signing in again creates a fresh empty account.
- [ ] A user can never read, save or delete someone else's results: endpoints return 401 without a session and 403/404 for other users' data (checked by hand with two accounts).
- [ ] Every new API route checks the method and the session and validates the body with zod; invalid input gets 400.
- [ ] Tests remain playable without an account; with the flag off the site looks and works exactly as today.
- [ ] No test result or user data reaches Vercel Analytics or any third party other than Google (sign-in) and Resend (email address for the link); emails and user ids never appear in logs or error messages.
- [ ] `tests` and `/api/test` are untouched; nothing in `tests` is ever deleted.
- [ ] `AUTH_SECRET`, the Google client id/secret and `RESEND_API_KEY` live only in Vercel env and `.env.local`; the keys (without values) and the new collections are documented in `CLAUDE.md`.
- [ ] UI text is in Ukrainian; styling uses SCSS modules with BEM and the `media.scss` mixins, no Tailwind.
- [ ] The privacy policy page is live and linked from sign-in.
- [ ] `npm run lint` and `npm run build` pass (plus typecheck and CI once PS-9 has landed).

## Notes

- Start after PS-9 (TypeScript migration). Independent of [PS-22](PS-22-redesign-the-site.md) (redesign) and [PS-23](PS-23-add-admin-panel-on-staging.md) (admin). Whichever of PS-23 and this feature lands first sets up Auth.js; the other adds its provider to the same setup, never a second auth config. Keep visitor accounts separate from the admin allowlist.
- This is the first production write path from visitors into `piznay_sebe` (new collections `users`, `accounts`, `sessions`, `verification_tokens`, `results`), approved by the owner.
- Contract changes approved by the owner, written into the engineering rules on 2026-10-21 before any subtask runs: [privacy] scores (not answers) of signed-in users may be stored on the server; [reversibility] a user may hard-delete their own results and account (`tests` stays never-deleted).
- Risks: Resend DNS and the Google OAuth consent screen must be ready early (staging avoids both with Resend's test sender and a consent screen in Testing mode); OAuth and magic links must pass Vercel Authentication on staging; the Atlas free tier has no backups, so user data in prod is unprotected until a backup approach is decided; a saved result shows the test's current interpretation, which may have changed since.
- Out of scope: email + password, other OAuth providers, storing answers, sharing results, admin views of users/results, newsletters, the new design from PS-22.
- Open: how long to keep data of inactive accounts. Proposed in PS-27: kept until the user deletes it, no automatic deletion; the owner confirms it with the privacy policy text before PS-27 runs.
