import { Button } from "@/components/ui/button";
import { completeReminder } from "@/features/reminders/server/complete-reminder";
import { RemindersListPresenter } from "@/features/reminders/components/reminders-list-presenter";
import type { ReminderListItem } from "@/features/reminders/types";

type RemindersListProps = {
  reminders: ReminderListItem[];
};

export function RemindersList({ reminders }: RemindersListProps) {
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
          </>
        );
      }}
    />
  );
}
