import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BellRing,
  Check,
  FileText,
  KanbanSquare,
  Terminal,
} from "lucide-react";

import { buttonVariants } from "@/shared/ui/button";
import {
  FREE_PLAN_LIMITS,
  PRO_PLAN_PRICE_MONTHLY,
} from "@/features/billing/config";
import { UpgradeButton } from "@/features/billing/components/upgrade-button";
import { getCurrentUser } from "@/features/auth/server/session";
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/shared/lib/support";
import { cn } from "@/shared/lib/utils";

export const metadata: Metadata = {
  title: "Job Application Tracker for Developers | DevApply",
  description:
    "Stop using generic spreadsheets. Track your career growth with an IDE-inspired workflow designed for technical talent.",
};

/* ─── Data ─── */

const testimonials = [
  {
    quote:
      "DevApply turned my chaotic job hunt into a manageable pipeline. The technical focus is exactly what's missing in other tools.",
    name: "Alex Rivera",
    role: "Senior Frontend Engineer",
    initials: "AR",
  },
  {
    quote:
      "Finally, a tool that understands markdown and versioning. It feels like a natural extension of my development environment.",
    name: "Sarah Chen",
    role: "DevOps Architect",
    initials: "SC",
  },
  {
    quote:
      "The career insights helped me negotiate a 20% higher salary. The data it tracks is actually meaningful for my role.",
    name: "Jordan Smith",
    role: "Fullstack Lead",
    initials: "JS",
  },
] as const;

const features = [
  {
    icon: KanbanSquare,
    title: "Application Tracking",
    description:
      "Visualize your journey with a technical Kanban. Move applications from 'Applied' to 'Offer' with a single hotkey.",
    accent: "primary" as const,
  },
  {
    icon: FileText,
    title: "Resume Storage",
    description:
      "Version-controlled resume management. Link specific versions to specific applications instantly.",
    accent: "accent" as const,
  },
  {
    icon: BellRing,
    title: "Reminders",
    description:
      "Automated follow-up reminders that integrate directly with your calendar. Never miss a deadline.",
    accent: "primary" as const,
  },
  {
    icon: BarChart3,
    title: "Career Insights",
    description:
      "Data-driven analytics on your interview performance and application funnel. Benchmark your growth.",
    accent: "accent" as const,
  },
] as const;

const pricingTiers = [
  {
    name: "The Junior",
    description: "Perfect for evaluating the workflow or a lighter search.",
    price: "$0",
    priceSuffix: null,
    ctaLabel: "Sign up free",
    ctaVariant: "outline" as const,
    highlighted: false,
    features: [
      `Track up to ${FREE_PLAN_LIMITS.applications} applications`,
      "Basic Career Kanban",
      `${FREE_PLAN_LIMITS.resumes} saved resume version`,
      `${FREE_PLAN_LIMITS.reminders} active reminders`,
    ],
  },
  {
    name: "The Architect",
    description: "For longer searches where free plan caps become friction.",
    price: `$${PRO_PLAN_PRICE_MONTHLY}`,
    priceSuffix: "/ month",
    ctaLabel: "Start with the free account",
    ctaVariant: "default" as const,
    highlighted: true,
    features: [
      "Unlimited active applications",
      "Multi-resume management",
      "Advanced career insights",
      "No plan limits on any core feature",
    ],
  },
] as const;

const appRows = [
  {
    company: "Stripe",
    role: "Platform Engineer",
    status: "Interview",
    statusColor: "var(--accent)",
  },
  {
    company: "Linear",
    role: "Frontend Infrastructure",
    status: "Applied",
    statusColor: "var(--primary)",
  },
  {
    company: "Vercel",
    role: "Full-Stack Product",
    status: "Follow-up",
    statusColor: "var(--muted-foreground)",
  },
  {
    company: "Supabase",
    role: "Developer Relations",
    status: "Offer",
    statusColor: "155 69% 59%",
  },
  {
    company: "PlanetScale",
    role: "Backend Systems",
    status: "Wishlist",
    statusColor: "var(--muted-foreground)",
  },
];

/* ─── Page ─── */

