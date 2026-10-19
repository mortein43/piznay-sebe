# PS-4 Move docs to a Confluence team space and replace the README

- **Jira:** [PS-4](https://mortein43-1788434116115.atlassian.net/browse/PS-4)
- **Type:** Task
- **Epic:** [PS-1](../README.md)
- **Mode:** feature (partly manual) · **Size:** S–M · **Tags:** [clarity]
- **Depends on:** [PS-5](PS-5-add-epic-docs-to-repo.md)

> Last synced with Jira on 2026-10-19. Jira is the source of truth for status.

## What and why

Make the documentation easy to find for anyone who joins the project.

- The project docs (page "Piznay Sebe" and its 4 children) live in the personal Confluence space «Андрей», which other people cannot see without separate access.
- `README.md` is still the `create-next-app` boilerplate and says nothing about the project.

The Atlassian connector cannot create Confluence spaces, so a site admin creates the team space manually; moving pages may also need the Confluence UI.

## Acceptance criteria

_Boxes are not ticked here; status is tracked in Jira._

- [ ] A team space «Пізнай себе» (key `PS`) exists and is linked to Jira project `PS`.
- [ ] All project pages (Piznay Sebe, Architecture & Data Model, Local Development, Development & Release Process, Test Content Runbook) live in the team space; the old personal-space pages are removed or point to the new ones.
- [ ] `README.md` has a short project description, the main commands and a link to the Confluence space; no `create-next-app` boilerplate left.
- [ ] No Vercel share links (`?_vercel_share=...`) or other secrets in the docs.
