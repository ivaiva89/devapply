"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", hotkey: "G D" },
  { href: "/pipeline", label: "Pipeline", hotkey: "G P" },
  { href: "/applications", label: "Applications", hotkey: "G A" },
  { href: "/reminders", label: "Reminders", hotkey: "G N" },
  { href: "/resumes", label: "Resumes", hotkey: "G R" },
] as const;

const pipelineStatuses = [
  { key: "WISHLIST", label: "Saved", color: "var(--text-4)" },
  { key: "APPLIED", label: "Applied", color: "var(--primary)" },
  { key: "INTERVIEW", label: "Interview", color: "var(--accent)" },
  { key: "OFFER", label: "Offer", color: "var(--success)" },
  { key: "REJECTED", label: "Rejected", color: "var(--danger)" },
] as const;

type AppSidebarPresenterProps = {
  currentPath?: string;
  applicationsUsed?: number;
  applicationsLimit?: number;
  remindersUsed?: number;
  remindersLimit?: number;
  planLabel?: string;
  statusCounts?: Record<string, number>;
};

function isItemActive(currentPath: string, href: string): boolean {
  if (href === "/dashboard") return currentPath === href;
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export function AppSidebarPresenter({
  currentPath,
  applicationsUsed = 0,
  applicationsLimit = 10,
  remindersUsed = 0,
  remindersLimit = 3,
  planLabel = "Free",
  statusCounts = {},
}: AppSidebarPresenterProps) {
  const pathname = usePathname();
  const activePath = pathname ?? currentPath ?? "/dashboard";

  const appUsagePct = Math.min((applicationsUsed / applicationsLimit) * 100, 100);
  const reminderUsagePct = Math.min((remindersUsed / remindersLimit) * 100, 100);
  const isPro = planLabel !== "Free";

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Brand row */}
      <div className="flex items-center gap-2.5 border-b border-border px-3 py-4">
        <Link href="/dashboard" className="flex min-w-0 flex-1 items-center gap-2.5">
          <Image
            src="/devapply-logo-optimized.svg"
            alt="DevApply"
            width={22}
            height={22}
            className="h-5 w-auto shrink-0"
          />
          <span className="text-sm font-semibold text-text">DevApply</span>
        </Link>
        <span className="shrink-0 rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-text-3">
          {planLabel}
        </span>
      </div>

      {/* Main nav */}
      <nav className="flex-1 space-y-0.5 px-2 py-3">
        {mainNavItems.map((item) => {
          const isActive = isItemActive(activePath, item.href);
          const isReminders = item.href === "/reminders";
          const isApplications = item.href === "/applications";
          const count = isApplications
            ? applicationsUsed
            : isReminders
              ? remindersUsed
              : null;

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
              <span>{item.label}</span>
              {count !== null ? (
                <span
                  className={cn(
                    "font-mono text-[10.5px] tabular-nums",
                    isReminders && remindersUsed > 0
                      ? "text-accent"
                      : "text-text-3",
                  )}
                >
                  {count}
                </span>
              ) : (
                <span className="font-mono text-[10.5px] text-text-4">
                  {item.hotkey}
                </span>
              )}
            </Link>
          );
        })}

        {/* Pipeline section */}
        <div className="mt-5">
          <p className="px-2 pb-1.5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-text-4">
            Pipeline
          </p>
          {pipelineStatuses.map((status) => {
            const count = statusCounts[status.key] ?? 0;
            return (
              <div
                key={status.key}
                className="flex h-7 items-center justify-between rounded-sm px-2 text-sm text-text-2"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: status.color }}
                  />
                  {status.label}
                </span>
                <span className="font-mono text-[10.5px] tabular-nums text-text-3">
                  {count}
                </span>
              </div>
            );
          })}
        </div>

        {/* Account section */}
        <div className="mt-5">
          <p className="px-2 pb-1.5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-text-4">
            Account
          </p>
          <Link
            href="/settings"
            aria-current={isItemActive(activePath, "/settings") ? "page" : undefined}
            className={cn(
              "flex h-8 items-center justify-between rounded-sm px-2 text-sm transition-colors duration-[120ms]",
              isItemActive(activePath, "/settings")
                ? "bg-surface-2 font-medium text-text"
                : "text-text-2 hover:bg-surface-2 hover:text-text",
            )}
          >
            <span>Settings</span>
            <span className="font-mono text-[10.5px] text-text-4">G S</span>
          </Link>
        </div>
      </nav>

      {/* Usage card */}
      <div className="border-t border-border p-3">
        <div className="rounded-md border border-border bg-surface p-3">
          <div className="mb-1 flex items-center justify-between text-xs text-text-2">
            <span>Applications</span>
            <span className="font-mono text-text tabular-nums">
              {applicationsUsed} / {applicationsLimit}
            </span>
          </div>
          <div className="mb-2.5 h-1 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${appUsagePct}%` }}
            />
          </div>
          <div className="mb-1 flex items-center justify-between text-xs text-text-2">
            <span>Reminders</span>
            <span className="font-mono text-text tabular-nums">
              {remindersUsed} / {remindersLimit}
            </span>
          </div>
          <div className={cn("h-1 overflow-hidden rounded-full bg-surface-2", !isPro && "mb-3")}>
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${reminderUsagePct}%` }}
            />
          </div>
          {!isPro ? (
            <Link
              href="/settings"
              className="mt-3 block w-full rounded-button bg-text py-1.5 text-center text-xs font-medium text-canvas transition-colors hover:bg-text-2"
            >
              Upgrade to Pro
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
