import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ReminderListItem } from "@/features/reminders/types";

type RemindersListPresenterProps = {
  reminders: ReminderListItem[];
  renderActions?: (reminder: ReminderListItem) => ReactNode;
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

export function RemindersListPresenter({
  reminders,
  renderActions,
}: RemindersListPresenterProps) {
  return (
    <div className="space-y-4">
      {reminders.map((reminder) => {
        const overdue = isOverdue(reminder.remindAt);

        return (
          <Card
            key={reminder.id}
            className="rounded-3xl border border-border/70 bg-card shadow-sm"
          >
            <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-lg font-semibold tracking-tight text-foreground">
                    {reminder.title}
                  </p>
                  <Badge variant={overdue ? "destructive" : "outline"}>
                    {overdue ? "Overdue" : "Upcoming"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Remind at {formatDate(reminder.remindAt)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {reminder.application
                    ? `${reminder.application.company} - ${reminder.application.role}`
                    : "General reminder"}
                </p>
                {reminder.notes ? (
                  <p className="text-sm text-muted-foreground">
                    {reminder.notes}
                  </p>
                ) : null}
              </div>

              {renderActions ? (
                <div className="flex flex-wrap gap-2">
                  {renderActions(reminder)}
                </div>
              ) : null}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
