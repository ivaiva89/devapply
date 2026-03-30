"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireCurrentUser } from "@/features/auth/server/session";
import { prisma } from "@/lib/prisma";

const completeReminderSchema = z.object({
  reminderId: z.string().trim().min(1),
  actionType: z.enum(["done", "sent"]),
});

export async function completeReminder(reminderId: string, formData: FormData) {
  const user = await requireCurrentUser();
  const result = completeReminderSchema.safeParse({
    reminderId,
    actionType: formData.get("actionType"),
  });

  if (!result.success) {
    return;
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
    return;
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
}
