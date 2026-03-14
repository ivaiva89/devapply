import type { ReactNode } from "react";
import Link from "next/link";

import { appNavigation } from "@/features/navigation/config";

export default function AppLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-stone-100">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
              DevApply
            </p>
            <h1 className="mt-2 text-lg font-semibold tracking-tight text-stone-950">
              Job Tracker MVP
            </h1>
          </div>
          <nav className="mt-8 space-y-2">
            {appNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl px-3 py-2 text-sm text-stone-600 transition hover:bg-stone-100 hover:text-stone-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="py-1">{children}</main>
      </div>
    </div>
  );
}
