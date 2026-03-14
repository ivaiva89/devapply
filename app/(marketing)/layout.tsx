import type { ReactNode } from "react";
import Link from "next/link";

import { marketingNavigation } from "@/features/navigation/config";

export default function MarketingLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.16),_transparent_28%),linear-gradient(180deg,_#fffdf7_0%,_#f5f5f4_100%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6">
        <header className="flex items-center justify-between rounded-full border border-black/10 bg-white/80 px-5 py-3 backdrop-blur">
          <Link href="/" className="text-sm font-semibold tracking-tight text-stone-950">
            DevApply
          </Link>
          <nav className="flex items-center gap-5 text-sm text-stone-600">
            {marketingNavigation.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-stone-950">
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="flex-1 py-10">{children}</main>
      </div>
    </div>
  );
}
