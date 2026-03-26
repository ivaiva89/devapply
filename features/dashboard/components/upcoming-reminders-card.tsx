import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export function UpcomingRemindersCard({ items }: UpcomingRemindersCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming reminders</CardTitle>
        <CardDescription className="text-xs">Scheduled follow-ups.</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <div className="divide-y divide-border">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.company ?? "General reminder"}
                  </p>
                </div>
                <span className="ml-4 shrink-0 text-[10px] tabular-nums text-muted-foreground">
                  {formatDate(item.dueAt)}
                </span>
              </div>
            ))}
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