export default async function MarketingHomePage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-28">
      {/* ── Hero ── */}
      <section className="space-y-10 pt-8 text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5"
          style={{
            background: "hsl(var(--primary) / 0.06)",
            boxShadow: "inset 0 0 0 1px hsl(var(--primary) / 0.12)",
          }}
        >
          <Terminal className="size-3" style={{ color: "hsl(var(--accent))" }} />
          <span className="font-label text-[0.68rem] font-medium uppercase tracking-[0.22em] text-primary/90">
            Built for architects of the web
          </span>
        </div>

        {/* Headline */}
        <div className="mx-auto max-w-4xl space-y-6">
          <h1 className="font-display text-5xl font-extrabold leading-[1.06] tracking-tight text-foreground sm:text-6xl lg:text-[4.5rem]">
            Stop using spreadsheets.{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)",
              }}
            >
              Debug your career.
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Track your career growth with an IDE-inspired workflow designed for
            technical talent. Powerful tools to manage your pipeline without the
            friction.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/sign-up"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-xl px-8 text-sm font-semibold",
              "text-[hsl(var(--primary-foreground))]",
            )}
            style={{
              backgroundImage:
                "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-container)) 100%)",
            }}
          >
            Start for free
            <ArrowRight className="ml-1 size-4" />
          </Link>
          <Link
            href="/#pricing"
            className={cn(
              buttonVariants({ size: "lg", variant: "ghost" }),
              "rounded-xl px-8 text-sm text-muted-foreground hover:text-foreground",
            )}
          >
            View pricing
          </Link>
        </div>

        {/* Trust row */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground/80">
          {[
            `Free plan includes ${FREE_PLAN_LIMITS.applications} applications`,
            `${FREE_PLAN_LIMITS.resumes} saved resume version`,
            "No credit card required",
          ].map((text) => (
            <span key={text} className="flex items-center gap-1.5">
              <Check
                className="size-3.5"
                style={{ color: "hsl(var(--accent))" }}
              />
              {text}
            </span>
          ))}
        </div>

        {/* ── Dashboard Preview ── */}
        <div className="relative mx-auto mt-4 max-w-5xl">
          {/* Ambient glow */}
          <div
            className="pointer-events-none absolute -inset-x-12 -top-12 h-56 opacity-50"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.3), transparent 70%)",
            }}
          />

          {/* Browser chrome - no explicit borders, tonal shift */}
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{
              boxShadow: "0 24px 64px rgba(6, 14, 32, 0.55)",
            }}
          >
            {/* Title bar */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ background: "hsl(var(--card))" }}
            >
              <div className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                <span className="size-2.5 rounded-full bg-[#febc2e]" />
                <span className="size-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div
                className="mx-auto flex h-5 items-center gap-1.5 rounded-full px-3"
                style={{
                  background: "hsl(var(--background))",
                }}
              >
                <span
                  className="size-1.5 rounded-full"
                  style={{ background: "hsl(var(--accent))" }}
                />
                <span className="font-label text-[10px] text-muted-foreground/75">
                  devapply.io/applications
                </span>
              </div>
              <div className="w-12" />
            </div>

            {/* App layout */}
            <div
              className="flex"
              style={{ height: 340, background: "hsl(var(--background))" }}
            >
              {/* Sidebar — surface-container-low, NO border-right */}
              <div
                className="flex w-44 shrink-0 flex-col gap-0.5 px-3 py-4"
                style={{ background: "hsl(var(--card))" }}
              >
                <div className="mb-4 flex items-center gap-2 px-2">
                  <div
                    className="flex size-5 items-center justify-center rounded"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(var(--primary)/0.3), hsl(var(--primary-container)/0.3))",
                    }}
                  />
                  <span className="font-label text-[11px] font-semibold text-foreground/85">
                    DevApply
                  </span>
                </div>
                {[
                  { label: "Dashboard", active: false },
                  { label: "Applications", active: true },
                  { label: "Pipeline", active: false },
                  { label: "Reminders", active: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-2 py-1.5",
                      item.active
                        ? "text-primary"
                        : "text-muted-foreground/75",
                    )}
                    style={{
                      background: item.active
                        ? "hsl(var(--primary)/0.08)"
                        : undefined,
                    }}
                  >
                    <div
                      className="size-3 rounded-sm"
                      style={{
                        background: item.active
                          ? "hsl(var(--primary)/0.4)"
                          : "hsl(var(--border)/0.3)",
                      }}
                    />
                    <span className="font-label text-[11px]">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="flex flex-1 flex-col overflow-hidden px-5 py-4">
                {/* Top bar */}
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <span className="font-display text-sm font-semibold text-foreground">
                      Applications
                    </span>
                    <span
                      className="ml-2 font-label text-[10px] text-muted-foreground/75"
                      style={{
                        background: "hsl(var(--secondary))",
                        borderRadius: "0.375rem",
                        padding: "1px 6px",
                      }}
                    >
                      24
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-6 w-14 rounded-lg"
                      style={{ background: "hsl(var(--secondary))" }}
                    />
                    <div
                      className="h-6 w-20 rounded-lg"
                      style={{
                        background:
                          "linear-gradient(135deg, hsl(var(--primary)/0.25) 0%, hsl(var(--primary-container)/0.25) 100%)",
                      }}
                    />
                  </div>
                </div>

                {/* Column headers */}
                <div className="mb-1 flex items-center gap-3 px-3 py-1">
                  {["Company", "Role", "Status"].map((h) => (
                    <span
                      key={h}
                      className="font-label text-[9px] uppercase tracking-widest text-muted-foreground/85"
                      style={{
                        flex: h === "Role" ? 1 : "none",
                        width:
                          h === "Company"
                            ? 64
                            : h === "Status"
                              ? 56
                              : undefined,
                      }}
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {/* Rows */}
                <div className="space-y-0.5">
                  {appRows.map((row, i) => (
                    <div
                      key={`${row.company}-${i}`}
                      className="flex items-center gap-3 rounded-lg px-3 py-2"
                      style={{
                        background:
                          i === 0
                            ? "hsl(var(--secondary)/0.6)"
                            : "transparent",
                      }}
                    >
                      <div
                        className="flex size-6 shrink-0 items-center justify-center rounded-md font-label text-[9px] font-bold"
                        style={{
                          background: `hsl(${row.statusColor} / 0.1)`,
                          color: `hsl(${row.statusColor})`,
                        }}
                      >
                        {row.company[0]}
                      </div>
                      <span className="w-16 shrink-0 font-label text-[11px] font-medium text-foreground/90">
                        {row.company}
                      </span>
                      <span className="flex-1 truncate font-label text-[10px] text-muted-foreground/80">
                        {row.role}
                      </span>
                      <span
                        className="w-14 rounded-full px-2 py-0.5 text-center font-label text-[9px] font-medium"
                        style={{
                          background: `hsl(${row.statusColor} / 0.1)`,
                          color: `hsl(${row.statusColor})`,
                        }}
                      >
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right stats panel — tonal shift, NO border-left */}
              <div
                className="hidden w-40 shrink-0 flex-col gap-3 px-4 py-4 lg:flex"
                style={{ background: "hsl(var(--card))" }}
              >
                <span className="font-label text-[9px] uppercase tracking-widest text-muted-foreground/85">
                  This week
                </span>
                {[
                  {
                    label: "Applied",
                    value: "8",
                    color: "hsl(var(--primary))",
                    pct: "72%",
                  },
                  {
                    label: "Interviews",
                    value: "3",
                    color: "hsl(var(--accent))",
                    pct: "38%",
                  },
                  {
                    label: "Follow-ups",
                    value: "5",
                    color: "hsl(var(--muted-foreground))",
                    pct: "55%",
                  },
                ].map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-label text-[10px] text-muted-foreground/80">
                        {stat.label}
                      </span>
                      <span
                        className="font-display text-sm font-bold"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </span>
                    </div>
                    <div
                      className="h-1 overflow-hidden rounded-full"
                      style={{ background: "hsl(var(--secondary))" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: stat.pct,
                          background: stat.color,
                          opacity: 0.7,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="space-y-10">
        <div className="space-y-4 text-center">
          <p className="font-label text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground/80">
            Features
          </p>
          <h2 className="font-display mx-auto max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
            Powerful tools to manage your pipeline without the friction.
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground">
            Four focused capabilities that cover the complete job-search
            workflow — nothing more, nothing less.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="group relative rounded-2xl p-7 transition-colors duration-300"
              style={{
                background: "hsl(var(--card))",
              }}
            >
              {/* Hover glow */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    feat.accent === "accent"
                      ? "radial-gradient(circle at 30% 20%, hsl(var(--accent) / 0.06), transparent 60%)"
                      : "radial-gradient(circle at 30% 20%, hsl(var(--primary) / 0.06), transparent 60%)",
                }}
              />
              <div className="relative">
                <div
                  className="flex size-12 items-center justify-center rounded-2xl"
                  style={{
                    background:
                      feat.accent === "accent"
                        ? "hsl(var(--accent) / 0.1)"
                        : "hsl(var(--primary) / 0.1)",
                  }}
                >
                  <feat.icon
                    className="size-5"
                    style={{
                      color:
                        feat.accent === "accent"
                          ? "hsl(var(--accent))"
                          : "hsl(var(--primary))",
                    }}
                  />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-foreground">
                  {feat.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="space-y-10">
        <div className="space-y-4 text-center">
          <p className="font-label text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground/80">
            Why architects of the web love us
          </p>
          <h2 className="font-display mx-auto max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built for the job search you&apos;re actually running.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="relative rounded-2xl p-7"
              style={{ background: "hsl(var(--card))" }}
            >
              {/* Stars */}
              <div className="mb-5 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <svg
                    key={j}
                    className="size-3.5"
                    viewBox="0 0 12 12"
                    fill="hsl(var(--accent))"
                  >
                    <path d="M6 1l1.5 3 3.3.5-2.4 2.3.6 3.3L6 8.8l-2.9 1.3.6-3.3L1.2 4.5l3.3-.5z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-full font-label text-xs font-bold"
                  style={{
                    background:
                      i === 0
                        ? "hsl(var(--primary) / 0.15)"
                        : i === 1
                          ? "hsl(var(--accent) / 0.15)"
                          : "hsl(var(--primary-container) / 0.15)",
                    color:
                      i === 0
                        ? "hsl(var(--primary))"
                        : i === 1
                          ? "hsl(var(--accent))"
                          : "hsl(var(--primary))",
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {t.name}
                  </p>
                  <p className="font-label text-xs text-muted-foreground/80">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="space-y-10">
        <div className="space-y-4 text-center">
          <p className="font-label text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground/80">
            Choose your track
          </p>
          <h2 className="font-display mx-auto max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, developer-centric pricing. No hidden fees.
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground">
            Both plans use the same product. The Architect removes limits on
            applications, reminders, and resume versions.
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl gap-5 lg:grid-cols-2">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className="relative overflow-hidden rounded-2xl p-7"
              style={
                tier.highlighted
                  ? {
                      background: "hsl(var(--card))",
                      boxShadow:
                        "0 0 0 1px hsl(var(--primary)/0.2), 0 12px 32px rgba(6,14,32,0.4)",
                    }
                  : {
                      background: "hsl(var(--card))",
                    }
              }
            >
              {/* Pro glow */}
              {tier.highlighted && (
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 0%, hsl(var(--primary)/0.08), transparent 60%)",
                  }}
                />
              )}

              <div className="relative">
                {tier.highlighted && (
                  <div
                    className="mb-5 inline-flex items-center rounded-full px-3 py-1 font-label text-xs font-semibold uppercase tracking-[0.18em]"
                    style={{
                      background: "hsl(var(--primary)/0.12)",
                      color: "hsl(var(--primary))",
                    }}
                  >
                    Most popular
                  </div>
                )}
                <h3 className="font-display text-2xl font-bold tracking-tight text-foreground">
                  {tier.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {tier.description}
                </p>

                <div className="mt-6 flex items-end gap-1.5">
                  <span className="font-display text-4xl font-extrabold tracking-tight text-foreground">
                    {tier.price}
                  </span>
                  {tier.priceSuffix && (
                    <span className="mb-1 text-sm text-muted-foreground/80">
                      {tier.priceSuffix}
                    </span>
                  )}
                </div>

                <ul className="mt-6 space-y-3">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
                    >
                      <span
                        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full"
                        style={{ background: "hsl(var(--accent)/0.1)" }}
                      >
                        <Check
                          className="size-3"
                          style={{ color: "hsl(var(--accent))" }}
                        />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7">
                  {tier.name === "The Architect" && user?.plan === "FREE" ? (
                    <UpgradeButton
                      label="Upgrade to Architect"
                      className={cn(
                        buttonVariants({ size: "lg" }),
                        "w-full justify-center rounded-xl",
                      )}
                    />
                  ) : tier.name === "The Architect" &&
                    user?.plan === "PRO" ? (
                    <Link
                      href="/dashboard"
                      className={cn(
                        buttonVariants({ size: "lg" }),
                        "w-full justify-center rounded-xl",
                      )}
                    >
                      Open dashboard
                    </Link>
                  ) : tier.name === "The Junior" && user ? (
                    <Link
                      href="/dashboard"
                      className={cn(
                        buttonVariants({ size: "lg", variant: "outline" }),
                        "w-full justify-center rounded-xl",
                      )}
                    >
                      Open dashboard
                    </Link>
                  ) : tier.highlighted ? (
                    <Link
                      href="/sign-up"
                      className="flex w-full items-center justify-center rounded-xl px-6 py-2.5 text-sm font-semibold text-[hsl(var(--primary-foreground))] transition-opacity hover:opacity-90"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-container)) 100%)",
                      }}
                    >
                      {tier.ctaLabel}
                    </Link>
                  ) : (
                    <Link
                      href="/sign-up"
                      className={cn(
                        buttonVariants({ size: "lg", variant: "outline" }),
                        "w-full justify-center rounded-xl",
                      )}
                    >
                      {tier.ctaLabel}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section
        className="relative overflow-hidden rounded-[2rem] p-10 lg:p-16"
        style={{ background: "hsl(var(--card))" }}
      >
        {/* Glassmorphism glows */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[2rem]"
          style={{
            background:
              "radial-gradient(circle at 70% 40%, hsl(var(--primary)/0.14), transparent 50%)",
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 size-72 rounded-full opacity-20"
          style={{
            background: "hsl(var(--accent))",
            filter: "blur(80px)",
          }}
        />

        <div className="relative flex flex-col gap-10 text-center lg:text-left lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl space-y-4">
            <p className="font-label text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground/80">
              Get started
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Join 5,000+ developers who have automated their career
              progression.
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Designed for architects of the web. Manage your career like a
              codebase — start on the free plan and upgrade only if you outgrow
              the built-in limits.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 lg:justify-end">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold text-[hsl(var(--primary-foreground))] transition-opacity hover:opacity-90"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-container)) 100%)",
              }}
            >
              Create free account
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/#features"
              className={cn(
                buttonVariants({ size: "lg", variant: "ghost" }),
                "rounded-xl text-muted-foreground hover:text-foreground",
              )}
            >
              Review features
            </Link>
          </div>
        </div>
      </section>

      {/* ── Support ── */}
      <section
        className="flex flex-col gap-4 rounded-2xl p-7 sm:flex-row sm:items-center sm:justify-between"
        style={{ background: "hsl(var(--card))" }}
      >
        <div className="space-y-1.5">
          <p className="font-label text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground/80">
            Support
          </p>
          <h3 className="text-sm font-semibold text-foreground">
            Questions before or after signup?
          </h3>
          <p className="text-sm text-muted-foreground">
            Reach the DevApply team directly for billing, account issues, or
            feedback.
          </p>
        </div>
        <a
          href={SUPPORT_MAILTO}
          className="shrink-0 text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
          style={{ color: "hsl(var(--primary))" }}
        >
          {SUPPORT_EMAIL}
        </a>
      </section>
    </div>
  );
}
