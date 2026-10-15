"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

// The app's sidebar: the wordmark, which leads to the start page, and
// Settings at the foot. The design's other six links arrive with their
// features.
export function Sidebar(): ReactNode {
  const pathname = usePathname();
  const isOnSettings = pathname.startsWith("/settings");

  return (
    <nav className="bg-surface-1 border-border flex w-[240px] shrink-0 flex-col justify-between border-r px-3 py-5">
      <Link href="/" className="text-text px-3 text-[16px] font-semibold">
        DevApply
      </Link>
      <Link
        href="/settings"
        aria-current={isOnSettings ? "page" : undefined}
        className={cn(
          "rounded-button hover:bg-surface-2 flex h-[44px] items-center px-3 text-[14px] sm:h-[36px]",
          isOnSettings ? "bg-surface-2 text-text font-medium" : "text-text-2",
        )}
      >
        Settings
      </Link>
    </nav>
  );
}
