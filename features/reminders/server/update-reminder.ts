"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireCurrentUser } from "@/features/auth/server/session";
import {
  createEmptyReminderFormValues,
  toReminderFormValues,
} from "@/features/reminders/reminder-form";
import type { UpdateReminderActionState } from "@/features/reminders/types";
import { prisma } from "@/lib/prisma";

const updateReminderSchema = z.object({
  reminderId: z.string().trim().min(1, "That reminder could not be found."),
  title: z
    .string()
    .trim()
    .min(1, "Enter a reminder title.")
    .max(160, "Reminder title must be 160 characters or fewer."),
  remindAt: z
    .string()
    .trim()
    .min(1, "Choose when to remind yourself.")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "Choose a valid reminder date and time.",
    }),
  applicationId: z
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : value)),
});

export async function updateReminder(
  reminderId: string,
  _prevState: UpdateReminderActionState,
  formData: FormData,
): Promise<UpdateReminderActionState> {
  const titleValue = formData.get("title");
  const remindAtValue = formData.get("remindAt");
  const applicationIdValue = formData.get("applicationId");
  const rawValues = {
    reminderId,
    title: typeof titleValue === "string" ? titleValue : "",
    remindAt: typeof remindAtValue === "string" ? remindAtValue : "",
    applicationId: typeof applicationIdValue === "string" ? applicationIdValue : "",
  };

  const fallbackValues = toReminderFormValues(rawValues);
  const result = updateReminderSchema.safeParse(rawValues);

  if (!result.success) {
    return {
      status: "error",
      error: result.error.issues[0]?.message ?? "Reminder could not be updated.",
      values: fallbackValues,
    };
  }

  try {
    const user = await requireCurrentUser();
    const input = result.data;

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
        dueAt: new Date(input.remindAt),
        applicationId: input.applicationId,
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
