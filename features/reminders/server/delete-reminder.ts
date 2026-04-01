"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireCurrentUser } from "@/features/auth/server/session";
import { prisma } from "@/lib/prisma";
import { getValidationErrorMessage } from "@/lib/server-action-validation";
import type { DeleteReminderActionState } from "@/features/reminders/types";

const deleteReminderSchema = z.object({
  reminderId: z.string().trim().min(1, "That reminder could not be found."),
});

export async function deleteReminder(
  reminderId: string,
  _prevState: DeleteReminderActionState,
  _formData: FormData,
): Promise<DeleteReminderActionState> {
  void _prevState;
  void _formData;

  const result = deleteReminderSchema.safeParse({ reminderId });

  if (!result.success) {
    return {
      status: "error",
      error: getValidationErrorMessage(
        result.error,
        "That reminder could not be found.",
      ),
    };
  }

  try {
    const user = await requireCurrentUser();
    const deleted = await prisma.reminder.deleteMany({
      where: {
        id: result.data.reminderId,
        userId: user.id,
      },
    });

    if (deleted.count === 0) {
      return {
        status: "error",
        error: "That reminder could not be found.",
      };
    }

    revalidatePath("/reminders");
    revalidatePath("/dashboard");

    return {
      status: "success",
    };
  } catch {
    return {
      status: "error",
      error: "The reminder could not be deleted. Try again.",
    };
  }
}
