# Developer Job Application Tracker

A SaaS product designed for developers to manage job applications, track
interview progress, organize resume versions, and schedule follow‑ups.

## Product Vision

This project evolves in three stages:

1.  Job Application Tracker
2.  Developer Job CRM
3.  Developer Career Toolkit

The final platform connects:

- Job Application Tracker
- Resume Builder
- Cover Letter Generator
- Interview Preparation Tracker
- Salary Comparison Tool

## Current Focus

The current milestone is **Stage 1: Job Application Tracker MVP**.

Features included:

- authentication
- dashboard
- application CRUD
- applications table
- kanban pipeline
- reminders
- resume attachments
- analytics basics
- billing and plan limits

## Tech Stack

Frontend - Next.js App Router - React - TypeScript - Tailwind CSS -
shadcn/ui

Backend - Next.js Server Actions - Prisma ORM - PostgreSQL

Infrastructure - Vercel - Polar (planned billing provider) - Resend - PostHog

## Development

Install dependencies

npm install

Configure environment variables

- Copy `.env.example` to `.env.local`
- Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
- Add `BLOB_READ_WRITE_TOKEN` to enable resume uploads via Vercel Blob
- Add billing env vars for the hosted checkout path:
  `POLAR_ACCESS_TOKEN`, `POLAR_PRODUCT_ID_PRO`, and `POLAR_ENVIRONMENT`
- Add `POLAR_WEBHOOK_SECRET` to verify incoming Polar webhooks
- Keep `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL`, and the Clerk redirect URLs aligned with `/sign-in`, `/sign-up`, and `/dashboard`
- Restart `npm run dev` after changing Clerk environment variables
- For local Polar billing setup, follow
  `docs/polar-sandbox-setup.md`

Run database migrations

npx prisma migrate dev

Run seed data

npx prisma db seed

Start development

npm run dev

Check formatting

```bash
npm run format:check
```

Apply formatting

```bash
npm run format
```

Build for Vercel

```bash
npm run build:vercel
```

Backfill missing Polar linkage for older Pro users

```bash
npm run billing:backfill-polar-linkage -- --user-id <userId>
npm run billing:backfill-polar-linkage -- --user-id <userId> --write
```

Deployment reference:

- `docs/vercel-build.md`

Start Storybook

```bash
npm run storybook
```

Build Storybook

```bash
npm run storybook:build
```

## UI development workflow

- Use Storybook for isolated component work in `stories/ui`, `stories/design`, and `stories/features`
- Use `app/(v0)/preview/page.tsx` for in-app mock compositions
- Reuse shared placeholder data from `lib/mocks/ui-fixtures.ts`
- Review `docs/STORYBOOK_PREVIEW_PLAN.md` when adding or auditing UI coverage
- Keep stories backend-agnostic: no Prisma, Clerk, auth server modules, or `server-only` imports
- ESLint now enforces the backend-import guardrail for `stories/`,
  `app/(v0)/preview`, and `lib/mocks`
- When feature UI mixes rendering with auth, server actions, or session
  wiring, split it into a pure presenter plus a thin wrapper before
  adding Storybook or `/preview` coverage

Use Storybook when:

- you are developing or reviewing one reusable component in isolation
- you need multiple visual states for the same component
- the goal is prop-driven UI coverage, not full-screen composition

Use `/preview` when:

- you need to review a composed screen with multiple presentational
  sections together
- layout, spacing, shell chrome, or cross-component density matters
- the same screen should be inspectable inside the app frame with mock
  data

Update both in the same task when:

- a reusable component changes materially and also appears in a previewed
  screen
- a new presenter is introduced for Storybook-safe feature UI
- a major screen composition changes and the underlying reusable pieces
  also gain new states

## Authentication setup

DevApply now uses Clerk for production auth in the App Router.

Required environment variables:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL`

Operational notes:

- Clerk auth does not require seeded users
- Sign in and sign up must use the same Clerk application whose keys are loaded locally
- After first Clerk authentication, DevApply creates or links the Prisma `User` record on demand

Database change:

- `User.clerkUserId` was added as a nullable unique field to link Clerk identities to Prisma users
- Existing local users can be linked automatically on first sign-in when the Clerk email matches the existing `User.email`

## Storybook and design system

The repository includes Storybook with:

- config in `.storybook/`
- stories in `stories/`
- shadcn primitives in `components/ui/`
- shared presentational components in `components/design/`

Storybook loads `app/globals.css` so Tailwind styles and theme tokens match the app shell.

## Billing direction

DevApply is being documented and planned around **Polar** as the MVP
billing provider.

Billing architecture for the MVP should follow this pattern:

- server-side action starts hosted checkout
- server-side action redirects into the internal `/api/billing/checkout`
  entry point
- Polar owns the checkout surface
- webhook events synchronize subscription state back into Prisma
- `app/api/webhooks/polar/route.ts` verifies webhook signatures before
  applying plan changes
- application entitlements read normalized internal plan state, not
  client redirect params
- provider-specific code stays isolated inside `features/billing`
- signed-in pricing CTAs can reuse the same hosted checkout entry point
- signed-in users with an existing Polar customer can open the hosted
  billing portal from settings

Integration note:

- Polar provides official Next.js integration guidance for hosted
  checkout and webhook handling
- sandbox and production billing configs should be kept separate
- local sandbox checkout and webhook testing steps are documented in
  `docs/polar-sandbox-setup.md`

Plan model:

- `FREE` is the default plan
- `PRO` unlocks premium features

Billing persistence:

- `User.plan` remains the normalized app-level entitlement state
- provider linkage is stored separately on the `User` record for the
  current Polar integration
- existing users remain compatible if those provider-specific fields are
  still null until a later billing webhook or the operator backfill path
  updates them

## Resume uploads

Resume uploads use Vercel Blob. Local and deployed environments need:

- `BLOB_READ_WRITE_TOKEN`

Uploaded resume metadata stays in Prisma, while the stored file URL comes from Blob.
Resume downloads stay user-scoped through an authenticated app route.

## Vercel deployment

The repo includes `vercel.json` with `npm run build:vercel` as the
project build command.

Production deployment requirements:

- `DATABASE_URL` for the app runtime Prisma Neon adapter
- `DIRECT_URL` and `SHADOW_DATABASE_URL` for Prisma CLI and migration
  workflows
- Clerk production keys and redirect URLs
- `BLOB_READ_WRITE_TOKEN` for resume upload and download routes
- `NEXT_PUBLIC_APP_URL` for Polar return URLs
- `POLAR_ACCESS_TOKEN`, `POLAR_PRODUCT_ID_PRO`,
  `POLAR_WEBHOOK_SECRET`, and `POLAR_ENVIRONMENT`

Typography note:

- app layouts use a bundled system font stack defined in
  `app/globals.css`, so builds do not depend on live Google font
  fetching
