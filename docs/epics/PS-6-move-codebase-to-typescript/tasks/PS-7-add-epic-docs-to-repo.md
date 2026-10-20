# PS-7 Add epic and task docs to the repo (TypeScript epic)

- **Jira:** [PS-7](https://mortein43-1788434116115.atlassian.net/browse/PS-7)
- **Type:** Task
- **Epic:** [PS-6](../README.md)
- **Mode:** feature · **Size:** S · **Tags:** [clarity]
- **Depends on:** —
- **Blocks:** [PS-8](PS-8-set-up-strict-typescript-and-ci.md), [PS-9](PS-9-migrate-all-code-to-typescript.md)

> Last synced with Jira on 2026-10-20. Jira is the source of truth for status.

**This is the first task of the epic.** By convention, every epic starts with a task that copies the epic and its tasks from Jira into the repository.

## What and why

Add the documentation of epic PS-6 and its tasks to the repo as Markdown files:

```
docs/epics/PS-6-move-codebase-to-typescript/
├── README.md        # the epic
└── tasks/
    └── <task key>-<short-kebab-name>.md   # one per task of PS-6
```

## Acceptance criteria

_Boxes are not ticked here; status is tracked in Jira._

- [ ] `docs/epics/PS-6-move-codebase-to-typescript/README.md` contains the epic: goal, why, in/out of scope, success criteria, constraints (starts after PS-2 and PS-3), risks, and a table of its tasks in order with links to the task files and to Jira.
- [ ] `tasks/` has one `.md` file per task of PS-6 with Jira link, type, what and why, acceptance criteria as a checklist, dependencies.
- [ ] Content matches the Jira issues; English only; no secrets or Vercel share links.
- [ ] Follows the `docs/epics/` convention documented in `CLAUDE.md` (added by PS-5).
