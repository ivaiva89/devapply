import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Inter, Manrope, Space_Grotesk } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

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
      className={`${inter.variable} ${manrope.variable} ${spaceGrotesk.variable}`}
    >
      <body className="bg-background text-foreground antialiased">
        <ClerkProvider>
          <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(75,77,216,0.14),_transparent_28%),linear-gradient(180deg,_hsl(var(--background))_0%,_color-mix(in_oklab,_hsl(var(--background))_92%,_hsl(var(--card))_8%)_100%)]">
            <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6">
              {/* ── Header — glassmorphism nav, no explicit border ── */}
              <header
                className="flex flex-col gap-3 rounded-2xl px-5 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"
                style={{
                  background: "hsl(var(--card) / 0.7)",
                  boxShadow:
                    "0 1px 0 0 hsl(var(--border) / 0.15), 0 8px 24px rgba(6,14,32,0.2)",
                }}
              >
                <Link
                  href="/"
                  className="text-sm font-semibold tracking-tight text-foreground"
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
                <nav className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground sm:justify-end">
                  {marketingNavigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="transition-colors duration-200 hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                  {!userId ? (
                    <>
                      <Link
                        href="/sign-in"
                        className="rounded-xl px-4 py-2 text-sm font-medium text-foreground/90 transition-colors duration-200 hover:text-foreground"
                        style={{
                          background: "hsl(var(--background) / 0.6)",
                        }}
                      >
                        Sign in
                      </Link>
                      <TrackedLink
                        href="/sign-up"
                        event="signup"
                        properties={{ source: "marketing_header" }}
                        className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                      >
                        Start free
                      </TrackedLink>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/dashboard"
                        className="rounded-xl px-4 py-2 text-sm font-medium text-foreground/90 transition-colors duration-200 hover:text-foreground"
                        style={{
                          background: "hsl(var(--background) / 0.6)",
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
                    <p className="text-xs leading-relaxed text-muted-foreground/75">
                      Built for architects of the web.
                      <br />
                      Manage your career like a codebase.
                    </p>
                  </div>

                  {/* Product */}
                  <div className="space-y-3">
                    <h4 className="font-label text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/85">
                      Product
                    </h4>
                    <ul className="space-y-2">
                      {footerLinks.product.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className="text-sm text-muted-foreground/85 transition-colors duration-200 hover:text-foreground"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Company */}
                  <div className="space-y-3">
                    <h4 className="font-label text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/85">
                      Company
                    </h4>
                    <ul className="space-y-2">
                      {footerLinks.company.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className="text-sm text-muted-foreground/85 transition-colors duration-200 hover:text-foreground"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Legal */}
                  <div className="space-y-3">
                    <h4 className="font-label text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/85">
                      Legal
                    </h4>
                    <ul className="space-y-2">
                      {footerLinks.legal.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className="text-sm text-muted-foreground/85 transition-colors duration-200 hover:text-foreground"
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
                  <p className="font-label text-[11px] text-muted-foreground/85">
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
