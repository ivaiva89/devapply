import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type TodayItem = {
  id: string;
  label: string;
  tone?: "accent" | "warning" | "danger";
};

type DashboardShellProps = {
  children: ReactNode;
  userName?: string;
  todayItems?: TodayItem[];
};

function formatTodayDate() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

export function DashboardShell({ children, userName, todayItems = [] }: DashboardShellProps) {
  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <p className="text-lg font-medium text-text">
          {userName ? `Good morning, ${userName}` : "Good morning"}
        </p>
        <p className="font-mono text-xs text-text-3">{formatTodayDate()}</p>
      </div>

      {/* Today strip */}
      {todayItems.length > 0 ? (
        <div className="flex items-center gap-3 rounded-card border-l-[3px] border-primary bg-surface p-4">
          <span className="shrink-0 text-xs font-medium text-text-3">Today</span>
          <div className="flex flex-wrap gap-2">
            {todayItems.slice(0, 3).map((item) => (
              <span
                key={item.id}
                className={cn(
                  "inline-flex items-center rounded-chip px-2.5 py-1 font-mono text-[11.5px] font-medium",
                  item.tone === "danger"  && "bg-danger-soft text-danger",
                  item.tone === "warning" && "bg-warning-soft text-warning",
                  (!item.tone || item.tone === "accent") && "bg-accent-soft text-accent",
                )}
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {children}
    </div>
  );
}
