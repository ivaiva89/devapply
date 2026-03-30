"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { DeleteApplicationActionState } from "@/features/applications/application-delete";
import { deleteApplicationForUser } from "@/features/applications/server/application-service";
import { requireCurrentUser } from "@/features/auth/server/session";
import { getValidationErrorMessage } from "@/lib/server-action-validation";

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
      error: getValidationErrorMessage(result.error, "That application could not be found."),
    };
  }

  try {
    const user = await requireCurrentUser();
    const deleted = await deleteApplicationForUser(user.id, result.data.applicationId);

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
