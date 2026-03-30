import type {
  ReminderFormValues,
  UpdateReminderActionState,
} from "@/features/reminders/types";

export function createEmptyReminderFormValues(): ReminderFormValues {
  return {
    title: "",
    remindAt: "",
    applicationId: "",
  };
}

export function toReminderFormValues(input: {
  applicationId?: string | null;
  remindAt?: string;
  title?: string;
}): ReminderFormValues {
  return {
    title: input.title ?? "",
    remindAt: input.remindAt ?? "",
    applicationId: input.applicationId ?? "",
  };
}

export function getUpdateReminderInitialState(
  values: ReminderFormValues,
): UpdateReminderActionState {
  return {
    status: "idle",
    values,
  };
}

export function toDateTimeLocalInputValue(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offsetMilliseconds = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - offsetMilliseconds)
    .toISOString()
    .slice(0, 16);
}
