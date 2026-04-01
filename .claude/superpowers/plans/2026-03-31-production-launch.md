# Production Launch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the UI on `dashboard-uiux-redesign`, merge to `main`, verify end-to-end on Vercel preview, then ship to production.

**Architecture:** Four sequential phases — code changes on the current branch (Tasks 1–6), merge (Task 7), manual Vercel preview setup and verification (Task 8), then pre-announce code fixes and production promotion (Tasks 9–10). No new dependencies, no schema changes.

**Tech Stack:** Next.js 16 App Router, Prisma/Neon, Clerk auth, Polar billing, Vercel Blob, PostHog, Tailwind CSS 4, shadcn/ui, Lucide icons.

---

## File Map

| File                                                       | Change                                                     |
| ---------------------------------------------------------- | ---------------------------------------------------------- |
| `features/navigation/config.ts`                            | Add `icon: LucideIcon` field to each `appNavigation` entry |
| `features/navigation/components/app-sidebar-presenter.tsx` | Render icon + logo mark in sidebar                         |
| `components/design/stats-card.tsx`                         | Add `highlight` and `valueClassName` props                 |
| `features/dashboard/components/stats-grid.tsx`             | Apply per-slot highlight and value color                   |
| `components/design/status-badge.tsx`                       | Replace tone classes with dark pill styles                 |
| `app/(marketing)/page.tsx`                                 | Fix hero CTA href + add OG metadata                        |
| `app/(app)/layout.tsx`                                     | Add OG metadata                                            |
| `docs/launch-checklist.md`                                 | Remove Resend line                                         |
| `app/api/webhooks/polar/route.ts`                          | Commit existing uncommitted improvement                    |
| `docs/polar-sandbox-setup.md`                              | Commit existing uncommitted update                         |

---

## Phase 1 — Design pass

### Task 1: Add icons to navigation config

**Files:**

- Modify: `features/navigation/config.ts`

- [ ] **Update the config to include a Lucide icon per nav item:**

```typescript
import type { LucideIcon } from "lucide-react";
import {
  BellRing,
  BriefcaseBusiness,
  FileText,
  KanbanSquare,
  LayoutDashboard,
  Settings2,
} from "lucide-react";

export const marketingNavigation = [
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
];

export const appNavigation: ReadonlyArray<{
  href: string;
  label: string;
  icon: LucideIcon;
}> = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: BriefcaseBusiness },
  { href: "/pipeline", label: "Pipeline", icon: KanbanSquare },
  { href: "/resumes", label: "Resumes", icon: FileText },
  { href: "/reminders", label: "Reminders", icon: BellRing },
  { href: "/settings", label: "Settings", icon: Settings2 },
];
```

- [ ] **Verify TypeScript compiles:**

```bash
cd /Users/ivapersonal/WebstormProjects/devapply
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors involving `config.ts`.

- [ ] **Commit:**

```bash
git add features/navigation/config.ts
git commit -m "feat(navigation): add icon field to appNavigation config"
```

---

### Task 2: Update sidebar presenter — icons + logo mark

**Files:**

- Modify: `features/navigation/components/app-sidebar-presenter.tsx`

The logo mark SVG is at `public/devapply-logo-optimized.svg`. Use Next.js `<Image>` to render it at `width={20} height={20}` beside the "DevApply" wordmark. Render each nav item's `icon` from the config.

- [ ] **Replace the sidebar presenter with this implementation:**

```tsx
import Image from "next/image";
import Link from "next/link";

import { appNavigation } from "@/features/navigation/config";
import { cn } from "@/lib/utils";

type AppSidebarPresenterProps = {
  currentPath: string;
};

