import { z } from "zod";

import { isValidDateTimeLocalValue } from "@/features/reminders/reminder-form";

export const reminderFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Enter a reminder title.")
    .max(160, "Reminder title must be 160 characters or fewer."),
  remindAt: z
    .string()
    .trim()
    .min(1, "Choose when to remind yourself.")
    .refine((value) => isValidDateTimeLocalValue(value), {
      message: "Choose a valid reminder date and time.",
    }),
  timezoneOffsetMinutes: z.coerce
    .number()
    .int()
    .min(-840, "Choose a valid reminder date and time.")
    .max(840, "Choose a valid reminder date and time."),
  applicationId: z
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : value)),
  notes: z
    .string()
    .trim()
    .max(1000, "Notes must be 1000 characters or fewer.")
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
});

export const updateReminderSchema = reminderFormSchema.extend({
  reminderId: z.string().trim().min(1, "That reminder could not be found."),
});
