"use server";

import { revalidatePath } from "next/cache";

import {
  createApplicationDefaultValues,
  type CreateApplicationActionState,
} from "@/features/applications/create-application-form";
import {
  applicationFormSchema,
  getApplicationFormErrorState,
  getApplicationFormFieldErrors,
  getApplicationFormSuccessState,
} from "@/features/applications/schemas/application-form-schema";
import { createApplicationWithCountForUser } from "@/features/applications/server/application-service";
import { trackServerEvent } from "@/features/analytics/server/track-event";
import { readApplicationFormValues } from "@/features/applications/server/application-form";
import { requireCurrentUser } from "@/features/auth/server/session";
import {
  getPlanGate,
  getPlanLimitReachedMessage,
} from "@/features/billing/server/plan-enforcement";
import { prisma } from "@/lib/prisma";

export async function createApplication(
  _prevState: CreateApplicationActionState,
  formData: FormData,
): Promise<CreateApplicationActionState> {
  const values = readApplicationFormValues(formData);
  const result = applicationFormSchema.safeParse(values);

  if (!result.success) {
    return getApplicationFormErrorState(values, {
      fieldErrors: getApplicationFormFieldErrors(result.error),
    });
  }

  try {
    const user = await requireCurrentUser();
    const gate = await getPlanGate(user.id, "applications");

    if (!gate.allowed) {
      return getApplicationFormErrorState(values, {
        formError: getPlanLimitReachedMessage("applications"),
      });
    }

    const input = result.data;

    const { application, totalApplications } = await prisma.$transaction(
      (tx) => createApplicationWithCountForUser(tx, user.id, input),
    );

    await trackServerEvent({
      distinctId: user.id,
      event: "application_created",
      properties: {
        applicationId: application.id,
        status: application.status,
      },
    });

    if (totalApplications === 1) {
      await trackServerEvent({
        distinctId: user.id,
        event: "first_application_created",
        properties: {
          applicationId: application.id,
          status: application.status,
        },
      });
    }

    revalidatePath("/applications");
    revalidatePath("/dashboard");
    revalidatePath("/pipeline");
    revalidatePath("/reminders");
    revalidatePath("/resumes");

    return getApplicationFormSuccessState(createApplicationDefaultValues);
  } catch {
    return getApplicationFormErrorState(values, {
      formError:
        "The application could not be saved. Check the form and try again.",
    });
  }
}
