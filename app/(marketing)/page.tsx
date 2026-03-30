import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BellRing,
  BriefcaseBusiness,
  Check,
  FileText,
  KanbanSquare,
  SearchCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FREE_PLAN_LIMITS,
  PRO_PLAN_PRICE_MONTHLY,
} from "@/features/billing/config";
import { UpgradeButton } from "@/features/billing/components/upgrade-button";
import { getCurrentUser } from "@/features/auth/server/session";
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/support";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Job Application Tracker for Developers | DevApply",
  description:
    "Track applications, interview stages, reminders, and resume versions in one focused workspace built for developer job searches.",
};

const heroFacts = [
  `Free plan includes ${FREE_PLAN_LIMITS.applications} applications`,
  `${FREE_PLAN_LIMITS.resumes} saved resume version`,
  `${FREE_PLAN_LIMITS.reminders} active reminders before upgrade`,
] as const;

const developerValueProps = [
  {
    title: "Replace the spreadsheet stack",
    description:
      "Keep applications, notes, follow-ups, and resume attachments in one place instead of splitting the search across tabs and documents.",
  },
  {
    title: "Reduce search drift",
    description:
      "A clear pipeline and reminder workflow makes it easier to keep momentum when interviews and day-to-day work compete for attention.",
  },
  {
    title: "Stay tailored per role",
    description:
      "Attach the right resume version to each application so role-specific materials stay connected to the job they support.",
  },
] as const;

const featureHighlights = [
  {
    icon: BriefcaseBusiness,
    title: "Applications table",
    description:
      "Track company, role, source, status, and applied date in a format that stays usable even when your search volume climbs.",
  },
  {
    icon: KanbanSquare,
    title: "Kanban pipeline",
    description:
      "Move roles from wishlist to interview and offer stages without losing the context around each application.",
  },
  {
    icon: BellRing,
    title: "Reminder workflow",
    description:
      "Create follow-ups for recruiter outreach, take-home deadlines, and interview prep before they slip out of view.",
  },
  {
    icon: FileText,
    title: "Resume attachments",
    description:
      "Store resume versions and attach them to applications so you can see what was sent where.",
  },
  {
    icon: SearchCheck,
    title: "Source and status visibility",
    description:
      "Spot which channels are producing movement and where applications are getting stuck.",
  },
  {
    icon: BarChart3,
    title: "Basic analytics",
    description:
      "Review funnel progress from the dashboard without turning the product into a reporting tool.",
  },
] as const;

const previewApplications = [
  {
    role: "Platform engineer role",
    stage: "Applied",
    note: "Resume v2 attached",
  },
  {
    role: "Frontend infrastructure role",
    stage: "Interview",
    note: "Technical screen queued",
  },
  {
    role: "Full-stack product role",
    stage: "Follow-up",
    note: "Recruiter check-in drafted",
  },
] as const;

const previewStages = ["Wishlist", "Applied", "Interview", "Offer"] as const;

const previewReminders = [
  "Follow up after recruiter screen",
  "Attach backend-focused resume",
  "Prep system design notes",
] as const;

const pricingTiers = [
  {
    name: "Free",
    description:
      "A good fit for evaluating the workflow or running a lighter application cycle.",
    price: "$0",
    priceSuffix: null,
    ctaLabel: "Sign up free",
    ctaVariant: "outline" as const,
    highlighted: false,
    features: [
      `Up to ${FREE_PLAN_LIMITS.applications} applications`,
      `${FREE_PLAN_LIMITS.resumes} saved resume version`,
      `${FREE_PLAN_LIMITS.reminders} active reminders`,
      "Dashboard, applications table, pipeline, and reminders",
    ],
  },
  {
    name: "Pro",
    description:
      "For longer searches and higher application volume where the free plan caps become friction.",
    price: `$${PRO_PLAN_PRICE_MONTHLY}`,
    priceSuffix: "/ month",
    ctaLabel: "Start with the free account",
    ctaVariant: "default" as const,
    highlighted: true,
    features: [
      "Unlimited applications",
      "Unlimited reminders",
      "Multiple resume versions",
      "The same core workflow without plan limits",
    ],
  },
] as const;

