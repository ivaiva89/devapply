import { EmptyState } from "@/components/design/empty-state";
import { SectionHeader } from "@/components/design/section-header";
import { Card, CardContent } from "@/components/ui/card";

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
    year: "numeric",
  }).format(new Date(value));
}

export function UpcomingRemindersSection({
  items,
}: UpcomingRemindersSectionProps) {
  return (
    <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-card to-card/80 p-6 shadow-lg">
      <SectionHeader eyebrow="Upcoming reminders" title="Follow-ups in view" />
      <div className="mt-6">
        {items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item) => (
              <Card
                key={item.id}
                className="group rounded-xl border border-primary/15 bg-secondary/40 shadow-none transition-all duration-300 hover:border-primary/40 hover:bg-secondary/60 hover:shadow-lg hover:shadow-primary/5"
              >
                <CardContent className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.company ? item.company : "General reminder"}
                    </p>
                  </div>
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    {formatDate(item.dueAt)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            compact
            title="No reminders scheduled"
            description="Upcoming reminders will appear here once follow-ups are created."
          />
        )}
      </div>
    </section>
  );
}
