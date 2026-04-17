import { EmptyState } from "@/shared/design/empty-state";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";

type ApplicationsOverTimeChartSectionProps = {
  items: Array<{
    label: string;
    count: number;
  }>;
  isEmpty: boolean;
};

export function ApplicationsOverTimeChartSection({
  items,
  isEmpty,
}: ApplicationsOverTimeChartSectionProps) {
  const maxCount = Math.max(...items.map((item) => item.count), 0);

  return (
    <Card>
      <CardHeader className="pb-4 sm:pb-6">
        <p className="font-display text-lg font-semibold tracking-tight text-text">
          Applications Over Time
        </p>
        <p className="text-sm text-text-3">
          Monthly volume — last 6 months.
        </p>
      </CardHeader>
      <CardContent className="px-4 pt-2 sm:px-6 sm:pt-4">
        {!isEmpty ? (
          <div className="flex h-32 items-end gap-1.5 sm:h-28 sm:gap-2">
            {items.map((item) => {
              const heightPct =
                maxCount === 0
                  ? 0
                  : Math.max(
                      (item.count / maxCount) * 100,
                      item.count > 0 ? 6 : 0,
                    );

              return (
                <div
                  key={item.label}
                  className="group flex min-w-0 flex-1 flex-col items-center gap-1.5"
                  style={{ height: "100%" }}
                >
                  <div className="relative flex w-full flex-1 items-end">
                    <div className="absolute inset-0 rounded-sm bg-muted/30" />
                    <div
                      className="relative w-full rounded-t-sm bg-gradient-to-t from-primary/80 to-primary-container transition-all group-hover:from-primary group-hover:to-primary"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <div className="flex min-w-0 flex-col items-center gap-px">
                    <span className="text-xs tabular-nums text-text">
                      {item.count}
                    </span>
                    <span className="max-w-full truncate text-[10px] text-text-3 sm:text-[11px]">
                      {item.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            compact
            title="No timeline data yet"
            description="Once applications are created, the dashboard will show monthly volume here."
          />
        )}
      </CardContent>
    </Card>
  );
}
