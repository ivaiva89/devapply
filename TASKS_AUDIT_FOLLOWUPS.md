# TASKS_AUDIT_FOLLOWUPS.md

Follow-up work discovered during the repository audit.

## Product / MVP gaps

- Add the missing `location` and `last activity` columns to the applications table.
- Implement analytics charts for applications per status and applications over time.
- Complete billing synchronization so checkout completion updates the user plan.

## UI / Design system

- Migrate remaining stone-colored feature screens to semantic theme tokens and shared design components.
- Add stories for reminder and resume presentation components.
- Remove or reconcile duplicated dashboard KPI components.

## Storybook

- Add stories for kanban columns/cards and dashboard list sections with mock-only props.
- Add a repo guardrail for Storybook stories that import server-only modules.
- Document the preferred split between pure presenters and server-bound wrappers.

## Documentation

- Keep `TASKS.md` and `NEXT_TASK.md` synchronized after every implementation pass.
- Add contributor guidance on when to use `/preview` versus Storybook.

## Infrastructure

- Remove the build dependency on live Google Fonts for restricted-network environments.
- Verify Vercel deployment wiring beyond build-command documentation.

## Auth / Billing / Data model

- Implement Stripe billing portal access from settings.
- Add Stripe webhooks for subscription status and plan updates.
- Consolidate repeated server-side validation patterns where feature modules duplicate input parsing.

## Technical debt

- Reconcile the documented root `server/` folder expectation with the actual feature-local `server/` pattern.
- Decide whether `dashboard-kpi-grid.tsx` should be deleted or kept as a compatibility wrapper.
