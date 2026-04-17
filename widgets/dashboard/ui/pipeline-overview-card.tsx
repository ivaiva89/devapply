import { ApplicationStatusBadge } from "@/entities/application/ui/application-status-badge";
import type { ApplicationStatusValue } from "@/entities/application/model/config";
import { EmptyState } from "@/shared/design/empty-state";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";

type PipelineOverviewCardProps = {
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

export function PipelineOverviewCard({
  items,
  isEmpty,
}: PipelineOverviewCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4 sm:pb-6">
        <p className="font-display text-lg font-semibold tracking-tight text-text">
          Pipeline Distribution
        </p>
        <p className="text-sm text-text-3">
          Applications by current status.
        </p>
      </CardHeader>
      <CardContent className="pt-2 sm:pt-4">
        {!isEmpty ? (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.status} className="space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <ApplicationStatusBadge status={item.status} />
                  <div className="flex items-center gap-2 font-label text-xs text-text-3 sm:gap-3">
                    <span className="tabular-nums">{item.count}</span>
                    <span className="w-8 text-right tabular-nums">
                      {formatPercentage(item.percentage)}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-1">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary-container transition-all"
                    style={{
                      width:
                        item.percentage === 0
                          ? "0%"
                          : `${Math.max(item.percentage, 3)}%`,
                      opacity: item.percentage === 0 ? 0 : 1,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            compact
            title="No pipeline data yet"
            description="Once applications are added, the dashboard will break down the pipeline by status here."
          />
        )}
      </CardContent>
    </Card>
  );
}
