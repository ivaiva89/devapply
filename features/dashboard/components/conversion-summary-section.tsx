import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/design/empty-state";

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
      <CardHeader className="pb-3">
        <p className="text-xs font-medium text-foreground">Funnel snapshot</p>
        <p className="text-xs text-muted-foreground">
          Response, interview, and offer conversion rates.
        </p>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        {!isEmpty ? (
          <div className="grid divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-1 px-4 py-3 first:pl-0 last:pr-0"
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
