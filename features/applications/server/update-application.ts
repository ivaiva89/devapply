"use server";

import { revalidatePath } from "next/cache";

import {
  applicationFormSchema,
  getApplicationFormErrorState,
  getApplicationFormFieldErrors,
  getApplicationFormSuccessState,
} from "@/features/applications/schemas/application-form-schema";
import { readApplicationFormValues } from "@/features/applications/server/application-form";
import { requireCurrentUser } from "@/features/auth/server/session";
import { prisma } from "@/lib/prisma";
import type { CreateApplicationActionState } from "@/features/applications/create-application-form";

export async function updateApplication(
  applicationId: string,
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
    const ownedApplication = await prisma.application.findFirst({
      where: {
        id: applicationId,
        userId: user.id,
      },
      select: {
        id: true,
      },
    });

    if (!ownedApplication) {
      return getApplicationFormErrorState(values, {
        formError: "That application could not be found.",
      });
    }

    const input = result.data;

    await prisma.application.update({
      where: {
        id: ownedApplication.id,
      },
      data: {
        company: input.company,
        role: input.role,
        location: input.location,
        source: input.source,
        status: input.status,
        salaryMin: input.salaryMin,
        salaryMax: input.salaryMax,
        currency: input.currency,
        jobUrl: input.jobUrl,
        notes: input.notes,
        appliedDate: input.appliedDate,
      },
    });

    revalidatePath("/applications");
    revalidatePath("/dashboard");
    revalidatePath("/pipeline");
    revalidatePath("/reminders");
    revalidatePath("/resumes");

    return getApplicationFormSuccessState(values);
  } catch {
    return getApplicationFormErrorState(values, {
      formError:
        "The application could not be updated. Check the form and try again.",
    });
  }
}