function isItemActive(currentPath: string, href: string) {
  if (href === "/dashboard") {
    return currentPath === href;
  }

  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export function AppSidebarPresenter({ currentPath }: AppSidebarPresenterProps) {
  return (
    <aside className="flex h-full flex-col border-r border-border bg-sidebar">
      {/* Logo — same height as header (h-10) so it aligns across the shell */}
      <div className="flex h-10 items-center gap-2 border-b border-border px-4">
        <Image
          src="/devapply-logo-optimized.svg"
          alt="DevApply"
          width={20}
          height={20}
          className="shrink-0"
        />
        <span className="text-sm font-semibold tracking-tight text-foreground">
          DevApply
        </span>
      </div>

      <nav
        aria-label="Primary navigation"
        className="flex flex-col gap-px p-2 pt-3"
      >
        {appNavigation.map((item) => {
          const isActive = isItemActive(currentPath, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors duration-100",
                isActive
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "size-4 shrink-0",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```

- [ ] **Verify TypeScript compiles:**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Commit:**

```bash
git add features/navigation/components/app-sidebar-presenter.tsx
git commit -m "feat(navigation): add icon + logo mark to sidebar"
```

---

### Task 3: Update StatsCard + StatsGrid for accent highlights

**Files:**

- Modify: `components/design/stats-card.tsx`
- Modify: `features/dashboard/components/stats-grid.tsx`

The four KPI slots (in order from `getDashboardDataForUser`) are:

- Slot 0: "Total applications" → indigo highlight (`bg-primary/5 border-primary/20`, label `text-primary/70`)
- Slot 1: "Applications this month" → default
- Slot 2: "Interviews" → default card, value in `text-violet-400`
- Slot 3: "Offers" → default card, value in `text-emerald-400`

Add a `highlight` boolean prop to `StatsCard` for the indigo tint and a `valueClassName` prop for value color overrides.

- [ ] **Update `components/design/stats-card.tsx`:**

```tsx
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatsCardProps = {
  label: string;
  value: ReactNode;
  helper?: string;
  icon?: LucideIcon;
  highlight?: boolean;
  valueClassName?: string;
};

export function StatsCard({
  label,
  value,
  helper,
  icon: Icon,
  highlight = false,
  valueClassName,
}: StatsCardProps) {
  return (
    <Card className={cn(highlight && "border-primary/20 bg-primary/5")}>
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <p
            className={cn(
              "text-xs",
              highlight ? "text-primary/70" : "text-muted-foreground",
            )}
          >
            {label}
          </p>
          {Icon ? (
            <Icon
              className={cn(
                "size-3.5 shrink-0",
                highlight ? "text-primary/40" : "text-muted-foreground/40",
              )}
            />
          ) : null}
        </div>
        <p
          className={cn(
            "text-2xl font-semibold tabular-nums tracking-tight",
            valueClassName ?? "text-foreground",
          )}
        >
          {value}
        </p>
        {helper ? (
          <p className="text-xs text-muted-foreground">{helper}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
```

- [ ] **Update `features/dashboard/components/stats-grid.tsx`:**

```tsx
import { Briefcase, CalendarPlus, MessageSquare, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { StatsCard } from "@/components/design/stats-card";

type StatsGridItem = {
  label: string;
  value: number;
  helper: string;
};

type StatsGridProps = {
  items: StatsGridItem[];
};

// Ordered to match the four KPIs returned from getDashboardDataForUser.
const SLOT_ICONS: LucideIcon[] = [
  Briefcase,
  CalendarPlus,
  MessageSquare,
  Trophy,
];

const SLOT_VALUE_CLASSNAMES: (string | undefined)[] = [
  undefined, // slot 0: total applications — default (primary card handles color)
  undefined, // slot 1: applications this month
  "text-violet-400", // slot 2: interviews
  "text-emerald-400", // slot 3: offers
];

export function StatsGrid({ items }: StatsGridProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <StatsCard
          key={item.label}
          label={item.label}
          value={item.value}
          helper={item.helper}
          icon={SLOT_ICONS[index]}
          highlight={index === 0}
          valueClassName={SLOT_VALUE_CLASSNAMES[index]}
        />
      ))}
    </div>
  );
}
```

- [ ] **Verify TypeScript compiles:**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Commit:**

```bash
git add components/design/stats-card.tsx features/dashboard/components/stats-grid.tsx
git commit -m "feat(dashboard): add accent highlights to stats grid"
```

---

### Task 4: Update StatusBadge to colored pill style

**Files:**

- Modify: `components/design/status-badge.tsx`

The app is dark-mode only (`:root` in `globals.css` uses near-black colors). Replace the light/dark tone classes with dark-appropriate pill colors. Change shape from `rounded-md` to `rounded-full`. The `ApplicationStatusBadge` and all consumers pass a `tone` prop — the tone keys stay the same, only the visual classes change.

- [ ] **Replace `components/design/status-badge.tsx`:**

```tsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const toneClasses = {
  neutral: "border-transparent bg-slate-800/60 text-slate-400",
  info: "border-transparent bg-blue-950/60 text-blue-300",
  warning: "border-transparent bg-violet-950/60 text-violet-300",
  success: "border-transparent bg-emerald-950/60 text-emerald-300",
  danger: "border-transparent bg-red-950/60 text-red-300",
} as const;

type StatusBadgeProps = {
  label: string;
  tone?: keyof typeof toneClasses;
  className?: string;
};

export function StatusBadge({
  label,
  tone = "neutral",
  className,
}: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        toneClasses[tone],
        className,
      )}
    >
      {label}
    </Badge>
  );
}
```

> Note: `applicationStatusTones` in `features/applications/config.ts` maps `INTERVIEW → "warning"` (which now renders as violet) and `OFFER → "success"` (emerald). This matches the design — no changes needed to the applications config.

- [ ] **Verify TypeScript compiles:**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Commit:**

```bash
git add components/design/status-badge.tsx
git commit -m "feat(ui): update StatusBadge to colored pill style"
```

---

### Task 5: Commit pending uncommitted changes

These files already have the correct changes written — they just haven't been committed yet.

- [ ] **Stage and commit the Polar webhook improvement + docs:**

```bash
git add \
  app/api/webhooks/polar/route.ts \
  docs/launch-checklist.md \
  docs/polar-sandbox-setup.md \
  NEXT_TASK.md \
  TASKS_AUDIT_FOLLOWUPS.md \
  AI_WORKFLOW.md
git commit -m "fix(billing): improve subscription state sync in polar webhook handler"
```

---

### Task 6: Build and lint verification

- [ ] **Run the full build:**

```bash
npm run build 2>&1 | tail -20
```

Expected: exits 0, no TypeScript errors, no missing module errors.

- [ ] **Run lint:**

```bash
npm run lint 2>&1 | tail -20
```

Expected: exits 0, no ESLint errors (warnings are acceptable).

- [ ] **Run format check:**

```bash
npm run format:check 2>&1 | tail -10
```

Expected: exits 0. If it fails, run `npm run format` and commit the formatting changes:

```bash
npm run format
git add -A
git commit -m "style: apply prettier formatting"
```

---

## Phase 2 — Merge to main

### Task 7: Merge branch to main

- [ ] **Switch to main and merge:**

```bash
git checkout main
git merge dashboard-uiux-redesign --no-ff -m "feat: dashboard UI redesign + production launch preparation"
```

- [ ] **Verify the merge commit is clean:**

```bash
git log --oneline -5
```

- [ ] **Delete the feature branch:**

```bash
git branch -d dashboard-uiux-redesign
```

- [ ] **Push to remote:**

```bash
git push origin main
```

---

## Phase 3 — Vercel preview verification

### Task 8: Configure Vercel preview environment and verify end-to-end

This task is entirely manual — no code changes. Follow each step in order.

**8a. Vercel preview environment variables**

Go to the Vercel project dashboard → Settings → Environment Variables. For each variable below, set the environment to **Preview** only (not Production):

| Variable                                       | Value                                                         |
| ---------------------------------------------- | ------------------------------------------------------------- |
| `DATABASE_URL`                                 | Neon pooled connection string for your **preview/dev branch** |
| `DIRECT_URL`                                   | Neon direct connection string for your **preview/dev branch** |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`            | Your Clerk publishable key                                    |
| `CLERK_SECRET_KEY`                             | Your Clerk secret key                                         |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`                | `/sign-in`                                                    |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL`                | `/sign-up`                                                    |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL` | `/dashboard`                                                  |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL` | `/dashboard`                                                  |
| `POLAR_ACCESS_TOKEN`                           | Polar **sandbox** org access token                            |
| `POLAR_PRODUCT_ID_PRO`                         | Polar **sandbox** product ID                                  |
| `POLAR_WEBHOOK_SECRET`                         | Will be set in step 8b                                        |
| `POLAR_ENVIRONMENT`                            | `sandbox`                                                     |
| `BLOB_READ_WRITE_TOKEN`                        | Your Vercel Blob token                                        |
| `NEXT_PUBLIC_POSTHOG_KEY`                      | Your PostHog project API key                                  |
| `NEXT_PUBLIC_POSTHOG_HOST`                     | `https://app.posthog.com` (or your self-hosted host)          |
| `NEXT_PUBLIC_APP_URL`                          | Your Vercel preview URL (see 8b)                              |

**8b. Get the preview URL and register Polar webhook**

- [ ] Trigger a preview deploy by pushing to any branch, or find the existing preview URL in the Vercel dashboard for the `main` branch deployment.
- [ ] Copy the preview URL (e.g. `https://devapply-git-main-abc123.vercel.app`)
- [ ] Set `NEXT_PUBLIC_APP_URL` to that URL in Vercel preview env vars
- [ ] Go to Polar sandbox dashboard → Webhooks → Add endpoint
- [ ] Set endpoint URL to: `https://<your-preview-url>/api/webhooks/polar`
- [ ] Select events: `order.paid`, `subscription.created`, `subscription.updated`, `subscription.canceled`, `subscription.uncanceled`, `subscription.revoked`, `customer.created`, `customer.updated`
- [ ] Copy the generated webhook secret
- [ ] Set `POLAR_WEBHOOK_SECRET` to that secret in Vercel preview env vars
- [ ] Redeploy the preview to pick up all env var changes

**8c. End-to-end verification checklist**

Run all of these on the preview deployment. Do not proceed to Phase 4 until the billing step (marked ⚠️) passes.

- [ ] Sign up with a new test account → lands on `/dashboard`
- [ ] Create an application → appears in applications table and pipeline board
- [ ] Upload a resume → file uploads and download link works
- [ ] Create a reminder → appears in reminders list
- [ ] Free plan limit: try creating a 31st application → blocked by plan gate with an error
- [ ] Trigger upgrade → redirects to Polar sandbox hosted checkout
- [ ] Complete sandbox checkout (use Polar's test card: `4242 4242 4242 4242`)
- [ ] ⚠️ **Verify in Neon console or Prisma Studio that the user's `plan` field is now `PRO`** — this is the critical gate
- [ ] Confirm Pro user can create a 31st application (limit no longer applies)
- [ ] Cancel subscription in Polar sandbox portal → access remains until period end (plan does not immediately revert to `FREE`)
- [ ] Mobile layout: open on a real device or Chrome DevTools iPhone 14 emulation and verify dashboard, applications table, and reminder creation form are usable

If the billing step fails (plan doesn't update), check:

1. Polar event delivery logs for the webhook endpoint — did Polar actually send it?
2. Vercel function logs for `/api/webhooks/polar` — did it receive and process the event?
3. Whether the Polar checkout created a customer with `externalCustomerId` matching the DevApply `User.id`

---

## Phase 4 — Production launch

### Task 9: Pre-announce code fixes (on main)

**Files:**

- Modify: `app/(marketing)/page.tsx` — fix hero CTA href + add OG metadata
- Modify: `app/(app)/layout.tsx` — add OG metadata
- Modify: `docs/launch-checklist.md` — remove Resend line

- [ ] **Fix hero CTA link in `app/(marketing)/page.tsx`**

Find the "Sign up free" link in the hero section (around line 189) and change `/sign-in` to `/sign-up`:

```tsx
<Link
  href="/sign-up"
  className={cn(buttonVariants({ size: "lg" }), "rounded-full px-5")}
>
  Sign up free
</Link>
```

Also fix the "Create free account" CTA in the final CTA section (around line 522):

```tsx
<Link
  href="/sign-up"
  className={cn(
    buttonVariants({ size: "lg" }),
    "rounded-full bg-background px-5 text-foreground hover:bg-background/90",
  )}
>
  Create free account
</Link>
```

- [ ] **Add OG metadata to `app/(marketing)/page.tsx`**

Replace the existing `metadata` export at the top of the file:

```tsx
export const metadata: Metadata = {
  title: "Job Application Tracker for Developers | DevApply",
  description:
    "Track applications, interview stages, reminders, and resume versions in one focused workspace built for developer job searches.",
  openGraph: {
    title: "Job Application Tracker for Developers | DevApply",
    description:
      "Track applications, interview stages, reminders, and resume versions in one focused workspace built for developer job searches.",
    url: "https://devapply.co",
    siteName: "DevApply",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Job Application Tracker for Developers | DevApply",
    description:
      "Track applications, interview stages, reminders, and resume versions in one focused workspace built for developer job searches.",
  },
};
```

> Replace `https://devapply.co` with your actual production domain if different.

- [ ] **Add OG metadata to `app/(app)/layout.tsx`**

Replace the existing `metadata` export:

```tsx
export const metadata: Metadata = {
  title: "DevApply",
  description:
    "Track your developer job search in one place. Applications, pipeline, reminders, and resume versions.",
  openGraph: {
    title: "DevApply",
    description:
      "Track your developer job search in one place. Applications, pipeline, reminders, and resume versions.",
    url: "https://devapply.co",
    siteName: "DevApply",
    type: "website",
  },
};
```

- [ ] **Remove Resend from `docs/launch-checklist.md`**

Find and delete this line from the Production Readiness section:

```
- [ ] Resend sending verified
```

- [ ] **Verify build still passes:**

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Commit:**

```bash
git add app/\(marketing\)/page.tsx app/\(app\)/layout.tsx docs/launch-checklist.md
git commit -m "fix(launch): fix hero CTAs, add OG metadata, remove Resend from checklist"
```

---

### Task 10: Production environment setup and deploy

This task is entirely manual.

**10a. Vercel production environment variables**

Go to Vercel → Settings → Environment Variables. Set each variable for the **Production** environment:

| Variable                                       | Value                                                        |
| ---------------------------------------------- | ------------------------------------------------------------ |
| `DATABASE_URL`                                 | Neon pooled connection string for your **production branch** |
| `DIRECT_URL`                                   | Neon direct connection string for your **production branch** |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`            | Production Clerk key                                         |
| `CLERK_SECRET_KEY`                             | Production Clerk secret                                      |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`                | `/sign-in`                                                   |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL`                | `/sign-up`                                                   |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL` | `/dashboard`                                                 |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL` | `/dashboard`                                                 |
| `POLAR_ACCESS_TOKEN`                           | Polar **production** org access token                        |
| `POLAR_PRODUCT_ID_PRO`                         | Polar **production** product ID                              |
| `POLAR_WEBHOOK_SECRET`                         | Polar **production** webhook secret (from step 10b)          |
| `POLAR_ENVIRONMENT`                            | `production`                                                 |
| `BLOB_READ_WRITE_TOKEN`                        | Vercel Blob token                                            |
| `NEXT_PUBLIC_POSTHOG_KEY`                      | Production PostHog API key                                   |
| `NEXT_PUBLIC_POSTHOG_HOST`                     | `https://app.posthog.com`                                    |
| `NEXT_PUBLIC_APP_URL`                          | Your production domain e.g. `https://devapply.co`            |

**10b. Polar production webhook**

- [ ] Create a Polar **production** organization (separate from sandbox) at polar.sh
- [ ] Create the Pro product in the production organization. Copy the product ID → `POLAR_PRODUCT_ID_PRO`
- [ ] Go to Polar production → Webhooks → Add endpoint
- [ ] Set endpoint URL: `https://<your-domain>/api/webhooks/polar`
- [ ] Select the same events as in Task 8b
- [ ] Copy the webhook secret → `POLAR_WEBHOOK_SECRET` in Vercel production env vars

**10c. First production deploy**

- [ ] Push `main` (or trigger a redeploy in Vercel dashboard)
- [ ] Watch the build logs — confirm `prisma migrate deploy` runs and exits 0
- [ ] Open your production URL and verify the landing page loads
- [ ] Sign up with a real account → confirm `/dashboard` loads

**10d. Billing verification on production**

- [ ] Trigger upgrade from the app → Polar **production** checkout opens (not sandbox)
- [ ] Complete checkout with a real payment method
- [ ] Open Neon console for the **production** branch, find your user row, confirm `plan = "PRO"`
- [ ] Confirm Pro limits are lifted in the app

**10e. PostHog verification**

- [ ] In the PostHog production project, open Live Events
- [ ] Sign up a new test account on production and create an application
- [ ] Confirm `signup` and `application_created` events appear in PostHog within 30 seconds

**10f. Final checklist**

Update `docs/launch-checklist.md` to mark each confirmed item:

- [ ] Application CRUD works end-to-end
- [ ] Pipeline view works correctly
- [ ] Dashboard shows useful metrics
- [ ] Resume upload works
- [ ] Free vs Pro feature gating works
- [ ] Polar hosted checkout works
- [ ] Checkout success updates entitlements via webhook sync
- [ ] Subscription status sync works
- [ ] Production env vars configured
- [ ] Vercel Blob token configured
- [ ] Database migrations applied
- [ ] Polar webhook configured
- [ ] PostHog production project configured
- [ ] Mobile layout verified

---

## Definition of Done

- [ ] All Tasks 1–6 committed on `dashboard-uiux-redesign`
- [ ] Task 7: branch merged to `main` and pushed
- [ ] Task 8: Vercel preview verified with Polar billing confirmed in Neon preview branch
- [ ] Task 9: CTA fix, OG metadata, Resend removal committed on main
- [ ] Task 10: Production deploy live, billing confirmed in Neon production, PostHog receiving events
