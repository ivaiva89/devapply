# Neon Local Setup

Neon Local runs as a Docker container. This repo does not use a custom
Dockerfile for local database development.

## Connection model

- The app runtime uses `DATABASE_URL`
- Prisma CLI uses `DIRECT_URL`
- Both local connections should point to `localhost:5432`

Recommended local workflow:

1. Copy `.env.neon-local.example` to `.env`
2. Fill in the Neon values for your existing `development` branch
3. Start Neon Local with Docker

## Required variables

- `DATABASE_URL`
- `DIRECT_URL`
- `NEON_API_KEY`
- `NEON_PROJECT_ID`
- `NEON_BRANCH_ID`

For Neon Local container configuration:

- `NEON_API_KEY`: your Neon API key
- `NEON_PROJECT_ID`: the Neon project id
- `NEON_BRANCH_ID`: the existing Neon branch id for your `development` branch

## Start and stop Neon Local

Start:

```bash
npm run neon-local:up
```

Stop:

```bash
npm run neon-local:down
```

View logs:

```bash
npm run neon-local:logs
```

## Prisma commands

Run locally after `.env` is filled:

```bash
npm run db:generate
npm run db:validate
npm run db:migrate -- --name init
```
