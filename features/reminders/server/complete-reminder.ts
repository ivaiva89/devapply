"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireCurrentUser } from "@/features/auth/server/session";
import { prisma } from "@/shared/lib/prisma";

const completeReminderSchema = z.object({
  reminderId: z.string().trim().min(1),
  actionType: z.enum(["done", "sent"]),
});

type CompleteReminderResult =
  | { status: "success" }
  | { status: "error"; error: string };

async function completeReminderAction(
  reminderId: string,
  formData: FormData,
): Promise<CompleteReminderResult> {
  const user = await requireCurrentUser();
  const result = completeReminderSchema.safeParse({
    reminderId,
    actionType: formData.get("actionType"),
  });

  if (!result.success) {
    return {
      status: "error",
      error: "The reminder action was not valid.",
    };
  }

  const input = result.data;

  const reminder = await prisma.reminder.findFirst({
    where: {
      id: input.reminderId,
      userId: user.id,
      completedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (!reminder) {
    return {
      status: "error",
      error: "That reminder could not be found.",
    };
  }

  await prisma.reminder.update({
    where: {
      id: reminder.id,
    },
    data: {
      completedAt: new Date(),
    },
  });

  revalidatePath("/reminders");
  revalidatePath("/dashboard");

  return {
    status: "success",
  };
}

export async function completeReminder(
  reminderId: string,
  formData: FormData,
): Promise<void> {
  await completeReminderAction(reminderId, formData);
}
