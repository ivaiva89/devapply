import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";

type TodayItem = {
  id: string;
  text: string;
  chipLabel: string;
  chipTone: "accent" | "warning" | "primary";
  timeLabel: string;
};

type DashboardShellProps = {
  children: ReactNode;
  userName?: string;
  todayItems?: TodayItem[];
};

function getGreeting(name?: string) {
  const hour = new Date().getHours();
  const salutation =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return name ? `${salutation}, ${name}` : salutation;
}

function formatTodaySubtitle(itemCount: number) {
  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
  if (itemCount === 0) return date;
  return `${date} · ${itemCount} ${itemCount === 1 ? "item needs" : "items need"} you today`;
}

export function DashboardShell({
  children,
  userName,
  todayItems = [],
}: DashboardShellProps) {
  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-[11px] text-text-3">
        <span>Workspace</span>
        <span className="text-text-4">/</span>
        <span className="text-text">Dashboard</span>
        <span className="ml-auto inline-flex items-center rounded-xs border border-border bg-surface-2 px-1.5 py-0.5 text-[10.5px] text-text-4">
          ⌘K to search
        </span>
      </div>

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text">
            {getGreeting(userName)}
          </h1>
          <p className="mt-1 text-sm text-text-3">
            {formatTodaySubtitle(todayItems.length)}
          </p>
        </div>
        <Link
          href="/applications"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-button bg-text px-3 py-1.5 text-sm font-medium text-canvas transition-colors hover:bg-text-2"
        >
          + New application
        </Link>
      </div>

      {/* Today strip */}
      {todayItems.length > 0 ? (
        <div className="relative overflow-hidden rounded-card border border-border bg-surface p-5 before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-primary">
          <div className="flex flex-wrap items-center gap-4 lg:flex-nowrap lg:gap-5">
            <div className="shrink-0 pl-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-3">
                Today · {todayItems.length}{" "}
                {todayItems.length === 1 ? "item" : "items"}
              </p>
              <p className="mt-1 text-base font-semibold text-text">
                What needs you
              </p>
            </div>
            <div className="flex flex-1 flex-wrap gap-2">
              {todayItems.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 rounded-md border border-border bg-surface-1 px-3 py-1.5 text-sm whitespace-nowrap"
                >
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-chip px-2 py-0.5 font-mono text-[11px] font-medium",
                      item.chipTone === "accent" && "bg-accent-soft text-accent",
                      item.chipTone === "warning" && "bg-warning-soft text-warning",
                      item.chipTone === "primary" && "bg-primary-soft text-primary",
                    )}
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                    {item.chipLabel}
                  </span>
                  <span className="text-text">{item.text}</span>
                  <span className="font-mono text-[11px] text-text-3">
                    {item.timeLabel}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/reminders"
              className="shrink-0 rounded-button border border-border-strong bg-surface px-3 py-1.5 text-sm font-medium text-text transition-colors hover:bg-surface-1"
            >
              Open all →
            </Link>
          </div>
        </div>
      ) : null}

      {children}
    </div>
  );
}
