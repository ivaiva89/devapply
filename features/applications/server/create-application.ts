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
  readApplicationFormValues,
} from "@/features/applications/server/application-form";
import { requireCurrentUser } from "@/features/auth/server/session";
import { FREE_PLAN_LIMITS } from "@/features/billing/config";
import { getPlanGate } from "@/features/billing/server/plan-enforcement";
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
        formError: `Free plan users can track ${FREE_PLAN_LIMITS.applications} applications. Upgrade to Pro to keep adding applications.`,
      });
    }

    const input = result.data;

    await prisma.application.create({
      data: {
        userId: user.id,
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

    return getApplicationFormSuccessState(createApplicationDefaultValues);
  } catch {
    return getApplicationFormErrorState(values, {
      formError:
        "The application could not be saved. Check the form and try again.",
    });
  }
}
