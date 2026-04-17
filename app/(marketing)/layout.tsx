import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Image from "next/image";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";


import "@/app/globals.css";

import { TrackedLink } from "@/features/analytics/components/tracked-link";
import { marketingNavigation } from "@/widgets/app-shell/model/navigation-items";

export const metadata: Metadata = {
  title: "DevApply",
  description:
    "Production-quality foundation for a developer job application tracker SaaS.",
};

const footerLinks = {
  product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Changelog", href: "#" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Github", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default async function MarketingLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { userId } = await auth();

  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-canvas text-text antialiased">
        <ClerkProvider>
          <div className="min-h-screen bg-[radial-gradient(circle_at_top,_var(--primary-soft),_transparent_28%),linear-gradient(180deg,_hsl(var(--canvas))_0%,_color-mix(in_oklab,_hsl(var(--canvas))_92%,_hsl(var(--card))_8%)_100%)]">
            <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6">
              {/* ── Header — glassmorphism nav, no explicit border ── */}
              <header
                className="flex flex-col gap-3 rounded-2xl px-5 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"
                style={{
                  background: "hsl(var(--card) / 0.7)",
                  boxShadow:
                    "0 1px 0 0 hsl(var(--border) / 0.15), 0 8px 24px var(--shadow-sm)",
                }}
              >
                <Link
                  href="/"
                  className="text-sm font-semibold tracking-tight text-text"
                >
                  <Image
                    src="/devapply-logo-optimized.svg"
                    alt="DevApply logo"
                    width={1200}
                    height={360}
                    priority
                    className="inline-block h-10 w-auto"
                  />
                </Link>
                <nav className="flex flex-wrap items-center gap-5 text-sm text-text-3 sm:justify-end">
                  {marketingNavigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="transition-colors duration-200 hover:text-text"
                    >
                      {item.label}
                    </Link>
                  ))}
                  {!userId ? (
                    <>
                      <Link
                        href="/sign-in"
                        className="rounded-button px-4 py-2 text-sm font-medium text-text/90 transition-colors duration-200 hover:text-text"
                        style={{
                          background: "hsl(var(--canvas) / 0.6)",
                        }}
                      >
                        Sign in
                      </Link>
                      <TrackedLink
                        href="/sign-up"
                        event="signup"
                        properties={{ source: "marketing_header" }}
                        className="rounded-button bg-primary px-4 py-2 text-sm font-semibold text-primary-on transition-opacity hover:opacity-90"
                      >
                        Start free
                      </TrackedLink>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/dashboard"
                        className="rounded-button px-4 py-2 text-sm font-medium text-text/90 transition-colors duration-200 hover:text-text"
                        style={{
                          background: "hsl(var(--canvas) / 0.6)",
                        }}
                      >
                        Dashboard
                      </Link>
                      <UserButton />
                    </>
                  )}
                </nav>
              </header>

              <main className="flex-1 py-12">{children}</main>

              {/* ── Footer — multi-column, tonal shift, no border ── */}
              <footer
                className="mt-4 rounded-2xl px-8 py-10"
                style={{ background: "hsl(var(--card))" }}
              >
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Brand column */}
                  <div className="space-y-3 lg:col-span-1">
                    <Image
                      src="/devapply-logo-optimized.svg"
                      alt="DevApply logo"
                      width={1200}
                      height={360}
                      className="h-8 w-auto opacity-70"
                    />
                    <p className="text-xs leading-relaxed text-text-3/75">
                      Built for architects of the web.
                      <br />
                      Manage your career like a codebase.
                    </p>
                  </div>

                  {/* Product */}
                  <div className="space-y-3">
                    <h4 className="font-label text-[11px] font-semibold uppercase tracking-[0.2em] text-text-3/85">
                      Product
                    </h4>
                    <ul className="space-y-2">
                      {footerLinks.product.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className="text-sm text-text-3/85 transition-colors duration-200 hover:text-text"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Company */}
                  <div className="space-y-3">
                    <h4 className="font-label text-[11px] font-semibold uppercase tracking-[0.2em] text-text-3/85">
                      Company
                    </h4>
                    <ul className="space-y-2">
                      {footerLinks.company.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className="text-sm text-text-3/85 transition-colors duration-200 hover:text-text"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Legal */}
                  <div className="space-y-3">
                    <h4 className="font-label text-[11px] font-semibold uppercase tracking-[0.2em] text-text-3/85">
                      Legal
                    </h4>
                    <ul className="space-y-2">
                      {footerLinks.legal.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className="text-sm text-text-3/85 transition-colors duration-200 hover:text-text"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Copyright — ghost border separator */}
                <div
                  className="mt-8 pt-6 text-center"
                  style={{
                    borderTop: "1px solid hsl(var(--border) / 0.15)",
                  }}
                >
                  <p className="font-label text-[11px] text-text-3/85">
                    © {new Date().getFullYear()} DevApply. Built for architects
                    of the web.
                  </p>
                </div>
              </footer>
            </div>
          </div>
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  );
}
