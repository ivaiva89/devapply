"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { appNavigation } from "@/widgets/app-shell/model/navigation-items";

type AppSidebarPresenterProps = {
  currentPath?: string;
  applicationsUsed?: number;
  applicationsLimit?: number;
};

function isItemActive(currentPath: string, href: string) {
  if (href === "/dashboard") return currentPath === href;
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export function AppSidebarPresenter({
  currentPath,
  applicationsUsed = 0,
  applicationsLimit = 30,
}: AppSidebarPresenterProps) {
  const pathname = usePathname();
  const activePath = pathname ?? currentPath ?? "/dashboard";

  const usagePercent = Math.min((applicationsUsed / applicationsLimit) * 100, 100);
  const isNearLimit = usagePercent >= 80;

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="border-b border-border px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <Image
            src="/devapply-logo-optimized.svg"
            alt="DevApply"
            width={24}
            height={24}
            className="h-6 w-auto shrink-0"
          />
          <span className="text-sm font-semibold text-text">DevApply</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-2 py-3">
        {appNavigation.map((item) => {
          const isActive = isItemActive(activePath, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-8 items-center justify-between rounded-sm px-2 text-sm transition-colors duration-[120ms]",
                isActive
                  ? "bg-surface-2 font-medium text-text"
                  : "text-text-2 hover:bg-surface-2 hover:text-text",
              )}
            >
              <span className="flex items-center gap-2">
                <Icon className="size-4 shrink-0" />
                {item.label}
              </span>
              <span className="font-mono text-[10px] text-text-4">{item.hotkey}</span>
            </Link>
          );
        })}
      </nav>

      {/* Usage widget */}
      <div className="border-t border-border px-3 py-3">
        <Link
          href="/settings"
          className="block rounded-sm p-2 transition-colors hover:bg-surface-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-3">Applications</span>
            <span
              className={cn(
                "font-mono text-xs tabular-nums",
                isNearLimit ? "text-warning" : "text-text-3",
              )}
            >
              {applicationsUsed} / {applicationsLimit}
            </span>
          </div>
          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-surface-3">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                isNearLimit ? "bg-warning" : "bg-primary",
              )}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </Link>
      </div>
    </div>
  );
}
