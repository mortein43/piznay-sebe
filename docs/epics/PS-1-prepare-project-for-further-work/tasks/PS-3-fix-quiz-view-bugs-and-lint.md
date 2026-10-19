# PS-3 Fix quiz view bugs and make lint actually check .jsx

- **Jira:** [PS-3](https://mortein43-1788434116115.atlassian.net/browse/PS-3)
- **Type:** Bug
- **Epic:** [PS-1](../README.md)
- **Mode:** bugfix · **Size:** M · **Tags:** [contracts], [clarity]
- **Depends on:** [PS-5](PS-5-add-epic-docs-to-repo.md) (Jira: blocked by)

> Last synced with Jira on 2026-10-19 (update the date on every re-sync). Jira is the source of truth for status.

## What and why

- The current ESLint setup ignores `.jsx` files: `npx eslint app/components/main/test/Test.jsx` reports "File ignored because no matching configuration was supplied". `next lint` is also deprecated and will be removed in Next.js 16.
- Because of that, a Rules-of-Hooks violation went unnoticed: `app/components/main/test/Test.jsx` returns early when no test is selected and calls `useState`/`useEffect` after that return.
- A test document with an empty or missing `questions` array crashes the quiz view: `Object.keys(currentQuestion.answers)` is read while `currentQuestion` is `null`.

## Acceptance criteria

_Boxes are not ticked here; status is tracked in Jira._

- [ ] `npm run lint` runs the ESLint CLI (no `next lint` deprecation warning) with `next/core-web-vitals` rules and actually lints `.js`, `.jsx` and `.mjs` files.
- [ ] `Test.jsx` calls all hooks unconditionally; `react-hooks/rules-of-hooks` reports nothing.
- [ ] A test with `questions: []` or without `questions` shows a Ukrainian message instead of crashing.
- [ ] Empty state ("Виберіть тест, щоб почати проходження"), taking a test and switching tests work as before; all existing test documents work unchanged.
- [ ] Lint findings outside `Test.jsx` that the new setup reveals are listed under Follow-ups in the PR, not fixed in it.
- [ ] `npm run build` passes.

## Regression guard

Manual scenario (no automated test suite): open the site, check the empty state, take a multi-scale test to the end, switch to another test mid-way, and open a staging test document with `questions: []`.
