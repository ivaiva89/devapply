# Developer Job Application Tracker

A SaaS product designed for developers to manage job applications, track
interview progress, organize resume versions, and schedule follow‑ups.

## Product Vision

This project evolves in three stages:

1.  Job Application Tracker
2.  Developer Job CRM
3.  Developer Career Toolkit

The final platform connects:

-   Job Application Tracker
-   Resume Builder
-   Cover Letter Generator
-   Interview Preparation Tracker
-   Salary Comparison Tool

## Current Focus

The current milestone is **Stage 1: Job Application Tracker MVP**.

Features included:

-   authentication
-   dashboard
-   application CRUD
-   applications table
-   kanban pipeline
-   reminders
-   resume attachments
-   analytics basics
-   billing and plan limits

## Tech Stack

Frontend - Next.js App Router - React - TypeScript - Tailwind CSS -
shadcn/ui

Backend - Next.js Server Actions - Prisma ORM - PostgreSQL

Infrastructure - Vercel - Stripe - Resend - PostHog

## Development

Install dependencies

npm install

Configure environment variables

- Copy `.env.example` to `.env.local`
- Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
- Keep `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL`, and the Clerk redirect URLs aligned with `/sign-in`, `/sign-up`, and `/dashboard`
- Restart `npm run dev` after changing Clerk environment variables

Run database migrations

npx prisma migrate dev

Run seed data

npx prisma db seed

Start development

npm run dev

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
