import { EmptyState } from "@/shared/design/empty-state";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";

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
      <CardHeader className="pb-3 sm:pb-4">
        <p className="font-display text-lg font-semibold tracking-tight text-text">
          Upcoming Reminders
        </p>
        <p className="text-sm text-text-3">Scheduled follow-ups.</p>
      </CardHeader>
      <CardContent className="pt-0">
        {items.length > 0 ? (
          <div className="flex flex-col gap-1">
            {items.map((item) => {
              const overdue = isOverdue(item.dueAt);

              return (
                <div
                  key={item.id}
                  className="group -mx-2 flex flex-col gap-2 rounded-lg px-2 py-2.5 transition-colors hover:bg-surface-1/40 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text">
                      {item.title}
                    </p>
                    <p className="truncate text-xs text-text-3">
                      {item.company ?? "General reminder"}
                    </p>
                  </div>
                  <Badge
                    variant={overdue ? "destructive" : "outline"}
                    className="w-fit font-label tabular-nums sm:ml-4 sm:shrink-0"
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
