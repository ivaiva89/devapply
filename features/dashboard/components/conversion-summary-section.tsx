import { SectionHeader } from "@/components/design/section-header";
import { StatsCard } from "@/components/design/stats-card";
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
    <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
      <SectionHeader
        eyebrow="Conversion summary"
        title="Funnel snapshot"
      />
      <div className="mt-6">
        {!isEmpty ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <StatsCard
                key={item.label}
                label={item.label}
                value={item.value}
                helper={item.helper}
              />
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
