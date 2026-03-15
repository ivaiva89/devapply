"use server";

import { revalidatePath } from "next/cache";

import { requireCurrentUser } from "@/features/auth/server/session";
import { prisma } from "@/lib/prisma";

export async function completeReminder(
  reminderId: string,
  formData: FormData,
) {
  const user = await requireCurrentUser();
  const action = formData.get("actionType");

  if (action !== "done" && action !== "sent") {
    return;
  }

  const reminder = await prisma.reminder.findFirst({
    where: {
      id: reminderId,
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
