"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Columns3,
  LayoutDashboard,
  List,
  Search,
  User,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { openCommandPalette, requestNewApplication } from "@/shared/lib/app-commands";

const tabs: ReadonlyArray<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/dashboard", label: "Today", icon: LayoutDashboard },
  { href: "/pipeline", label: "Pipeline", icon: Columns3 },
  { href: "/applications", label: "Apps", icon: List },
  { href: "/reminders", label: "Remind", icon: Bell },
  { href: "/settings", label: "Me", icon: User },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Compact top bar for mobile — brand + search (opens ⌘K palette) + new. */
export function MobileTopBar() {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-surface/85 px-4 py-2.5 backdrop-blur lg:hidden">
      <Link href="/dashboard" className="flex items-center gap-2">
        <Image
          src="/devapply-logo-optimized.svg"
          alt="DevApply"
          width={20}
          height={20}
          className="h-5 w-auto"
        />
        <span className="text-sm font-semibold text-text">DevApply</span>
      </Link>
      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          onClick={openCommandPalette}
          aria-label="Search"
          className="grid size-9 place-items-center rounded-button text-text-2 transition-colors hover:bg-surface-2 hover:text-text"
        >
          <Search className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={requestNewApplication}
          aria-label="New application"
          className="grid size-9 place-items-center rounded-button bg-text text-canvas transition-colors hover:bg-text-2"
        >
          <span className="font-mono text-base leading-none">+</span>
        </button>
      </div>
    </header>
  );
}

/** Fixed bottom tab bar — the primary mobile navigation. */
export function MobileBottomNav() {
  const pathname = usePathname() ?? "/dashboard";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-border bg-surface/92 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = isActive(pathname, tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1 py-2 font-mono text-[10.5px]",
              active ? "text-text" : "text-text-3",
            )}
          >
            <span
              className={cn(
                "grid size-6 place-items-center rounded",
                active ? "bg-text text-canvas" : "bg-transparent",
              )}
            >
              <Icon className="size-4" aria-hidden />
            </span>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
