import { DashboardSectionEmpty } from "@/features/dashboard/components/dashboard-section-empty";

type ConversionSummarySectionProps = {
  items: Array<{
    label: string;
    value: string;
    helper: string;
  }>;
  isEmpty: boolean;
};

export function ConversionSummarySection({
  items,
  isEmpty,
}: ConversionSummarySectionProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-1 text-sm font-medium text-foreground">Funnel snapshot</h2>
      <p className="mb-5 text-xs text-muted-foreground">
        Response, interview, and offer conversion rates.
      </p>

      {!isEmpty ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-2 rounded-md border border-border bg-background p-4"
            >
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-semibold tabular-nums tracking-tight text-foreground">
                {item.value}
              </p>
              <p className="text-xs text-muted-foreground">{item.helper}</p>
            </div>
          ))}
        </div>
      ) : (
        <DashboardSectionEmpty
          title="No conversion data yet"
          description="Once applications move through the pipeline, the dashboard will summarize response, interview, and offer rates here."
        />
      )}
    </section>
  );
}
