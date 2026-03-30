# Vercel Build

The repository now commits the Vercel build command in `vercel.json`:

```bash
npm run build:vercel
```

If the Vercel project already has a dashboard-level Build Command
override, keep it aligned with the same value.

## Production deployments

When `VERCEL_ENV=production`, the build runs:

```bash
prisma generate
prisma migrate deploy
next build
```

## Preview and development deployments

When `VERCEL_ENV` is not `production`, the build runs:

```bash
prisma generate
next build
```

`prisma migrate deploy` is production-only so preview and development
deployments do not apply migrations automatically against shared databases.

## Required production env vars

Runtime and build:

- `DATABASE_URL`
- `DIRECT_URL`
- `SHADOW_DATABASE_URL`
- `NEXT_PUBLIC_APP_URL`

Authentication:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL`

Uploads:

- `BLOB_READ_WRITE_TOKEN`

Billing:

- `POLAR_ACCESS_TOKEN`
- `POLAR_PRODUCT_ID_PRO`
- `POLAR_WEBHOOK_SECRET`
- `POLAR_ENVIRONMENT`

Optional analytics and email:

- `POSTHOG_KEY`
- `POSTHOG_HOST`
- Resend env vars if transactional email is enabled later

## Typography build assumption

- Both app layouts now use the shared system font stack from
  `app/globals.css`.
- Production builds no longer depend on fetching live Google fonts.
