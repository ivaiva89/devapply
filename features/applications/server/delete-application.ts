"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { DeleteApplicationActionState } from "@/features/applications/application-delete";
import { requireCurrentUser } from "@/features/auth/server/session";
import { prisma } from "@/lib/prisma";

const deleteApplicationSchema = z.object({
  applicationId: z
    .string()
    .trim()
    .min(1, "That application could not be found."),
});

export async function deleteApplication(
  applicationId: string,
  _prevState: DeleteApplicationActionState,
  _formData: FormData,
): Promise<DeleteApplicationActionState> {
  void _prevState;
  void _formData;

  const result = deleteApplicationSchema.safeParse({ applicationId });

  if (!result.success) {
    return {
      status: "error",
      error:
        result.error.issues[0]?.message ??
        "That application could not be found.",
    };
  }

  try {
    const user = await requireCurrentUser();
    const deleted = await prisma.application.deleteMany({
      where: {
        id: result.data.applicationId,
        userId: user.id,
      },
    });

    if (deleted.count === 0) {
      return {
        status: "error",
        error: "That application could not be found.",
      };
    }

    revalidatePath("/applications");
    revalidatePath("/dashboard");
    revalidatePath("/pipeline");
    revalidatePath("/reminders");
    revalidatePath("/resumes");

    return {
      status: "success",
    };
  } catch {
    return {
      status: "error",
      error: "The application could not be deleted. Try again.",
    };
  }
}
