# Prisma

Prisma schema, migrations, and seed utilities live in this directory.

Current foundation:
- `schema.prisma` defines the Job Application Tracker MVP data model
- `seed.mjs` inserts realistic demo data for local development

Before running Prisma commands, set `DATABASE_URL`, `DIRECT_URL`, and `SHADOW_DATABASE_URL` from `.env.example`.

Recommended commands:
- `npm run db:generate`
- `npm run db:migrate:dev -- --name init`
- `npm run db:seed`
