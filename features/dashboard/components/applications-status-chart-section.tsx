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

function formatPercentage(value: number) {
  return `${Math.round(value)}%`;
}

export function ApplicationsStatusChartSection({
  items,
  isEmpty,
}: ApplicationsStatusChartSectionProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-1 text-sm font-medium text-foreground">Pipeline distribution</h2>
      <p className="mb-6 text-xs text-muted-foreground">
        Applications broken down by current status.
      </p>

      {!isEmpty ? (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.status} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <ApplicationStatusBadge status={item.status} />
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="tabular-nums">{item.count}</span>
                  <span className="w-8 text-right tabular-nums">{formatPercentage(item.percentage)}</span>
                </div>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: item.percentage === 0 ? "0%" : `${Math.max(item.percentage, 4)}%`,
                    opacity: item.percentage === 0 ? 0 : 1,
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
    </section>
  );
}
