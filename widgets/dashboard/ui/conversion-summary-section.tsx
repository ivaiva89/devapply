import { EmptyState } from "@/shared/design/empty-state";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";

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
    <Card>
      <CardHeader className="pb-6">
        <p className="font-display text-lg font-semibold tracking-tight text-text">
          Funnel Snapshot
        </p>
        <p className="text-sm text-text-3">
          Response, interview, and offer conversion rates.
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        {!isEmpty ? (
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
            {items.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-1 rounded-xl bg-surface-1/20 px-4 py-4"
              >
                <p className="text-sm text-text-3">{item.label}</p>
                <p className="font-display text-3xl font-semibold tabular-nums tracking-tight text-text">
                  {item.value}
                </p>
                <p className="font-label text-xs text-text-3">
                  {item.helper}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            compact
            title="No conversion data yet"
            description="Once applications move through the pipeline, the dashboard will summarize response, interview, and offer rates here."
          />
        )}
      </CardContent>
    </Card>
  );
}
