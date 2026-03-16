# REPO_CONTEXT.md

Compressed repository context for AI coding agents.

This file exists to give AI agents a fast, low-ambiguity understanding of the
project without requiring them to reconstruct intent from many scattered files.

It should stay short, concrete, and current.

---

## Project Summary

DevApply is a SaaS product for developers.

Current product stage:

1. Job Application Tracker
2. Developer Job CRM
3. Developer Career Toolkit

Current active goal:

Ship a production-quality MVP of the Job Application Tracker.

This is a real SaaS product, not a demo project.

---

## MVP Scope

Build now:

- authentication
- dashboard
- applications CRUD
- applications table
- kanban pipeline
- reminders
- resume attachments
- basic analytics
- billing and plan limits

Do not build unless explicitly requested:

- resume builder
- cover letter generator
- salary comparison
- interview prep AI
- recruiter CRM
- email sync
- browser extension
- mobile app

Rule:

Prefer smaller MVP scope.

---

## Core Product User

Primary user:

A software developer actively managing job applications.

Core user need:

Track applications, manage follow-ups, attach resumes, and monitor progress in a
clean, fast workflow.

---

## Product Principles

The product should feel:

- clean
- professional
- efficient
- developer-focused
- low-friction

Avoid:

- cluttered UI
- playful branding
- overbuilt flows
- unnecessary configuration

---

## Architecture Summary

Architecture style:

Modular monolith.

Meaning:

- single deployable application
- clear domain boundaries in code
- feature-based organization

Reason:

- faster MVP delivery
- easier reasoning
- easier AI-assisted development
- simpler deployment
- future extraction possible if needed

---

## Tech Stack

Frontend:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Storybook for isolated UI development

Backend:

- Next.js server actions / route handlers
- Prisma ORM
- PostgreSQL

Infrastructure:

- Vercel
- Neon
- Vercel Blob
- Stripe

---

## Code Organization

Expected structure:

- app/ → routes and layouts
- components/ui/ → low-level primitives
- components/design/ → reusable presentational building blocks
- features/ → domain modules
- lib/ → shared utilities
- stories/ → Storybook coverage for ui/design/feature presenters

Important rule:

Domain logic should live inside feature modules, not in random route files.

Examples:

- features/applications
- features/auth
- features/reminders
- features/billing

UI workflow:

- Storybook is the default environment for isolated component work
- `app/(v0)/preview/page.tsx` is the in-app mock composition route
- stories must not import Prisma, Clerk, auth server modules, or `server-only`

---

## Data Ownership Rules

Every business entity must belong to a user.

All reads and writes must enforce ownership.

Required rule:

WHERE userId = authenticatedUserId

No cross-user visibility.
No cross-user mutation.

This is a non-negotiable rule.

---

## Current High-Level Domain Model

Main entities:

- User
- Application
- Interview
- Resume
- ApplicationAttachment
- Reminder

Application is the core entity.

Typical Application fields:

- company
- role
- location
- source
- status
- salaryMin
- salaryMax
- currency
- jobUrl
- notes
- appliedDate
- lastActivityAt

Application statuses:

- WISHLIST
- APPLIED
- INTERVIEW
- OFFER
- REJECTED

---

## UI Direction

The UI should resemble modern developer SaaS products.

Desired qualities:

- calm
- premium
- minimal
- structured
- fast to scan

Reference level of polish:

- Linear
- Vercel
- GitHub
- Raycast

Avoid:

- flashy effects
- cartoonish visuals
- excessive gradients
- crowded pages

---

## Implementation Priorities

Priority order for MVP:

1. project foundation
2. authentication
3. dashboard
4. applications CRUD
5. applications table
6. kanban pipeline
7. reminders
8. resume attachments
9. basic analytics
10. billing
11. launch preparation

---

## AI Workflow Rules

AI agents must use the control files at repo root.

Control files:

- AGENTS.md → implementation rules
- TASKS.md → backlog
- NEXT_TASK.md → single active task
- AI_WORKFLOW.md → workflow process
- REPO_CONTEXT.md → compressed project context

Required workflow:

1. Read AGENTS.md
2. Read REPO_CONTEXT.md
3. Read NEXT_TASK.md
4. Implement only the active task
5. Update TASKS.md
6. Update NEXT_TASK.md

---

## Documentation Priority

When documents conflict, follow:

1. TASKS.md
2. AGENTS.md
3. REPO_CONTEXT.md
4. docs/PRODUCT.md
5. docs/ARCHITECTURE.md
6. docs/ROADMAP.md

TASKS.md is the implementation source of truth.

REPO_CONTEXT.md is a compressed orientation file, not a replacement for detailed documentation.

---

## Definition of Good AI Behavior

Good agent behavior:

- implement only the current task
- keep changes scoped
- follow existing architecture
- preserve type safety
- preserve ownership rules
- update task tracking files
- add follow-up tasks when necessary

Bad agent behavior:

- silent scope expansion
- unrelated refactors
- random dependency additions
- introducing CRM/toolkit features early
- skipping task file updates

---

## When To Update This File

Update REPO_CONTEXT.md when any of these change:

- product scope
- architecture direction
- stack decisions
- domain model
- implementation priorities
- core UX direction

Do not update this file for tiny implementation details.

---

## Why This File Exists

This file reduces AI misunderstanding by giving a short, current summary of:

- what the product is
- what is in scope
- how the repo is organized
- what rules are non-negotiable
- what the AI should work on next

It is an orientation layer for AI agents.
