"use server";

import { revalidatePath } from "next/cache";

import { requireCurrentUser } from "@/features/auth/server/session";
import {
  createEmptyReminderFormValues,
  toReminderFormValues,
  toUtcDateFromLocalInput,
} from "@/features/reminders/reminder-form";
import { updateReminderSchema } from "@/features/reminders/schemas/reminder-form-schema";
import type { UpdateReminderActionState } from "@/features/reminders/types";
import { prisma } from "@/shared/lib/prisma";
import {
  getFormString,
  getValidationErrorMessage,
} from "@/shared/lib/server-action-validation";

export async function updateReminder(
  reminderId: string,
  _prevState: UpdateReminderActionState,
  formData: FormData,
): Promise<UpdateReminderActionState> {
  const rawValues = {
    reminderId,
    title: getFormString(formData, "title"),
    remindAt: getFormString(formData, "remindAt"),
    timezoneOffsetMinutes: getFormString(formData, "timezoneOffsetMinutes"),
    applicationId: getFormString(formData, "applicationId"),
    notes: getFormString(formData, "notes"),
  };

  const fallbackValues = toReminderFormValues(rawValues);
  const result = updateReminderSchema.safeParse(rawValues);

  if (!result.success) {
    return {
      status: "error",
      error: getValidationErrorMessage(
        result.error,
        "Reminder could not be updated.",
      ),
      values: fallbackValues,
    };
  }

  try {
    const user = await requireCurrentUser();
    const input = result.data;
    const dueAt = toUtcDateFromLocalInput(
      input.remindAt,
      input.timezoneOffsetMinutes,
    );

    if (!dueAt) {
      return {
        status: "error",
        error: "Choose a valid reminder date and time.",
        values: fallbackValues,
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
          values: fallbackValues,
        };
      }
    }

    const updated = await prisma.reminder.updateMany({
      where: {
        id: input.reminderId,
        userId: user.id,
        completedAt: null,
      },
      data: {
        title: input.title,
        dueAt,
        applicationId: input.applicationId,
        notes: input.notes ?? null,
      },
    });

    if (updated.count === 0) {
      return {
        status: "error",
        error: "That reminder could not be found.",
        values: fallbackValues,
      };
    }

    revalidatePath("/reminders");
    revalidatePath("/dashboard");

    return {
      status: "success",
      values: createEmptyReminderFormValues(),
    };
  } catch {
    return {
      status: "error",
      error: "The reminder could not be updated. Try again.",
      values: fallbackValues,
    };
  }
}
