# Architecture

## Overview

DevApply uses a **modular monolith architecture**.

The application runs as a single deployable system, but the codebase is
organized into clear domain modules with explicit boundaries.

This architecture supports:

- fast MVP development
- simpler deployment and operations
- easier reasoning for AI coding agents
- clean evolution into a larger developer career toolkit

## Architectural Principles

- Server-first architecture
- Business logic lives on the server
- Validation required for all write operations
- Every tenant-scoped query must filter by authenticated user
- Feature modules should remain loosely coupled
- Shared infrastructure separated from domain logic

## Technology Stack

### Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Storybook for isolated UI development

### Backend

- Next.js Server Actions
- Route Handlers for webhooks and external callbacks
- Prisma ORM
- PostgreSQL

### Platform & Integrations

- Vercel for hosting
- Neon for PostgreSQL
- Polar as the planned MVP billing provider
- Resend for transactional email
- PostHog for product analytics
- Private object storage (Vercel Blob or S3-compatible) for resume uploads

Deployment notes:

- Vercel builds use `npm run build:vercel`
- Prisma runtime uses `DATABASE_URL`
- Prisma CLI and migrations use `DIRECT_URL` and `SHADOW_DATABASE_URL`
- app typography uses a bundled system font stack from
  `app/globals.css`, so builds do not depend on live Google font
  fetching

## Folder Structure

- `app/` — Next.js routes, layouts, and page composition
- `shared/` — shared UI primitives, layout helpers, lib utilities, and mocks
- `entities/` — domain display/model layers such as `entities/application`
- `widgets/` — composed screen sections such as app shell, dashboard, and pipeline
- `features/` — feature actions, server logic, and feature-local UI wrappers
- `features/*/server/` — feature-local server actions and services
- `.storybook/` — Storybook configuration
- `stories/` — Storybook stories for shared, entity, widget, and feature UI
- `prisma/` — database schema and migrations
- `docs/` — project documentation
- `tests/` — targeted automated tests

## Domain Modules

applications --- CRUD for job applications and status tracking\
pipeline --- visual workflow of applications\
dashboard --- overview metrics and activity summaries\
resumes --- resume upload and version management\
reminders --- follow-up reminders and due dates\
billing --- billing abstraction, hosted checkout, webhook sync, and plan state\
analytics --- product event tracking and usage metrics\
auth --- authentication and session access

## Feature Module Convention

Preferred feature layout:

- `features/<feature>/components` — feature-owned wrappers and action-oriented UI
- `features/<feature>/server` — server actions and data/services
- `features/<feature>/schemas` — Zod validation when needed
- `features/<feature>/types.ts` — local TypeScript types
- `features/<feature>/utils` — pure helpers

Current UI layering:

- `shared/ui` — low-level primitives such as button, input, select, dialog
- `shared/*` — shared layout, form, and utility helpers
- `entities/*` — domain-level display/model pieces
- `widgets/*/ui` — composed screen sections
- `features/*/components` — feature-specific wrappers around auth, server actions, or client state

## Rendering Strategy

- Server Components by default
- Client Components only when interactivity requires them
- Server Actions for mutations
- Route Handlers for webhooks and external integrations

## Data Flow

UI → Server Action / Route Handler → Auth Check → Validation →
Authorization → Plan Enforcement → Service Logic → Prisma → PostgreSQL →
Revalidation / Side Effects

Possible side effects:

- analytics events
- transactional email
- billing synchronization
- Blob object storage writes for resume uploads

## Security Rules

- Every request must be authenticated unless explicitly public
- All tenant data must be scoped to the authenticated user
- Ownership must be verified for all mutations
- Sensitive logic enforced server-side
- Client checks are UX only, not security

## Billing & Entitlements

Free plan example limits:

- 10 applications
- 1 resume
- 3 reminders

Rules:

- plan limits enforced server-side
- Polar hosted checkout is the planned MVP purchase flow
- webhook events must synchronize purchases/subscriptions back into the
  database
- normalized internal plan state is the source of truth for
  entitlements inside the app
- provider-specific billing identifiers should be stored separately so
  support/debugging does not depend only on external customer ID
  mapping
- UI may display limits but server enforcement is authoritative

Recommended billing flow:

- app UI triggers a server-side checkout initiation action
- the billing module redirects into an internal hosted-checkout entry
  point
- the checkout entry point delegates to Polar's hosted checkout flow
- Polar webhook events update normalized subscription state in Prisma
- provider-specific linkage such as customer and subscription IDs is
  persisted separately from app-level plan state
- `app/api/webhooks/polar/route.ts` verifies webhook signatures before
  changing plan state
- app feature gates read internal plan state such as `FREE` or `PRO`
- provider-specific code remains isolated in `features/billing`
- signed-in users can open the hosted customer portal from settings
  when a matching Polar customer exists

Environment guidance:

- keep sandbox and production billing credentials separate
- current billing checkout env names are `POLAR_ACCESS_TOKEN`,
  `POLAR_PRODUCT_ID_PRO`, and `POLAR_ENVIRONMENT`
- `POLAR_WEBHOOK_SECRET` is required for webhook-driven subscription
  sync
- local sandbox checkout and webhook testing steps live in
  `docs/polar-sandbox-setup.md`

## Future Evolution

The architecture should support expansion into a **Developer Career
Toolkit**, including:

- company/contact CRM
- interview preparation tracker
- cover letter generator
- resume builder
- salary insights
