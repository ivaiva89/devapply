import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/design/empty-state";

type UpcomingRemindersCardProps = {
  items: Array<{
    id: string;
    title: string;
    dueAt: string;
    company: string | null;
  }>;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function isOverdue(value: string) {
  return new Date(value).getTime() < Date.now();
}

export function UpcomingRemindersCard({ items }: UpcomingRemindersCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <p className="font-display text-lg font-semibold tracking-tight text-foreground">
          Upcoming Reminders
        </p>
        <p className="text-sm text-muted-foreground">Scheduled follow-ups.</p>
      </CardHeader>
      <CardContent className="pt-0">
        {items.length > 0 ? (
          <div className="flex flex-col gap-1">
            {items.map((item) => {
              const overdue = isOverdue(item.dueAt);

              return (
                <div
                  key={item.id}
                  className="group -mx-2 flex items-center justify-between rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/40"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.company ?? "General reminder"}
                    </p>
                  </div>
                  <Badge
                    variant={overdue ? "destructive" : "outline"}
                    className="ml-4 shrink-0 font-label tabular-nums"
                  >
                    {overdue ? "Overdue" : formatDate(item.dueAt)}
                  </Badge>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            compact
            title="No reminders scheduled"
            description="Upcoming reminders will appear here once follow-ups are created."
          />
        )}
      </CardContent>
    </Card>
  );
}
