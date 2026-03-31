# Environment Variables

Complete reference for all DevApply environment variables.

For setup steps, see [GETTING_STARTED.md](../GETTING_STARTED.md).
For deployment-specific details, see [vercel-build.md](vercel-build.md).

---

## Database — Neon

| Variable              | Required             | Description                                   | Where to get it                                                     |
| --------------------- | -------------------- | --------------------------------------------- | ------------------------------------------------------------------- |
| `DATABASE_URL`        | Required             | Neon pooled connection string for app runtime | Neon console → Connection string (pooled)                           |
| `DIRECT_URL`          | Required             | Direct Neon URL for Prisma CLI and migrations | Neon console → Connection string (direct)                           |
| `SHADOW_DATABASE_URL` | Required (local dev) | Shadow DB for `prisma migrate dev`            | Neon console → create a second DB, or use the local Docker default  |
| `NEON_API_KEY`        | Local Docker only    | API key for Neon Local Docker container       | [console.neon.tech](https://console.neon.tech) → Account → API Keys |
| `NEON_PROJECT_ID`     | Local Docker only    | Neon project ID                               | Neon console → project settings                                     |
| `NEON_BRANCH_ID`      | Local Docker only    | Neon branch ID                                | Neon console → Branches                                             |

Local dev defaults for `DATABASE_URL`, `DIRECT_URL`, and `SHADOW_DATABASE_URL` are pre-filled in `.env.example` for Neon Local (Docker).

---

## App URL

| Variable              | Required | Description                               | Value                                                        |
| --------------------- | -------- | ----------------------------------------- | ------------------------------------------------------------ |
| `NEXT_PUBLIC_APP_URL` | Required | Full app URL — used for Polar return URLs | `http://localhost:3000` locally; production domain on Vercel |

---

## Authentication — Clerk

| Variable                                       | Required | Description           | Where to get it                                           |
| ---------------------------------------------- | -------- | --------------------- | --------------------------------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`            | Required | Clerk publishable key | [Clerk dashboard](https://dashboard.clerk.com) → API Keys |
| `CLERK_SECRET_KEY`                             | Required | Clerk secret key      | Clerk dashboard → API Keys                                |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`                | Required | Sign-in page path     | Always `/sign-in`                                         |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL`                | Required | Sign-up page path     | Always `/sign-up`                                         |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL` | Required | Post sign-in redirect | Always `/dashboard`                                       |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL` | Required | Post sign-up redirect | Always `/dashboard`                                       |

---

## Billing — Polar

| Variable               | Required             | Description                               | Where to get it                                         |
| ---------------------- | -------------------- | ----------------------------------------- | ------------------------------------------------------- |
| `POLAR_ACCESS_TOKEN`   | Required for billing | Organization access token                 | [polar.sh](https://polar.sh) → Settings → Access Tokens |
| `POLAR_PRODUCT_ID_PRO` | Required for billing | Product ID for the Pro plan               | Polar dashboard → Products → copy ID                    |
| `POLAR_WEBHOOK_SECRET` | Required for billing | Webhook signing secret                    | Polar dashboard → Webhooks → endpoint secret            |
| `POLAR_ENVIRONMENT`    | Required for billing | `sandbox` locally, `production` on Vercel | Set manually                                            |

See [polar-sandbox-setup.md](polar-sandbox-setup.md) for full local sandbox setup.

---

## Resume Uploads — Vercel Blob

| Variable                | Required                    | Description                  | Where to get it                                         |
| ----------------------- | --------------------------- | ---------------------------- | ------------------------------------------------------- |
| `BLOB_READ_WRITE_TOKEN` | Required for resume uploads | Vercel Blob read-write token | Vercel dashboard → Storage → Blob → your store → Tokens |

---

## Analytics — PostHog

| Variable                   | Required | Description             | Where to get it                                                  |
| -------------------------- | -------- | ----------------------- | ---------------------------------------------------------------- |
| `NEXT_PUBLIC_POSTHOG_KEY`  | Optional | PostHog project API key | [posthog.com](https://posthog.com) → Project Settings → API Keys |
| `NEXT_PUBLIC_POSTHOG_HOST` | Optional | PostHog ingestion host  | `https://us.i.posthog.com` (default) or your region's host       |

Analytics events are silently skipped when these vars are absent.
