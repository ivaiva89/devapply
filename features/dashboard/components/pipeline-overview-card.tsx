import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/design/empty-state";
import { ApplicationStatusBadge } from "@/features/applications/components/application-status-badge";
import type { ApplicationStatusValue } from "@/features/applications/config";

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
      <CardHeader className="pb-3">
        <p className="text-xs font-medium text-foreground">
          Pipeline distribution
        </p>
        <p className="text-xs text-muted-foreground">
          Applications by current status.
        </p>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        {!isEmpty ? (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.status} className="space-y-1">
                <div className="flex items-center justify-between">
                  <ApplicationStatusBadge status={item.status} />
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="tabular-nums">{item.count}</span>
                    <span className="w-7 text-right tabular-nums">
                      {formatPercentage(item.percentage)}
                    </span>
                  </div>
                </div>
                <div className="h-1 overflow-hidden rounded-none bg-muted">
                  <div
                    className="h-full bg-primary/60 transition-all"
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
