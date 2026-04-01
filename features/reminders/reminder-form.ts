import type {
  ReminderFormValues,
  UpdateReminderActionState,
} from "@/features/reminders/types";

const DATE_TIME_LOCAL_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

export function createEmptyReminderFormValues(): ReminderFormValues {
  return {
    title: "",
    remindAt: "",
    applicationId: "",
    notes: "",
  };
}

export function toReminderFormValues(input: {
  applicationId?: string | null;
  remindAt?: string;
  title?: string;
  notes?: string | null;
}): ReminderFormValues {
  return {
    title: input.title ?? "",
    remindAt: input.remindAt ?? "",
    applicationId: input.applicationId ?? "",
    notes: input.notes ?? "",
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

function parseDateTimeLocalValue(value: string) {
  const match = DATE_TIME_LOCAL_PATTERN.exec(value);

  if (!match) {
    return null;
  }

  const [, year, month, day, hour, minute] = match;

  return {
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour: Number(hour),
    minute: Number(minute),
  };
}

function isValidDateParts(
  parts: NonNullable<ReturnType<typeof parseDateTimeLocalValue>>,
) {
  const date = new Date(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
  );

  return (
    date.getFullYear() === parts.year &&
    date.getMonth() === parts.month - 1 &&
    date.getDate() === parts.day &&
    date.getHours() === parts.hour &&
    date.getMinutes() === parts.minute
  );
}

export function isValidDateTimeLocalValue(value: string) {
  const parts = parseDateTimeLocalValue(value);

  if (!parts) {
    return false;
  }

  return isValidDateParts(parts);
}

export function getTimezoneOffsetMinutesForLocalInput(value: string) {
  const parts = parseDateTimeLocalValue(value);

  if (!parts || !isValidDateParts(parts)) {
    return null;
  }

  return new Date(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
  ).getTimezoneOffset();
}

export function toUtcDateFromLocalInput(
  value: string,
  timezoneOffsetMinutes: number,
) {
  const parts = parseDateTimeLocalValue(value);

  if (!parts || !isValidDateParts(parts)) {
    return null;
  }

  return new Date(
    Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute) +
      timezoneOffsetMinutes * 60_000,
  );
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
