import { EmptyState } from "@/components/design/empty-state";

type UpcomingRemindersSectionProps = {
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

export function UpcomingRemindersSection({
  items,
}: UpcomingRemindersSectionProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-1 text-sm font-medium text-foreground">Upcoming reminders</h2>
      <p className="mb-5 text-xs text-muted-foreground">Scheduled follow-ups.</p>

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
    </section>
  );
}
