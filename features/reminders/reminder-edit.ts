import type { ReminderFormValues } from "@/features/reminders/types";
import {
  getUpdateReminderInitialState,
  toDateTimeLocalInputValue,
  toReminderFormValues,
} from "@/features/reminders/reminder-form";

export function createEditReminderValues(input: {
  applicationId?: string | null;
  remindAt: string;
  title: string;
}): ReminderFormValues {
  return toReminderFormValues({
    applicationId: input.applicationId,
    remindAt: toDateTimeLocalInputValue(input.remindAt),
    title: input.title,
  });
}

export { getUpdateReminderInitialState };
