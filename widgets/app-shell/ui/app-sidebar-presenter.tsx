"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ClipboardList,
  Columns3,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { FREE_PLAN_LIMITS, PLAN_LABELS } from "@/features/billing/config";
import {
  applicationStatusLabels,
  pipelineStageValues,
} from "@/entities/application/model/config";

type PlanValue = keyof typeof PLAN_LABELS;

const mainNavItems: ReadonlyArray<{
  href: string;
  label: string;
  hotkey: string;
  icon: LucideIcon;
}> = [
  { href: "/dashboard", label: "Dashboard", hotkey: "G D", icon: LayoutDashboard },
  { href: "/pipeline", label: "Pipeline", hotkey: "G P", icon: Columns3 },
  { href: "/applications", label: "Applications", hotkey: "G A", icon: ClipboardList },
  { href: "/reminders", label: "Reminders", hotkey: "G N", icon: Bell },
  { href: "/resumes", label: "Resumes", hotkey: "G R", icon: FileText },
];

// Pipeline-stage dot colors (doctrine — matches shared/design/chip tones).
const stageDotColor: Record<(typeof pipelineStageValues)[number], string> = {
  WISHLIST: "var(--text-4)",
  APPLIED: "var(--primary)",
  SCREEN: "var(--info)",
  INTERVIEW: "var(--accent)",
  OFFER: "var(--success)",
};

type AppSidebarPresenterProps = {
  currentPath?: string;
  plan?: PlanValue;
  applicationsUsed?: number;
  remindersUsed?: number;
  resumesUsed?: number;
  statusCounts?: Record<string, number>;
};

function isItemActive(currentPath: string, href: string): boolean {
  if (href === "/dashboard") return currentPath === href;
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

function UsageRow({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number | null;
}) {
  const atCeiling = limit !== null && used >= limit;
  const pct = limit === null ? 0 : Math.min(100, Math.round((used / limit) * 100));
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-text-2">
        <span>{label}</span>
        <span className="font-mono tabular-nums text-text">
          {limit === null ? used : `${used} / ${limit}`}
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-surface-2">
        <div
          className={cn(
            "h-full rounded-full",
            atCeiling ? "bg-warning" : "bg-primary",
          )}
          style={{ width: limit === null ? "100%" : `${pct}%`, opacity: limit === null ? 0.25 : 1 }}
        />
      </div>
    </div>
  );
}

export function AppSidebarPresenter({
  currentPath,
  plan = "FREE",
  applicationsUsed = 0,
  remindersUsed = 0,
  resumesUsed = 0,
  statusCounts = {},
}: AppSidebarPresenterProps) {
  const pathname = usePathname();
  const activePath = pathname ?? currentPath ?? "/dashboard";
  const isFree = plan === "FREE";

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
        <span className="shrink-0 rounded-chip bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-text-3">
          {PLAN_LABELS[plan]}
        </span>
      </div>

      {/* Main nav */}
      <nav className="flex-1 space-y-0.5 px-2 py-3">
        {mainNavItems.map((item) => {
          const isActive = isItemActive(activePath, item.href);
          const Icon = item.icon;
          const count =
            item.href === "/applications"
              ? applicationsUsed
              : item.href === "/reminders"
                ? remindersUsed
                : item.href === "/resumes"
                  ? resumesUsed
                  : null;
          const isReminders = item.href === "/reminders";

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-8 items-center gap-2.5 rounded-sm px-2 text-sm transition-colors duration-[120ms]",
                isActive
                  ? "bg-surface-2 font-medium text-text"
                  : "text-text-2 hover:bg-surface-2 hover:text-text",
              )}
            >
              <Icon
                className={cn("size-4 shrink-0", isActive ? "text-primary" : "text-text-3")}
                aria-hidden
              />
              <span className="flex-1 truncate">{item.label}</span>
              {count !== null ? (
                <span
                  className={cn(
                    "font-mono text-[10.5px] tabular-nums",
                    isReminders && remindersUsed > 0 ? "text-accent" : "text-text-3",
                  )}
                >
                  {count}
                </span>
              ) : (
                <span className="font-mono text-[10.5px] text-text-4">{item.hotkey}</span>
              )}
            </Link>
          );
        })}

        {/* Pipeline section */}
        <div className="mt-5">
          <p className="px-2 pb-1.5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-text-4">
            Pipeline
          </p>
          {pipelineStageValues.map((status) => (
            <div
              key={status}
              className="flex h-7 items-center justify-between rounded-sm px-2 text-sm text-text-2"
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: stageDotColor[status] }}
                />
                {applicationStatusLabels[status]}
              </span>
              <span className="font-mono text-[10.5px] tabular-nums text-text-3">
                {statusCounts[status] ?? 0}
              </span>
            </div>
          ))}
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
              "flex h-8 items-center gap-2.5 rounded-sm px-2 text-sm transition-colors duration-[120ms]",
              isItemActive(activePath, "/settings")
                ? "bg-surface-2 font-medium text-text"
                : "text-text-2 hover:bg-surface-2 hover:text-text",
            )}
          >
            <Settings
              className={cn(
                "size-4 shrink-0",
                isItemActive(activePath, "/settings") ? "text-primary" : "text-text-3",
              )}
              aria-hidden
            />
            <span className="flex-1">Settings</span>
            <span className="font-mono text-[10.5px] text-text-4">G S</span>
          </Link>
          <Link
            href="/settings"
            className="flex h-8 items-center gap-2.5 rounded-sm px-2 text-sm text-text-2 transition-colors duration-[120ms] hover:bg-surface-2 hover:text-text"
          >
            <HelpCircle className="size-4 shrink-0 text-text-3" aria-hidden />
            <span className="flex-1">Help</span>
            <span className="font-mono text-[10.5px] text-text-4">⌘?</span>
          </Link>
        </div>
      </nav>

      {/* Usage footer — visible every day, no upgrade CTA */}
      <div className="border-t border-border p-3">
        <div className="space-y-2.5 rounded-card border border-border bg-surface p-3">
          <UsageRow
            label="Applications"
            used={applicationsUsed}
            limit={isFree ? FREE_PLAN_LIMITS.applications : null}
          />
          <UsageRow
            label="Reminders"
            used={remindersUsed}
            limit={isFree ? FREE_PLAN_LIMITS.reminders : null}
          />
        </div>
      </div>
    </div>
  );
}