export default async function MarketingHomePage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-16">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <Badge
              variant="outline"
              className="h-auto rounded-full border-primary/20 bg-primary/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary"
            >
              Job application tracker for developers
            </Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                Track every application in one developer-first workflow.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-stone-600">
                DevApply keeps applications, interview stages, reminders, and
                resume versions together so your search stays structured without
                turning into a spreadsheet maintenance project.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/sign-in"
              className={cn(buttonVariants({ size: "lg" }), "rounded-full px-5")}
            >
              Sign up free
            </Link>
            <Link
              href="/#pricing"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "rounded-full px-5",
              )}
            >
              View pricing
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {heroFacts.map((fact) => (
              <Badge
                key={fact}
                variant="outline"
                className="h-auto rounded-full border-stone-200 bg-white/80 px-3 py-1 text-xs text-stone-600"
              >
                {fact}
              </Badge>
            ))}
          </div>

          <p className="text-sm leading-7 text-stone-600">
            Built for developers managing roughly 20 to 200 active applications.
          </p>
        </div>

        <Card className="rounded-[2rem] border border-black/10 bg-stone-950 text-white shadow-sm">
          <CardHeader className="px-6 pt-6 sm:px-8 sm:pt-8">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Core workflow preview
            </CardTitle>
            <CardDescription className="max-w-md text-sm leading-6 text-stone-300">
              The MVP stays focused on the parts of the search developers repeat
              every week.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6 sm:px-8 sm:pb-8">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                  Applications
                </p>
                <p className="text-xs text-stone-400">Table view</p>
              </div>
              <div className="mt-4 space-y-3">
                {previewApplications.map((application) => (
                  <div
                    key={application.role}
                    className="rounded-2xl border border-white/10 bg-white/5 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {application.role}
                        </p>
                        <p className="mt-1 text-sm text-stone-300">
                          {application.note}
                        </p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-xs text-stone-200">
                        {application.stage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                  Pipeline
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {previewStages.map((stage) => (
                    <span
                      key={stage}
                      className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-stone-200"
                    >
                      {stage}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-6 text-stone-300">
                  Move roles forward without rebuilding your process in a generic
                  project board.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                  Reminders
                </p>
                <div className="mt-4 space-y-3">
                  {previewReminders.map((reminder) => (
                    <div key={reminder} className="flex items-start gap-2.5">
                      <span className="mt-1 size-2 rounded-full bg-accent" />
                      <p className="text-sm leading-6 text-stone-300">
                        {reminder}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="developers" className="space-y-6">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
            Value Proposition
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-stone-950">
            Built around the messy middle of a real developer search.
          </h2>
          <p className="text-sm leading-7 text-stone-600">
            The product focuses on application volume, interview movement,
            follow-ups, and resume variants. It avoids bloated CRM behavior and
            keeps the workflow small enough to use every day.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {developerValueProps.map((item) => (
            <Card
              key={item.title}
              className="rounded-[1.75rem] border border-black/10 bg-white/90 shadow-sm"
            >
              <CardHeader className="px-6 pt-6">
                <CardTitle className="text-xl font-semibold tracking-tight text-stone-950">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6 text-sm leading-7 text-stone-600">
                {item.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="features" className="space-y-6">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
            Feature Highlights
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-stone-950">
            The launch scope is intentionally practical.
          </h2>
          <p className="text-sm leading-7 text-stone-600">
            DevApply covers the workflow that matters during an active search:
            clear application tracking, a visible pipeline, reminder support,
            resume attachments, and basic funnel insight.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featureHighlights.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                className="rounded-[1.75rem] border border-black/10 bg-white/90 shadow-sm"
              >
                <CardHeader className="px-6 pt-6">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="pt-3 text-xl font-semibold tracking-tight text-stone-950">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-7 text-stone-600">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="pricing" className="space-y-6">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
            Pricing
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-stone-950">
            Start free. Remove the caps when your search needs more room.
          </h2>
          <p className="text-sm leading-7 text-stone-600">
            Both plans use the same product. Pro removes the limits on
            applications, reminders, and resume versions when the search grows.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.name}
              className={cn(
                "rounded-[1.75rem] border bg-white shadow-sm",
                tier.highlighted
                  ? "border-primary/20 ring-2 ring-primary/10"
                  : "border-black/10 bg-white/90",
              )}
            >
              <CardHeader className="px-6 pt-6">
                {tier.highlighted ? (
                  <div className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Launch plan
                  </div>
                ) : null}
                <CardTitle className="pt-3 text-2xl font-semibold tracking-tight text-stone-950">
                  {tier.name}
                </CardTitle>
                <CardDescription className="text-sm leading-7 text-stone-600">
                  {tier.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-semibold tracking-tight text-stone-950">
                    {tier.price}
                  </p>
                  {tier.priceSuffix ? (
                    <p className="pb-1 text-sm text-stone-500">
                      {tier.priceSuffix}
                    </p>
                  ) : null}
                </div>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-600">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-1 flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="size-3.5" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  {tier.name === "Pro" && user?.plan === "FREE" ? (
                    <UpgradeButton
                      label="Upgrade to Pro"
                      className={cn(
                        buttonVariants({
                          size: "lg",
                          variant: tier.ctaVariant,
                        }),
                        "w-full justify-center rounded-full",
                      )}
                    />
                  ) : tier.name === "Pro" && user?.plan === "PRO" ? (
                    <Link
                      href="/dashboard"
                      className={cn(
                        buttonVariants({
                          size: "lg",
                          variant: tier.ctaVariant,
                        }),
                        "w-full justify-center rounded-full",
                      )}
                    >
                      Open dashboard
                    </Link>
                  ) : tier.name === "Free" && user ? (
                    <Link
                      href="/dashboard"
                      className={cn(
                        buttonVariants({
                          size: "lg",
                          variant: tier.ctaVariant,
                        }),
                        "w-full justify-center rounded-full",
                      )}
                    >
                      Open dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/sign-up"
                      className={cn(
                        buttonVariants({
                          size: "lg",
                          variant: tier.ctaVariant,
                        }),
                        "w-full justify-center rounded-full",
                      )}
                    >
                      {tier.name === "Pro" ? "Sign up to upgrade" : tier.ctaLabel}
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-sm leading-7 text-stone-600">
          Signed-in users can start hosted checkout directly from the Pro tier.
          New users still begin with account creation first.
        </p>
      </section>

      <section>
        <Card className="rounded-[2rem] border border-black/10 bg-stone-950 text-white shadow-sm">
          <CardContent className="flex flex-col gap-6 px-8 py-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
                Get Started
              </p>
              <h2 className="text-3xl font-semibold tracking-tight">
                Set up the tracker before your search gets harder to manage.
              </h2>
              <p className="text-sm leading-7 text-stone-300">
                Start on the free plan, bring your current applications into one
                place, and upgrade only if you outgrow the built-in limits.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/sign-in"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-full bg-white px-5 text-stone-950 hover:bg-stone-100",
                )}
              >
                Create free account
              </Link>
              <Link
                href="/#features"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "rounded-full border-white/20 bg-white/5 px-5 text-white hover:bg-white/10 hover:text-white",
                )}
              >
                Review features
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="rounded-[1.75rem] border border-black/10 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
              Support
            </p>
            <h2 className="text-xl font-semibold tracking-tight text-stone-950">
              Need help before or after signup?
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-stone-600">
              Reach the DevApply team directly for billing questions, account
              issues, or launch feedback.
            </p>
          </div>
          <a
            href={SUPPORT_MAILTO}
            className="text-sm font-medium text-primary underline underline-offset-4"
          >
            {SUPPORT_EMAIL}
          </a>
        </div>
      </section>
    </div>
  );
}
