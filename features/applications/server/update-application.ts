"use server";

import { revalidatePath } from "next/cache";

import {
  applicationFormSchema,
  getApplicationFormErrorState,
  getApplicationFormFieldErrors,
  getApplicationFormSuccessState,
} from "@/features/applications/schemas/application-form-schema";
import { readApplicationFormValues } from "@/features/applications/server/application-form";
import { updateApplicationForUser } from "@/features/applications/server/application-service";
import { requireCurrentUser } from "@/features/auth/server/session";
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
    const input = result.data;
    const updated = await updateApplicationForUser(user.id, applicationId, input);

    if (updated.count === 0) {
      return getApplicationFormErrorState(values, {
        formError: "That application could not be found.",
      });
    }

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
