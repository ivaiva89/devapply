import { DashboardSectionEmpty } from "@/features/dashboard/components/dashboard-section-empty";

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
    <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
        Upcoming reminders
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">
        Follow-ups in view
      </h2>
      <div className="mt-6">
        {items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-stone-200 bg-stone-50 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-stone-950">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-stone-600">
                      {item.company ? item.company : "General reminder"}
                    </p>
                  </div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
                    {formatDate(item.dueAt)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <DashboardSectionEmpty
            title="No reminders scheduled"
            description="Upcoming reminders will appear here once follow-ups are created."
          />
        )}
      </div>
    </section>
  );
}
