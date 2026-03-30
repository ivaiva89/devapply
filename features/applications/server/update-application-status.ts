"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { applicationStatusValues, type ApplicationStatusValue } from "@/features/applications/config";
import { updateApplicationStatusForUser } from "@/features/applications/server/application-service";
import { requireCurrentUser } from "@/features/auth/server/session";

type UpdateApplicationStatusResult =
  | { status: "success" }
  | { status: "error"; message: string };

const updateApplicationStatusSchema = z.object({
  applicationId: z
    .string()
    .trim()
    .min(1, "That application could not be found."),
  nextStatus: z.enum(applicationStatusValues),
});

export async function updateApplicationStatus(
  applicationId: string,
  nextStatus: ApplicationStatusValue,
): Promise<UpdateApplicationStatusResult> {
  const result = updateApplicationStatusSchema.safeParse({
    applicationId,
    nextStatus,
  });

  if (!result.success) {
    return {
      status: "error",
      message:
        result.error.issues[0]?.message ?? "The selected status is not valid.",
    };
  }

  const input = result.data;

  const user = await requireCurrentUser();
  const updated = await updateApplicationStatusForUser(
    user.id,
    input.applicationId,
    input.nextStatus,
  );

  if (updated.count === 0) {
    return {
      status: "error",
      message: "That application could not be found.",
    };
  }

  revalidatePath("/applications");
  revalidatePath("/pipeline");
  revalidatePath("/dashboard");

  return { status: "success" };
}
