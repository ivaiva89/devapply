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

const footerLinks = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

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
          <div
            className="min-h-screen"
            style={{
              background:
                "radial-gradient(ellipse 800px 400px at 8% 0%, color-mix(in srgb, var(--primary) 9%, transparent), transparent 60%), radial-gradient(ellipse 600px 400px at 100% 4%, color-mix(in srgb, var(--accent) 7%, transparent), transparent 60%), var(--canvas)",
            }}
          >
            <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6">
              {/* ── Flat top nav ── */}
              <header className="flex items-center gap-6 py-5">
                <Link
                  href="/"
                  className="flex items-center gap-2.5 text-text"
                  aria-label="DevApply home"
                >
                  <Image
                    src="/devapply-logo-optimized.svg"
                    alt="DevApply logo"
                    width={1200}
                    height={360}
                    priority
                    className="h-8 w-auto"
                  />
                </Link>
                <nav className="ml-4 hidden items-center gap-5 text-sm text-text-2 sm:flex">
                  {marketingNavigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="transition-colors duration-150 hover:text-text"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="ml-auto flex items-center gap-2">
                  {!userId ? (
                    <>
                      <Link
                        href="/sign-in"
                        className="rounded-button px-3 py-1.5 text-sm font-medium text-text-2 transition-colors duration-150 hover:bg-surface-1 hover:text-text"
                      >
                        Sign in
                      </Link>
                      <TrackedLink
                        href="/sign-up"
                        event="signup"
                        properties={{ source: "marketing_header" }}
                        className="inline-flex items-center gap-1.5 rounded-button bg-text px-4 py-1.5 text-sm font-medium text-canvas transition-colors duration-150 hover:bg-text-2"
                      >
                        Start free
                        <span aria-hidden className="font-mono text-xs opacity-60">
                          →
                        </span>
                      </TrackedLink>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/dashboard"
                        className="rounded-button px-3 py-1.5 text-sm font-medium text-text-2 transition-colors duration-150 hover:bg-surface-1 hover:text-text"
                      >
                        Dashboard
                      </Link>
                      <UserButton />
                    </>
                  )}
                </div>
              </header>

              <main className="flex-1">{children}</main>

              {/* ── Light, token-driven footer ── */}
              <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border py-8 sm:flex-row">
                <p className="font-mono text-xs text-text-3">
                  © {new Date().getFullYear()} DevApply · Manage your career like a
                  codebase.
                </p>
                <nav className="flex items-center gap-5 text-sm text-text-3">
                  {footerLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="transition-colors duration-150 hover:text-text"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </footer>
            </div>
          </div>
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  );
}
