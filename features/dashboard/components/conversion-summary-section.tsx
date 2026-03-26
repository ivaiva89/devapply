import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/design/empty-state";
import { StatsCard } from "@/components/design/stats-card";

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
      <CardHeader>
        <CardTitle>Funnel snapshot</CardTitle>
        <CardDescription className="text-xs">
          Response, interview, and offer conversion rates.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isEmpty ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
