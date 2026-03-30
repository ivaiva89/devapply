# AGENTS.md

Guidelines for AI coding agents and contributors.

This repository is optimized for AI-assisted development.

Control files:

-   AGENTS.md --- implementation rules
-   TASKS.md --- execution backlog
-   NEXT_TASK.md --- single active task
-   AI_WORKFLOW.md --- workflow
-   REPO_CONTEXT.md --- compressed project context

------------------------------------------------------------------------

## Required reading order

Before implementing any change agents must read:

1.  AGENTS.md
2.  REPO_CONTEXT.md
3.  NEXT_TASK.md

After completing work agents must:

-   update TASKS.md
-   update NEXT_TASK.md
-   add follow-up tasks if necessary
-   reconcile affected setup or workflow docs with the real codebase state
-   if billing-related docs or code change, also review pricing, webhook,
    env, and entitlement docs in the same pass
-   if reusable UI or major screen-level presentation changes, also
    review Storybook coverage and `app/(v0)/preview/page.tsx`

------------------------------------------------------------------------

## Product

DevApply is a SaaS for developers.

Product evolution:

1.  Job Application Tracker
2.  Developer Job CRM
3.  Developer Career Toolkit

Current goal:

Ship a production-quality MVP of the Job Application Tracker.

------------------------------------------------------------------------

## MVP Scope

Build:

-   authentication
-   dashboard
-   applications CRUD
-   applications table
-   kanban pipeline
-   reminders
-   resume attachments
-   analytics
-   billing

Do NOT build yet:

-   resume builder
-   cover letter generator
-   salary comparison
-   interview prep AI
-   recruiter CRM
-   email sync
-   browser extension
-   mobile app

Prefer smaller scope.

------------------------------------------------------------------------

## Architecture

Architecture style: Modular Monolith

Domain logic must live inside:

features/

Examples:

-   features/applications
-   features/reminders
-   features/auth
-   features/billing

Billing guidance:

-   Polar is the planned MVP billing provider
-   billing code should stay isolated inside `features/billing`
-   entitlements in the app must read normalized internal plan state,
    not provider redirect params
-   provider-specific checkout and webhook handling must not leak across
    the rest of the app

UI workflow guidance:

-   new reusable UI components must ship with Storybook stories
-   major presentational feature components should have Storybook stories
    when they are backend-agnostic
-   server-bound components should be split into pure presenters and thin
    wrappers before Storybook coverage is added
-   Storybook and `/preview` must use mock data only, never auth,
    Prisma, or server-only modules
-   prefer shared fixtures from `lib/mocks/ui-fixtures.ts` over repeated
    inline mock data

------------------------------------------------------------------------

## Security rule

Every entity must belong to a user.

All queries must enforce:

WHERE userId = authenticatedUserId

Cross-user data exposure is forbidden.

------------------------------------------------------------------------

## Definition of Done

A task is complete when:

-   code compiles
-   TypeScript passes
-   lint passes
-   ownership rules enforced
-   UI loading/empty/error states exist
-   TASKS.md updated

If implementation is partial:

-   document the gap
-   add a follow-up task
-   do not leave billing or env changes undocumented
