import type { ReactNode } from "react";

import { Chip } from "@/shared/design/chip";
import { cn } from "@/shared/lib/utils";
import type { ReminderListItem } from "@/features/reminders/types";

type ReminderGroupKey = "overdue" | "today" | "week" | "later";

type RemindersListPresenterProps = {
  reminders: ReminderListItem[];
  renderCheckbox?: (reminder: ReminderListItem) => ReactNode;
  renderActions?: (reminder: ReminderListItem) => ReactNode;
};

const DAY_MS = 24 * 60 * 60 * 1000;

const GROUP_META: Record<
  ReminderGroupKey,
  { label: string; headingClass: string }
> = {
  overdue: { label: "Overdue", headingClass: "text-warning" },
  today: { label: "Today", headingClass: "text-primary" },
  week: { label: "This week", headingClass: "text-text" },
  later: { label: "Later", headingClass: "text-text" },
};

const GROUP_ORDER: ReminderGroupKey[] = ["overdue", "today", "week", "later"];

function startOfDayMs(date: Date): number {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy.getTime();
}

function classifyReminder(remindAt: string, todayStart: number): ReminderGroupKey {
  const due = new Date(remindAt).getTime();

  if (due < todayStart) return "overdue";
  if (due < todayStart + DAY_MS) return "today";
  if (due < todayStart + 7 * DAY_MS) return "week";
  return "later";
}

function formatWhen(
  remindAt: string,
  group: ReminderGroupKey,
  todayStart: number,
): string {
  const dueDate = new Date(remindAt);

  if (group === "overdue") {
    const days = Math.max(
      1,
      Math.round((todayStart - startOfDayMs(dueDate)) / DAY_MS),
    );
    return `${days}d overdue`;
  }

  if (group === "today") {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(dueDate);
  }

  if (group === "week") {
    return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
      dueDate,
    );
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(dueDate);
}

export function RemindersListPresenter({
  reminders,
  renderCheckbox,
  renderActions,
}: RemindersListPresenterProps) {
  const todayStart = startOfDayMs(new Date());

  const groups = GROUP_ORDER.map((key) => ({
    key,
    items: reminders.filter(
      (reminder) => classifyReminder(reminder.remindAt, todayStart) === key,
    ),
  })).filter((group) => group.items.length > 0);

  return (
    <div>
      {groups.map((group) => {
        const meta = GROUP_META[group.key];

        return (
          <section key={group.key} className="mb-6 last:mb-0">
            <div className="mb-2.5 flex items-baseline justify-between gap-2">
              <h3 className={cn("text-[13.5px] font-semibold", meta.headingClass)}>
                {meta.label}
              </h3>
              <span className="font-mono text-[11.5px] text-text-3 tabular-nums">
                {group.items.length}{" "}
                {group.items.length === 1 ? "item" : "items"}
              </span>
            </div>

            <ul className="flex flex-col gap-2">
              {group.items.map((reminder) => {
                const rowAccent =
                  group.key === "overdue"
                    ? "border-l-[3px] border-l-warning pl-[13px]"
                    : group.key === "today"
                      ? "border-l-[3px] border-l-primary pl-[13px]"
                      : "";
                const context =
                  reminder.notes ??
                  reminder.application?.role ??
                  "General reminder";

                return (
                  <li
                    key={reminder.id}
                    className={cn(
                      "group/rem flex items-center gap-3 rounded-card border border-border bg-surface px-4 py-3 transition-[border-color,transform] duration-[120ms] hover:translate-x-px hover:border-border-strong",
                      rowAccent,
                    )}
                  >
                    <div className="shrink-0">
                      {renderCheckbox ? (
                        renderCheckbox(reminder)
                      ) : (
                        <span className="block size-[18px] rounded-[4px] border-[1.5px] border-border-strong" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-medium text-text">
                        {reminder.title}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-text-3">
                        {reminder.application ? (
                          <Chip
                            tone="slate"
                            label={reminder.application.company}
                            size="sm"
                          />
                        ) : null}
                        <span className="truncate">{context}</span>
                      </div>
                    </div>

                    <span
                      className={cn(
                        "shrink-0 font-mono text-[11.5px] tabular-nums",
                        group.key === "overdue"
                          ? "text-warning"
                          : "text-text-3",
                      )}
                    >
                      {formatWhen(reminder.remindAt, group.key, todayStart)}
                    </span>

                    {renderActions ? (
                      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-[120ms] focus-within:opacity-100 group-hover/rem:opacity-100">
                        {renderActions(reminder)}
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
