import { Check } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { ReminderDeleteDialog } from "@/features/reminders/components/reminder-delete-dialog";
import { ReminderEditDialog } from "@/features/reminders/components/reminder-edit-dialog";
import { completeReminder } from "@/features/reminders/server/complete-reminder";
import { RemindersListPresenter } from "@/widgets/reminders-panel/ui/reminders-list-presenter";
import type {
  ReminderApplicationOption,
  ReminderListItem,
} from "@/features/reminders/types";

type RemindersListProps = {
  applicationOptions: ReminderApplicationOption[];
  reminders: ReminderListItem[];
};

export function RemindersList({
  applicationOptions,
  reminders,
}: RemindersListProps) {
  return (
    <RemindersListPresenter
      reminders={reminders}
      renderCheckbox={(reminder) => {
        const action = completeReminder.bind(null, reminder.id);

        return (
          <form action={action}>
            <input type="hidden" name="actionType" value="done" />
            <button
              type="submit"
              aria-label={`Mark "${reminder.title}" done`}
              className="grid size-[18px] place-items-center rounded-[4px] border-[1.5px] border-border-strong text-transparent transition-colors duration-[120ms] hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Check className="size-3" aria-hidden />
            </button>
          </form>
        );
      }}
      renderActions={(reminder) => {
        const action = completeReminder.bind(null, reminder.id);

        return (
          <>
            <form action={action}>
              <input type="hidden" name="actionType" value="sent" />
              <Button type="submit" variant="ghost" size="sm">
                Mark sent
              </Button>
            </form>
            <ReminderEditDialog
              applicationOptions={applicationOptions}
              reminder={{
                applicationId: reminder.application?.id,
                id: reminder.id,
                notes: reminder.notes,
                remindAt: reminder.remindAt,
                title: reminder.title,
              }}
            />
            <ReminderDeleteDialog
              reminderId={reminder.id}
              title={reminder.title}
            />
          </>
        );
      }}
    />
  );
}
