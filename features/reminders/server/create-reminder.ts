"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireCurrentUser } from "@/features/auth/server/session";
import { FREE_REMINDER_LIMIT } from "@/features/reminders/server/reminder-list";
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
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "Choose a valid reminder date and time.",
    }),
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
  const activeReminderCount = await prisma.reminder.count({
    where: {
      userId: user.id,
      completedAt: null,
    },
  });

  if (user.plan === "FREE" && activeReminderCount >= FREE_REMINDER_LIMIT) {
    return {
      status: "error",
      error:
        "Free plan users can keep 3 active reminders. Upgrade to Pro to create more reminders.",
    };
  }

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
      };
    }
  }

  await prisma.reminder.create({
    data: {
      userId: user.id,
      title: input.title,
      dueAt: new Date(input.remindAt),
      applicationId: input.applicationId,
    },
  });

  revalidatePath("/reminders");
  revalidatePath("/dashboard");

  return {
    status: "success",
  };
}
