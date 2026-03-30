# Production Launch Design

**Date:** 2026-03-31
**Branch at time of spec:** `dashboard-uiux-redesign`
**Goal:** Ship DevApply to production on Vercel + Neon with a polished UI.

---

## Overview

Four sequential phases:

1. **Design pass** — targeted visual improvements on `dashboard-uiux-redesign`, then commit pending changes
2. **Merge** — branch → main after build/lint pass
3. **Preview verification** — deploy to Vercel preview, verify billing end-to-end against Neon preview branch + Polar sandbox
4. **Production launch** — swap to production credentials, promote deploy, final polish

---

## Phase 1 — Design pass (on `dashboard-uiux-redesign`)

### 1a. Sidebar: icon + label navigation

**File:** `features/navigation/components/app-sidebar-presenter.tsx`

- Add the `{✓}` logo mark SVG (`public/devapply-logo-optimized.svg`) to the sidebar header alongside the "DevApply" wordmark
- Add a Lucide icon to each nav item. Mapping:
  - Dashboard → `LayoutDashboard`
  - Applications → `BriefcaseBusiness`
  - Pipeline → `KanbanSquare`
  - Reminders → `BellRing`
  - Resumes → `FileText`
  - Settings → `Settings2`
- Layout: `flex items-center gap-2` on each nav link
- Icon size: `size-4`, color: `text-muted-foreground` (inactive), `text-foreground` (active)

### 1b. Dashboard stats: accent color highlights

**File:** `components/design/stats-card.tsx` and/or the dashboard `StatsGrid` composition

- Primary stat card (total applications): `bg-primary/5 border-primary/20`, label in `text-primary/70`
- Interview count value: `text-violet-400`
- Reminders due value: `text-amber-400`
- All other stats: unchanged (current neutral style)
- If `helper` prop is available on the primary card, show a trend string (e.g. "↑ 4 this week") — only where the data is computed; do not fabricate it

### 1c. Status badges: colored pill

**File:** `components/design/status-badge.tsx`

Each status maps to a color family. All use `rounded-full px-2.5 py-0.5 text-[11px] font-medium`:

| Status | Background | Text |
|--------|-----------|------|
| WISHLIST | `bg-slate-800/60` | `text-slate-400` |
| APPLIED | `bg-blue-950/60` | `text-blue-300` |
| INTERVIEW | `bg-violet-950/60` | `text-violet-300` |
| OFFER | `bg-emerald-950/60` | `text-emerald-300` |
| REJECTED | `bg-red-950/60` | `text-red-300` |

### 1d. Commit pending uncommitted changes

These are already written but unstaged on the branch:

- `app/api/webhooks/polar/route.ts` — `syncSubscriptionState` refactor (improved plan promotion logic for `subscription.created/updated/canceled`)
- `docs/launch-checklist.md` — current verification state
- `docs/polar-sandbox-setup.md` — current verification notes
- `NEXT_TASK.md`, `TASKS_AUDIT_FOLLOWUPS.md`, `AI_WORKFLOW.md` — doc sync

---

## Phase 2 — Merge to main

1. `npm run build` — must pass cleanly
2. `npm run lint` — must pass
3. `npm run format:check` — must pass
4. Merge `dashboard-uiux-redesign` → `main`
5. Delete the branch

No schema changes. No new dependencies.

---

## Phase 3 — Vercel preview verification

This phase closes the biggest open risk: the Polar webhook sync has never been proven end-to-end. A Vercel preview deployment provides a real HTTPS endpoint that Polar can reach, against isolated Neon and Polar sandbox infrastructure.

### 3a. Vercel preview env vars

Set these in the Vercel project dashboard under the **Preview** environment (separate from Production):

**Database (Neon — preview branch)**
- `DATABASE_URL` — pooled connection for the Neon preview/dev branch
- `DIRECT_URL` — direct connection for the Neon preview/dev branch

**Auth (Clerk)**
- Same Clerk keys as production (Clerk dev instance is fine for preview)

**Billing (Polar sandbox)**
- `POLAR_ACCESS_TOKEN` — sandbox org access token
- `POLAR_PRODUCT_ID_PRO` — sandbox product ID
- `POLAR_WEBHOOK_SECRET` — sandbox webhook secret
- `POLAR_ENVIRONMENT` → `sandbox`

**Storage, Analytics, App URL**
- `BLOB_READ_WRITE_TOKEN` — can share with production or use separate
- `NEXT_PUBLIC_POSTHOG_KEY` / `NEXT_PUBLIC_POSTHOG_HOST` — dev PostHog project
- `NEXT_PUBLIC_APP_URL` — set to the Vercel preview URL (e.g. `https://devapply-git-main-xyz.vercel.app`)

### 3b. Polar sandbox webhook endpoint

