import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/design/empty-state";

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
      <CardHeader>
        <CardTitle>Applications over time</CardTitle>
        <CardDescription className="text-xs">
          Monthly application volume across the last 6 months.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isEmpty ? (
          <div className="flex h-32 items-end gap-3">
            {items.map((item) => {
              const heightPct =
                maxCount === 0
                  ? 0
                  : Math.max((item.count / maxCount) * 100, item.count > 0 ? 8 : 0);

              return (
                <div
                  key={item.label}
                  className="group flex flex-1 flex-col items-center gap-2"
                  style={{ height: "100%" }}
                >
                  <div className="relative flex w-full flex-1 items-end">
                    <div className="absolute inset-0 rounded-sm bg-muted/50" />
                    <div
                      className="relative w-full rounded-sm bg-primary transition-colors group-hover:bg-primary/80"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-xs font-medium tabular-nums text-foreground">
                      {item.count}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{item.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            compact
            title="No timeline data yet"
            description="Once applications are created, the dashboard will show how many were added across recent months."
          />
        )}
      </CardContent>
    </Card>
  );
}
