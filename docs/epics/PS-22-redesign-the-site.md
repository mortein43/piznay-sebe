# PS-22 Redesign the site with Claude Design and implement the new design

- **Jira:** [PS-22](https://mortein43-1788434116115.atlassian.net/browse/PS-22)
- **Type:** Feature
- **Epic:** none (standalone)

> Last synced with Jira on 2026-10-20. Jira is the source of truth for status.

## What and why

Create a new visual design for the whole site (header and logo, test list, test flow, results) in Claude Design, then implement it in the code.

The design must fit what the site is: a place for self-assessment, where people take psychological tests to learn about themselves. The look and feel (logo, imagery, colors, typography, tone) should reflect psychology and self-reflection, not a generic quiz or entertainment site.

The design must also:

- **Show a progress bar while a test is being taken**, so the user always sees how far through the test they are (e.g. how many questions are answered out of the total).
- **Use a soft, gentle color palette**: muted pastel tones, no harsh, saturated or high-contrast accent colors. Text must stay readable against these colors.

Within these requirements, the visual direction is open: there are no other constraints on style, layout or colors.

## How

The work runs end to end with no approval steps. The result is judged in a draft PR into `staging`.

## Acceptance criteria

_Boxes are not ticked here; status is tracked in Jira._

- [ ] The PR links the design and includes desktop and mobile screenshots.
- [ ] The design reflects the site's subject (self-assessment through psychological tests), and the PR explains how.
- [ ] Every screen uses the new design.
- [ ] While taking a test, a progress bar shows how far through the test the user is, and it updates as questions are answered.
- [ ] The color palette is made of soft, gentle (pastel) colors, and text stays readable on them.
- [ ] Current behavior still works: choosing a test, answering questions, per-scale scores, interpretation paragraphs.
- [ ] UI text stays in Ukrainian.
- [ ] The layout works at all existing breakpoints.
- [ ] `npm run lint` and `npm run build` pass.
- [ ] No changes to the API or to MongoDB data.

## Notes

- Don't run this in parallel with [PS-9](PS-6-move-codebase-to-typescript/tasks/PS-9-migrate-all-code-to-typescript.md) (TypeScript migration): both touch the same files.
