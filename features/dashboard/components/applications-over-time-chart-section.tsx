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
    <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-card to-card/80 p-6 shadow-lg">
      <SectionHeader
        eyebrow="Applications over time"
        title="Application trend"
        description="Track how many applications were added across recent months so momentum changes are visible at a glance."
      />
      <div className="mt-8">
        {!isEmpty ? (
          <div className="grid grid-cols-6 gap-4">
            {items.map((item) => {
              const height =
                maxCount === 0 ? 0 : Math.max((item.count / maxCount) * 100, 10);

              return (
                <div
                  key={item.label}
                  className="group flex min-w-0 flex-col items-center gap-3 rounded-xl border border-primary/15 bg-secondary/40 p-3 transition-all duration-300 hover:border-primary/40 hover:bg-secondary/60 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex h-40 w-full items-end justify-center rounded-lg bg-muted/40 px-2 py-3">
                    <div
                      className="w-full max-w-10 rounded-t-lg bg-gradient-to-t from-primary to-accent transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/50"
                      style={{ height: item.count === 0 ? "0%" : `${height}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="bg-gradient-to-r from-primary to-accent bg-clip-text text-xl font-bold text-transparent">
                      {item.count}
                    </p>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
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
