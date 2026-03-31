# Getting Started

## Prerequisites

- Node.js 20+
- Docker (for local database via Neon Local)
- A [Clerk](https://clerk.com) account (free tier works)

## Step 1 — Install dependencies

```bash
npm install
```

## Step 2 — Configure environment

```bash
cp .env.example .env.local
```

Open `.env.local`. Minimum required to run locally:

- **`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`** and **`CLERK_SECRET_KEY`** — from your [Clerk dashboard](https://dashboard.clerk.com) → create an application → API Keys
- **`DATABASE_URL`**, **`DIRECT_URL`**, **`SHADOW_DATABASE_URL`** — pre-filled for local Docker (see Step 3)

Leave `BLOB_READ_WRITE_TOKEN` and `POLAR_*` vars blank until you need those features.

Full variable reference: [`docs/ENVIRONMENT_VARIABLES.md`](docs/ENVIRONMENT_VARIABLES.md)

## Step 3 — Start the local database

```bash
npm run neon-local:up
```

This starts a local Postgres instance via Docker on port 5432. The pre-filled `DATABASE_URL` in `.env.example` points here.

> Requires `NEON_API_KEY`, `NEON_PROJECT_ID`, and `NEON_BRANCH_ID` in `.env.local`. Get these from [console.neon.tech](https://console.neon.tech) → your project → API. Alternatively, swap in a cloud Neon connection string and skip this step.

## Step 4 — Run migrations

```bash
npm run db:migrate
```

## Step 5 — Seed the database (optional)

```bash
npm run db:seed
```

Loads realistic demo data (applications, interviews, reminders, resumes).

## Step 6 — Start the app

```bash
npm run dev
```

App available at **http://localhost:3000**

## Verify your setup

| URL | What you should see |
|---|---|
| `http://localhost:3000` | Marketing landing page |
| `http://localhost:3000/sign-up` | Clerk sign-up form |
| `http://localhost:3000/dashboard` | Dashboard (after sign-up) |
| `http://localhost:3000/preview` | UI component preview — no auth needed |

## Optional: Start Storybook

```bash
npm run storybook
```

Available at **http://localhost:6006** — isolated component development environment.

## Next steps

| Goal | Read |
|---|---|
| Resume uploads | Add `BLOB_READ_WRITE_TOKEN` — see [`docs/ENVIRONMENT_VARIABLES.md`](docs/ENVIRONMENT_VARIABLES.md) |
| Billing locally | [`docs/polar-sandbox-setup.md`](docs/polar-sandbox-setup.md) |
| Deploy to Vercel | [`docs/vercel-build.md`](docs/vercel-build.md) |
| Architecture overview | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) |
| UI component guide | [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) |
