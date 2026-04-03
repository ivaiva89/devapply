"use server";

import { revalidatePath } from "next/cache";

import { trackServerEvent } from "@/features/analytics/server/track-event";
import { requireCurrentUser } from "@/features/auth/server/session";
import {
  getPlanGate,
  getPlanLimitReachedMessage,
} from "@/features/billing/server/plan-enforcement";
import { reminderFormSchema } from "@/features/reminders/schemas/reminder-form-schema";
import {
  toUtcDateFromLocalInput,
} from "@/features/reminders/reminder-form";
import type { CreateReminderActionState } from "@/features/reminders/types";
import { prisma } from "@/shared/lib/prisma";
import {
  getFormString,
  getValidationErrorMessage,
} from "@/shared/lib/server-action-validation";

export async function createReminder(
  _prevState: CreateReminderActionState,
  formData: FormData,
): Promise<CreateReminderActionState> {
  const rawValues = {
    title: getFormString(formData, "title"),
    remindAt: getFormString(formData, "remindAt"),
    timezoneOffsetMinutes: getFormString(formData, "timezoneOffsetMinutes"),
    applicationId: getFormString(formData, "applicationId"),
    notes: getFormString(formData, "notes"),
  };

  const result = reminderFormSchema.safeParse(rawValues);

  if (!result.success) {
    return {
      status: "error",
      error: getValidationErrorMessage(
        result.error,
        "Reminder could not be created.",
      ),
    };
  }

  const user = await requireCurrentUser();
  const gate = await getPlanGate(user, "reminders");

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
      notes: input.notes,
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
