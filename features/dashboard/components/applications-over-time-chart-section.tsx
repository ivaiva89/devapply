import { DashboardSectionEmpty } from "@/features/dashboard/components/dashboard-section-empty";

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
    <section className="rounded-lg border border-border bg-card p-6">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground">Applications over time</h2>
      </div>
      <p className="mb-6 text-xs text-muted-foreground">
        Monthly application volume across the last 6 months.
      </p>

      {!isEmpty ? (
        <div className="flex items-end gap-3" style={{ height: "120px" }}>
          {items.map((item) => {
            const heightPct =
              maxCount === 0 ? 0 : Math.max((item.count / maxCount) * 100, item.count > 0 ? 8 : 0);

            return (
              <div
                key={item.label}
                className="group flex flex-1 flex-col items-center gap-2"
                style={{ height: "100%" }}
              >
                <div className="relative flex w-full flex-1 items-end">
                  {/* Track */}
                  <div className="absolute inset-0 rounded-sm bg-muted/50" />
                  {/* Bar */}
                  <div
                    className="relative w-full rounded-sm bg-primary transition-all duration-300 group-hover:bg-primary/80"
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
        <DashboardSectionEmpty
          title="No timeline data yet"
          description="Once applications are created, the dashboard will show how many were added across recent months."
        />
      )}
    </section>
  );
}
