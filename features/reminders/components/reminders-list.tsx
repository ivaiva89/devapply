import { completeReminder } from "@/features/reminders/server/complete-reminder";
import type { ReminderListItem } from "@/features/reminders/types";

type RemindersListProps = {
  reminders: ReminderListItem[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function isOverdue(value: string) {
  return new Date(value).getTime() < Date.now();
}

export function RemindersList({ reminders }: RemindersListProps) {
  return (
    <div className="space-y-4">
      {reminders.map((reminder) => {
        const overdue = isOverdue(reminder.remindAt);
        const action = completeReminder.bind(null, reminder.id);

        return (
          <section
            key={reminder.id}
            className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-lg font-semibold tracking-tight text-stone-950">
                    {reminder.title}
                  </p>
                  {overdue ? (
                    <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                      Overdue
                    </span>
                  ) : (
                    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-600">
                      Upcoming
                    </span>
                  )}
                </div>
                <p className="text-sm text-stone-600">
                  Remind at {formatDate(reminder.remindAt)}
                </p>
                <p className="text-sm text-stone-600">
                  {reminder.application
                    ? `${reminder.application.company} - ${reminder.application.role}`
                    : "General reminder"}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <form action={action}>
                  <input type="hidden" name="actionType" value="done" />
                  <button
                    type="submit"
                    className="rounded-full border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
                  >
                    Mark done
                  </button>
                </form>
                <form action={action}>
                  <input type="hidden" name="actionType" value="sent" />
                  <button
                    type="submit"
                    className="rounded-full bg-stone-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
                  >
                    Mark sent
                  </button>
                </form>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
