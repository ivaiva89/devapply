# NEXT_TASK.md

This file defines the **single active implementation task** for the
repository.

All coding agents (Codex CLI, Copilot, Cursor, etc.) must:

1.  Read this file before starting implementation.
2.  Follow rules defined in `AGENTS.md`.
3.  Implement exactly the task described below.
4.  After completing the task:
    -   Update `TASKS.md`
    -   Replace this file with the next task.

`NEXT_TASK.md` must always contain **exactly one active task**.

------------------------------------------------------------------------

# Task

Complete the **applications table view**.

The current table supports search, sort, and status filtering, but it still does not match the planned column set in `TASKS.md`.

------------------------------------------------------------------------

# Context

Relevant documentation:

docs/ARCHITECTURE.md\
docs/launch-checklist.md

Feature module:

features/applications

------------------------------------------------------------------------

# Requirements

Bring the applications table in line with the backlog definition.

Requirements:

-   add the missing `location` column
-   add the missing last-activity column or equivalent updated-at presentation
-   preserve existing search, sort, filter, edit, and delete flows
-   keep the table scoped to the authenticated user
-   update Storybook or preview coverage if the presentational table changes

------------------------------------------------------------------------

# Security Rules

All application table reads and mutations must enforce:

WHERE userId = authenticatedUserId

No application data may be visible across users.

------------------------------------------------------------------------

# Migration

No schema migration is expected.

------------------------------------------------------------------------

# Definition of Done

Task is complete when:

-   the applications table shows the planned columns
-   existing table behaviors still work
-   authenticated-user scoping is preserved
-   loading, empty, and error states remain intact
-   docs or stories are updated if the UI contract changes

------------------------------------------------------------------------

# Files likely to change

features/applications/components/applications-table.tsx\
features/applications/components/applications-table-client.tsx\
app/(app)/applications/page.tsx\
stories/features/applications-table.stories.tsx

------------------------------------------------------------------------

# After completion

1.  Update TASKS.md

2.  If additional work is discovered, add tasks under:

TASKS_AUDIT_FOLLOWUPS.md

3.  Replace this file with the next task.
