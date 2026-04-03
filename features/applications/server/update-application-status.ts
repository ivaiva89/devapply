"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  applicationStatusValues,
  type ApplicationStatusValue,
} from "@/entities/application/model/config";
import { updateApplicationStatusForUser } from "@/entities/application/api/application-service";
import { trackServerEvent } from "@/features/analytics/server/track-event";
import { requireCurrentUser } from "@/features/auth/server/session";
import { REVALIDATE_PATHS } from "@/features/applications/server/revalidate-paths";
import { getValidationErrorMessage } from "@/shared/lib/server-action-validation";

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
      message: getValidationErrorMessage(
        result.error,
        "The selected status is not valid.",
      ),
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

  await trackServerEvent({
    distinctId: user.id,
    event: "application_status_changed",
    properties: {
      applicationId: input.applicationId,
      status: input.nextStatus,
    },
  });

  REVALIDATE_PATHS.APPLICATIONS.forEach((path) => {
    revalidatePath(path);
  });

  return { status: "success" };
}
