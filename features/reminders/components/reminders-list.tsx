import { Button } from "@/components/ui/button";
import { ReminderDeleteDialog } from "@/features/reminders/components/reminder-delete-dialog";
import { ReminderEditDialog } from "@/features/reminders/components/reminder-edit-dialog";
import { completeReminder } from "@/features/reminders/server/complete-reminder";
import { RemindersListPresenter } from "@/features/reminders/components/reminders-list-presenter";
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
      renderActions={(reminder) => {
        const action = completeReminder.bind(null, reminder.id);

        return (
          <>
            <form action={action}>
              <input type="hidden" name="actionType" value="done" />
              <Button type="submit" variant="outline" size="sm">
                Mark done
              </Button>
            </form>
            <form action={action}>
              <input type="hidden" name="actionType" value="sent" />
              <Button type="submit" size="sm">
                Mark sent
              </Button>
            </form>
            <ReminderEditDialog
              applicationOptions={applicationOptions}
              reminder={{
                applicationId: reminder.application?.id,
                id: reminder.id,
                remindAt: reminder.remindAt,
                title: reminder.title,
              }}
            />
            <ReminderDeleteDialog reminderId={reminder.id} title={reminder.title} />
          </>
        );
      }}
    />
  );
}
