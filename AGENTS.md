# AGENTS.md

## Project identity

This repository contains a SaaS product for developers.

Product evolution:

1.  Job Application Tracker
2.  Developer Job CRM
3.  Developer Career Toolkit

Current priority:

Build and ship a **production-quality MVP** of the **Job Application
Tracker** as quickly as possible, without overengineering.

This is not a demo app. This is intended to become a real SaaS product.

------------------------------------------------------------------------

## Current product scope

The current MVP includes only:

-   authentication
-   dashboard
-   applications CRUD
-   applications table
-   kanban pipeline
-   reminders
-   resume attachments
-   basic analytics
-   billing and plan limits

Do **not** build yet unless explicitly requested:

-   resume builder
-   cover letter generator
-   salary comparison tool
-   interview prep AI
-   recruiter CRM
-   email sync
-   browser extension
-   mobile app

When in doubt, prefer a smaller MVP scope.

------------------------------------------------------------------------

## Primary product goal

Help developers manage job applications in a structured, fast,
low-friction workflow.

The product should feel:

-   clean
-   professional
-   efficient
-   trustworthy
-   developer-focused

------------------------------------------------------------------------

## Core user

The primary user is a developer applying to many jobs who needs to:

-   track application status
-   manage follow-ups
-   attach resume versions
-   review progress in a pipeline
-   understand job-search funnel metrics

Optimize for users managing **20 to 200 applications**.

------------------------------------------------------------------------

## Technical stack

Frontend: - Next.js App Router - React - TypeScript - Tailwind CSS -
shadcn/ui

Backend: - Next.js Server Actions and/or Route Handlers - Prisma -
PostgreSQL

Infrastructure: - Stripe - Resend - PostHog

------------------------------------------------------------------------

## High-level architecture rules

This project uses a **modular monolith** architecture.

That means:

-   one deployable application
-   clear feature/domain boundaries
-   minimal infrastructure complexity
-   code organized for future growth

Do not introduce microservices, queues, event buses, or other
distributed-system complexity unless explicitly requested.

------------------------------------------------------------------------

## Repository structure expectations

Organize code by feature/domain first.

Expected feature areas include:

-   applications
-   pipeline
-   dashboard
-   resumes
-   reminders
-   billing
-   analytics
-   auth

Preferred structure:

-   `app/` for routing and page composition
-   `components/` for shared UI
-   `features/` for domain modules
-   `lib/` for infrastructure and integrations
-   `prisma/` for schema and migrations
-   `tests/` for tests
-   `docs/` for project documentation

Within each feature, prefer this structure:

-   `components/`
-   `schemas/`
-   `server/`
-   `utils/`
-   `types.ts`

------------------------------------------------------------------------

## Coding standards

### General

-   Use strict TypeScript
-   Avoid `any`
-   Prefer explicit names over clever abstractions
-   Prefer readability over terseness
-   Keep functions focused
-   Keep modules cohesive
-   Avoid large, multipurpose files

### Components

-   Keep components presentational where possible
-   Do not place database logic in UI components
-   Do not place business logic in page components
-   Prefer composition over deeply nested conditional JSX
-   Add loading, empty, and error states

### Server logic

-   Put business logic in feature server modules
-   Put validation close to mutations and inputs
-   Keep database access server-side only
-   Do not trust client input
-   Enforce auth and ownership checks on every query/mutation

### Validation

-   Use Zod for input validation
-   Validate all user input
-   Return actionable validation feedback where appropriate
-   Never silently skip validation

------------------------------------------------------------------------

## Data and auth rules

These are strict.

-   Every query must be scoped to the authenticated user
-   Every mutation must verify resource ownership
-   Never expose data across users
-   Never rely only on client-side checks
-   Never weaken auth for convenience

If a resource belongs to a user, ownership must be enforced server-side.

------------------------------------------------------------------------

## Billing and plan enforcement rules

Billing uses plan-based access.

Free plan limits:

-   30 applications
-   1 resume
-   3 reminders

Pro plan removes these limits.

Rules:

-   enforce all plan limits server-side
-   UI prompts are helpful, but not the source of truth
-   do not allow limit bypasses through direct requests
-   make upgrade triggers obvious but not spammy

------------------------------------------------------------------------

## Database rules

Use Prisma with PostgreSQL.

General expectations:

-   schema changes must be deliberate
-   explain why schema changes are needed
-   add indexes for common filters
-   preserve data integrity
-   prefer clear relations over premature abstraction

Expected high-use filters include:

-   `userId`
-   `status`
-   `createdAt`
-   `updatedAt`

Do not change schema casually.

------------------------------------------------------------------------

## Dependency rules

Dependencies should be added conservatively.

-   Do not add a dependency unless it clearly improves delivery
-   Prefer existing project patterns first
-   Prefer built-in platform capabilities when reasonable
-   Explain why a new dependency is necessary
-   Avoid trendy dependencies with weak justification

------------------------------------------------------------------------

## When implementing a task

Before changing code:

1.  inspect the existing codebase
2.  identify current conventions
3.  reuse existing patterns
4.  keep the solution within current MVP scope

During implementation:

1.  keep changes focused
2.  avoid unrelated edits
3.  validate edge cases
4.  enforce auth and plan limits

After implementation:

1.  summarize what changed
2.  list files changed
3.  mention env or migration changes
4.  note follow-up improvements
5.  mention risks or tradeoffs

------------------------------------------------------------------------

## Guardrails

Never do the following unless explicitly instructed:

-   build beyond the current MVP scope
-   introduce microservices
-   weaken authentication checks
-   bypass plan enforcement
-   add dependencies casually
-   refactor unrelated parts of the codebase
-   ship placeholder logic as if it were production-ready

------------------------------------------------------------------------

## Final instruction

Act like a senior engineer working inside an early-stage SaaS codebase:

-   protect scope
-   keep architecture clean
-   move fast carefully
-   make changes that another engineer can easily understand and extend
