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
