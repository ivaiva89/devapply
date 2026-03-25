import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/design/section-header";
import { ApplicationStatusBadge } from "@/features/applications/components/application-status-badge";
import type { ApplicationStatusValue } from "@/features/applications/config";
import { DashboardSectionEmpty } from "@/features/dashboard/components/dashboard-section-empty";

type ApplicationsStatusChartSectionProps = {
  items: Array<{
    status: ApplicationStatusValue;
    count: number;
    percentage: number;
  }>;
  isEmpty: boolean;
};

const barClassNames: Record<ApplicationStatusValue, string> = {
  WISHLIST: "bg-slate-500/70 dark:bg-slate-400/70",
  APPLIED: "bg-sky-500/80 dark:bg-sky-400/80",
  INTERVIEW: "bg-amber-500/80 dark:bg-amber-400/80",
  OFFER: "bg-emerald-500/80 dark:bg-emerald-400/80",
  REJECTED: "bg-rose-500/80 dark:bg-rose-400/80",
};

function formatPercentage(value: number) {
  return `${Math.round(value)}%`;
}

export function ApplicationsStatusChartSection({
  items,
  isEmpty,
}: ApplicationsStatusChartSectionProps) {
  return (
    <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
      <SectionHeader
        eyebrow="Applications by status"
        title="Pipeline distribution"
        description="See how the current application portfolio is distributed across wishlist, active pipeline, offers, and rejections."
      />
      <div className="mt-6">
        {!isEmpty ? (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.status} className="space-y-3 rounded-2xl border border-border/60 bg-background/60 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <ApplicationStatusBadge status={item.status} />
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{item.count} applications</span>
                    <span>{formatPercentage(item.percentage)}</span>
                  </div>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full transition-all", barClassNames[item.status])}
                    style={{
                      width:
                        item.percentage === 0
                          ? "0%"
                          : `${Math.max(item.percentage, 6)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DashboardSectionEmpty
            title="No application status data yet"
            description="Once applications are added, the dashboard will break down the current pipeline by status here."
          />
        )}
      </div>
    </section>
  );
}
