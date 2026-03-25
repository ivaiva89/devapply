import { SectionHeader } from "@/components/design/section-header";
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
    <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
      <SectionHeader
        eyebrow="Applications over time"
        title="Application trend"
        description="Track how many applications were added across recent months so momentum changes are visible at a glance."
      />
      <div className="mt-6">
        {!isEmpty ? (
          <div className="grid grid-cols-6 gap-3">
            {items.map((item) => {
              const height =
                maxCount === 0 ? 0 : Math.max((item.count / maxCount) * 100, 10);

              return (
                <div
                  key={item.label}
                  className="flex min-w-0 flex-col items-center gap-3 rounded-2xl border border-border/60 bg-background/60 p-3"
                >
                  <div className="flex h-40 w-full items-end justify-center rounded-2xl bg-muted/60 px-2 py-3">
                    <div
                      className="w-full max-w-12 rounded-t-xl bg-foreground/85 transition-all"
                      style={{ height: item.count === 0 ? "0%" : `${height}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-foreground">
                      {item.count}
                    </p>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {item.label}
                    </p>
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
      </div>
    </section>
  );
}