1. In the Polar sandbox dashboard, register the preview URL as a webhook endpoint: `https://<preview-url>/api/webhooks/polar`
2. Copy the generated webhook secret into `POLAR_WEBHOOK_SECRET` in Vercel preview env vars

### 3c. End-to-end verification checklist

Run through these flows on the preview deployment:

- [ ] Sign up with a new account → lands on `/dashboard`
- [ ] Create an application → appears in table and pipeline
- [ ] Upload a resume → download works
- [ ] Create a reminder → appears in reminders list
- [ ] Trigger upgrade → Polar sandbox checkout opens
- [ ] Complete sandbox checkout → `plan` field updates to `PRO` in Neon preview branch (verify in Prisma Studio or Neon console)
- [ ] Free plan limits enforced before upgrade (try adding 31st application)
- [ ] Cancel subscription in Polar sandbox → confirm behavior matches expected downgrade logic
- [ ] Mobile layout on at least one real device or devtools emulation

Only proceed to Phase 4 once the billing verification step (plan → `PRO` in database) is confirmed.

---

## Phase 4 — Production launch

### 4a. Vercel environment variables

All of these must be set in the Vercel project dashboard before deploying to production:

**Database (Neon)**
- `DATABASE_URL` — pooled connection string (Neon)
- `DIRECT_URL` — direct connection string (for Prisma CLI / migrations)

**Auth (Clerk)**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` → `/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` → `/sign-up`
- `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL` → `/dashboard`
- `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL` → `/dashboard`

**Billing (Polar)**
- `POLAR_ACCESS_TOKEN` — production org access token
- `POLAR_PRODUCT_ID_PRO` — production product ID
- `POLAR_WEBHOOK_SECRET` — production webhook secret
- `POLAR_ENVIRONMENT` → `production`

**Storage (Vercel Blob)**
- `BLOB_READ_WRITE_TOKEN`

**Analytics (PostHog)**
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`

**App**
- `NEXT_PUBLIC_APP_URL` — production domain (e.g. `https://devapply.co`)

### 4b. Neon production setup

- Confirm the production branch exists in the Neon project
- `prisma migrate deploy` runs automatically via `npm run build:vercel` on Vercel production deploys — verify this fires on first deploy

### 4c. Polar production billing verification

This is the highest-risk item. It cannot be automated.

1. Create a Polar *production* organization and product (separate from sandbox)
2. Register production webhook endpoint: `https://<domain>/api/webhooks/polar`
3. Copy the production webhook secret into `POLAR_WEBHOOK_SECRET` on Vercel
4. Deploy to production
5. Complete one real checkout with a real payment method
6. Confirm the user's `plan` field updates to `PRO` in the Neon production database
7. Confirm cancel/downgrade behavior sets `plan` back to `FREE` at period end

Only mark billing verified once step 6 is confirmed in the database — not just from the UI.

### 4d. PostHog production project

- Create a production PostHog project (separate from any local/dev project)
- Set `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` on Vercel
- Verify `signup` and `application_created` events appear in PostHog after first real user action

### 4e. Quick code fixes (on main, pre-announce)

**Fix hero CTA link** (`app/(marketing)/page.tsx`)
- "Sign up free" button currently links to `/sign-in` — change to `/sign-up`

**Add OG metadata** (`app/layout.tsx` and `app/(marketing)/page.tsx`)
- Add `openGraph` fields to Next.js metadata: `title`, `description`, `url`, `siteName`, `type: "website"`
- This ensures LinkedIn/Twitter link previews render correctly at launch

**Remove Resend from launch checklist** (`docs/launch-checklist.md`)
- Resend is not in the codebase — remove the `Resend sending verified` line to keep the checklist accurate

### 4f. Mobile verification (production)

- Open the app on a real mobile device (or browser devtools mobile emulation)
- Verify: applications table, pipeline board, reminder creation form, settings page
- The sidebar is already hidden on mobile (`hidden lg:block`) — confirm the header is usable without it

---

## Out of scope for this launch

- Email notifications (Resend not implemented)
- Resume builder
- Interview prep AI
- Cover letter generator
- Dark/light mode toggle (dark-only at launch is fine)

---

## Definition of done

- [ ] All Phase 1 design changes committed on `dashboard-uiux-redesign`
- [ ] Branch builds and lints cleanly
- [ ] Branch merged to `main`
- [ ] Vercel preview env vars configured (Neon preview branch + Polar sandbox)
- [ ] Polar sandbox webhook registered against preview URL
- [ ] Full preview verification checklist passed (billing confirmed in Neon preview branch)
- [ ] All production env vars set on Vercel
- [ ] First production deploy succeeds with migrations applied
- [ ] One real Polar production checkout confirms plan → `PRO` in Neon production
- [ ] PostHog receiving production events
- [ ] Hero CTA fixed, OG metadata added, Resend removed from checklist
- [ ] Mobile layout verified on production
