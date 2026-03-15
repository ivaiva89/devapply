"use server";

import { revalidatePath } from "next/cache";

import type { DeleteApplicationActionState } from "@/features/applications/application-delete";
import { requireCurrentUser } from "@/features/auth/server/session";
import { prisma } from "@/lib/prisma";

export async function deleteApplication(
  applicationId: string,
  _prevState: DeleteApplicationActionState,
  _formData: FormData,
): Promise<DeleteApplicationActionState> {
  void _prevState;
  void _formData;

  try {
    const user = await requireCurrentUser();
    const deleted = await prisma.application.deleteMany({
      where: {
        id: applicationId,
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
