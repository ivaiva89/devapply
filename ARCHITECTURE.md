# Architecture

## Overview

The application uses a **modular monolith architecture**.

The system runs as a single application but is organized into clear
domain modules.

Benefits:

-   faster development
-   easier reasoning for AI coding agents
-   simpler deployment
-   clean future scaling

## Technology

Frontend - Next.js - React - TypeScript - Tailwind

Backend - Next.js Server Actions - Prisma - PostgreSQL

Infrastructure - Stripe - Resend - PostHog

## Folder Structure

app/

Next.js routing and layouts

components/

Reusable UI components

features/

Domain modules

lib/

Infrastructure utilities

prisma/

Database schema and migrations

docs/

Project documentation

## Domain Modules

applications pipeline dashboard resumes reminders billing analytics auth

Each module should contain:

components schemas server logic utilities types

## Data Flow

UI Component → Server Action → Validation → Service Logic → Prisma →
PostgreSQL

## Security Rules

-   Every request must be authenticated
-   All queries must be scoped to userId
-   Ownership must be verified on mutations

## Billing

Free plan limits

-   30 applications
-   1 resume
-   3 reminders

Pro removes limits.

Plan limits must always be enforced server‑side.
