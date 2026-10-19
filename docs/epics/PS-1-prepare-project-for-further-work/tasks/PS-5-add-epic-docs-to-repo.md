# PS-5 Add epic and task docs to the repo

- **Jira:** [PS-5](https://mortein43-1788434116115.atlassian.net/browse/PS-5)
- **Type:** Task
- **Epic:** [PS-1](../README.md)
- **Mode:** feature · **Size:** S · **Tags:** [clarity], [scope]
- **Depends on:** —
- **Blocks:** [PS-2](PS-2-protect-production-data.md), [PS-3](PS-3-fix-quiz-view-bugs-and-lint.md), [PS-4](PS-4-move-docs-and-replace-readme.md)

> Last synced with Jira on 2026-10-19 (update the date on every re-sync). Jira is the source of truth for status.

**This is the first task of the epic.** By convention, every epic starts with a task that copies the epic and its tasks from Jira into the repository, so the specs are versioned next to the code.

## What and why

Add the documentation of epic PS-1 and all its tasks to the repo as Markdown files:

```
docs/epics/PS-1-prepare-project-for-further-work/
├── README.md                                  # the epic
└── tasks/
    ├── PS-5-add-epic-docs-to-repo.md
    ├── PS-2-protect-production-data.md
    ├── PS-3-fix-quiz-view-bugs-and-lint.md
    └── PS-4-move-docs-and-replace-readme.md
```

Naming: `docs/epics/<epic key>-<short-kebab-name>/`, task files `tasks/<task key>-<short-kebab-name>.md`. All files are `.md`.

## Acceptance criteria

_Boxes are not ticked here; status is tracked in Jira._

- [ ] `docs/epics/PS-1-prepare-project-for-further-work/README.md` contains the epic: goal, why / who benefits, in scope, out of scope, success criteria, risks, and a table of its tasks (key, title, type, link to the task file and to Jira), in the order they should be done.
- [ ] `tasks/` has one `.md` file per task of the epic (PS-5, PS-2, PS-3, PS-4) with: Jira key and link, type, what and why, acceptance criteria as a checklist, dependencies.
- [ ] The content matches the Jira issues; Jira stays the source of truth for status.
- [ ] `CLAUDE.md` documents the convention: the `docs/epics/` layout and naming, and that every epic's first task adds its docs to the repo.
- [ ] Everything is in English; no secrets or Vercel share links.
- [ ] `npm run lint` and `npm run build` pass.
