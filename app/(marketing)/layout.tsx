import type { ReactNode } from "react";
import Link from "next/link";

import { TrackedLink } from "@/features/analytics/components/tracked-link";
import { marketingNavigation } from "@/features/navigation/config";

export default function MarketingLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.16),_transparent_28%),linear-gradient(180deg,_#fffdf7_0%,_#f5f5f4_100%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6">
        <header className="flex flex-col gap-3 rounded-[2rem] border border-black/10 bg-white/80 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-sm font-semibold tracking-tight text-stone-950">
            DevApply
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm text-stone-600 sm:justify-end">
            {marketingNavigation.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-stone-950">
                {item.label}
              </Link>
            ))}
            <TrackedLink
              href="/sign-in"
              event="signup"
              properties={{ source: "marketing_header" }}
              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
            >
              Start free
            </TrackedLink>
          </nav>
        </header>
        <main className="flex-1 py-10">{children}</main>
      </div>
    </div>
  );
}
