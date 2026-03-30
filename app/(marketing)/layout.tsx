import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

import "@/app/globals.css";

import { TrackedLink } from "@/features/analytics/components/tracked-link";
import { marketingNavigation } from "@/features/navigation/config";

export const metadata: Metadata = {
  title: "DevApply",
  description:
    "Production-quality foundation for a developer job application tracker SaaS.",
};

export default async function MarketingLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { userId } = await auth();

  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        <ClerkProvider>
          <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.12),_transparent_28%),linear-gradient(180deg,_hsl(var(--background))_0%,_color-mix(in_oklab,_hsl(var(--background))_88%,_hsl(var(--muted))_12%)_100%)]">
            <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6">
              <header className="flex flex-col gap-3 rounded-[2rem] border border-border/70 bg-card/80 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
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
                <nav className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground sm:justify-end">
                  {marketingNavigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="transition hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                  {!userId ? (
                    <>
                      <Link
                        href="/sign-in"
                        className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground/80 transition hover:border-foreground/30 hover:text-foreground"
                      >
                        Sign in
                      </Link>
                      <TrackedLink
                        href="/sign-up"
                        event="signup"
                        properties={{ source: "marketing_header" }}
                        className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                      >
                        Start free
                      </TrackedLink>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/dashboard"
                        className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground/80 transition hover:border-foreground/30 hover:text-foreground"
                      >
                        Dashboard
                      </Link>
                      <UserButton />
                    </>
                  )}
                </nav>
              </header>
              <main className="flex-1 py-10">{children}</main>
              <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 px-2 py-6 text-sm text-muted-foreground">
                <p>DevApply</p>
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/privacy"
                    className="transition hover:text-foreground"
                  >
                    Privacy policy
                  </Link>
                  <Link
                    href="/terms"
                    className="transition hover:text-foreground"
                  >
                    Terms of service
                  </Link>
                </div>
              </footer>
            </div>
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
