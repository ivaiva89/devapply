import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

import "@/app/globals.css";

import { TrackedLink } from "@/features/analytics/components/tracked-link";
import { marketingNavigation } from "@/features/navigation/config";

export const metadata: Metadata = {
  title: "DevApply",
  description: "Production-quality foundation for a developer job application tracker SaaS.",
};

export default async function MarketingLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { userId } = await auth();

  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        <ClerkProvider>
          <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.16),_transparent_28%),linear-gradient(180deg,_#fffdf7_0%,_#f5f5f4_100%)]">
            <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6">
              <header className="flex flex-col gap-3 rounded-[2rem] border border-black/10 bg-white/80 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                <Link href="/" className="text-sm font-semibold tracking-tight text-stone-950">
                  <img src="/devapply-logo-optimized.svg" alt="DevApply logo" className="inline-block h-10 w-auto" />
                </Link>
                <nav className="flex flex-wrap items-center gap-4 text-sm text-stone-600 sm:justify-end">
                  {marketingNavigation.map((item) => (
                    <Link key={item.href} href={item.href} className="transition hover:text-stone-950">
                      {item.label}
                    </Link>
                  ))}
                  {!userId ? (
                    <>
                      <Link
                        href="/sign-in"
                        className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
                      >
                        Sign in
                      </Link>
                      <TrackedLink
                        href="/sign-up"
                        event="signup"
                        properties={{ source: "marketing_header" }}
                        className="rounded-full bg-stone-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-800"
                      >
                        Start free
                      </TrackedLink>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/dashboard"
                        className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
                      >
                        Dashboard
                      </Link>
                      <UserButton />
                    </>
                  )}
                </nav>
              </header>
              <main className="flex-1 py-10">{children}</main>
              <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-black/10 px-2 py-6 text-sm text-stone-500">
                <p>DevApply</p>
                <div className="flex flex-wrap items-center gap-4">
                  <Link href="/privacy" className="transition hover:text-stone-950">
                    Privacy policy
                  </Link>
                  <Link href="/terms" className="transition hover:text-stone-950">
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
