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
    <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
        Conversion summary
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">
        Funnel snapshot
      </h2>
      <div className="mt-6">
        {!isEmpty ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-stone-200 bg-stone-50 p-4"
              >
                <p className="text-sm text-stone-500">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
                  {item.value}
                </p>
                <p className="mt-2 text-sm text-stone-600">{item.helper}</p>
              </article>
            ))}
          </div>
        ) : (
          <DashboardSectionEmpty
            title="No conversion data yet"
            description="Once applications move through the pipeline, the dashboard will summarize response, interview, and offer rates here."
          />
        )}
      </div>
    </section>
  );
}
