"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { trackServerEvent } from "@/features/analytics/server/track-event";
import { requireCurrentUser } from "@/features/auth/server/session";
import {
  getPlanGate,
  getPlanLimitReachedMessage,
} from "@/features/billing/server/plan-enforcement";
import {
  isValidDateTimeLocalValue,
  toUtcDateFromLocalInput,
} from "@/features/reminders/reminder-form";
import type { CreateReminderActionState } from "@/features/reminders/types";
import { prisma } from "@/lib/prisma";

const createReminderSchema = z.object({
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
});

export async function createReminder(
  _prevState: CreateReminderActionState,
  formData: FormData,
): Promise<CreateReminderActionState> {
  const rawValues = {
    title: typeof formData.get("title") === "string" ? formData.get("title") : "",
    remindAt:
      typeof formData.get("remindAt") === "string" ? formData.get("remindAt") : "",
    timezoneOffsetMinutes:
      typeof formData.get("timezoneOffsetMinutes") === "string"
        ? formData.get("timezoneOffsetMinutes")
        : "",
    applicationId:
      typeof formData.get("applicationId") === "string"
        ? formData.get("applicationId")
        : "",
  };

  const result = createReminderSchema.safeParse(rawValues);

  if (!result.success) {
    return {
      status: "error",
      error: result.error.issues[0]?.message ?? "Reminder could not be created.",
    };
  }

  const user = await requireCurrentUser();
  const gate = await getPlanGate(user.id, "reminders");

  if (!gate.allowed) {
    return {
      status: "error",
      error: getPlanLimitReachedMessage("reminders"),
    };
  }

  const input = result.data;
  const dueAt = toUtcDateFromLocalInput(
    input.remindAt,
    input.timezoneOffsetMinutes,
  );

  if (!dueAt) {
    return {
      status: "error",
      error: "Choose a valid reminder date and time.",
    };
  }

  if (input.applicationId) {
    const application = await prisma.application.findFirst({
      where: {
        id: input.applicationId,
        userId: user.id,
      },
      select: {
        id: true,
      },
    });

    if (!application) {
      return {
        status: "error",
        error: "The selected application could not be found.",
      };
    }
  }

  const reminder = await prisma.reminder.create({
    data: {
      userId: user.id,
      title: input.title,
      dueAt,
      applicationId: input.applicationId,
    },
  });

  await trackServerEvent({
    distinctId: user.id,
    event: "reminder_created",
    properties: {
      hasLinkedApplication: Boolean(reminder.applicationId),
      reminderId: reminder.id,
    },
  });

  revalidatePath("/reminders");
  revalidatePath("/dashboard");

  return {
    status: "success",
  };
}
