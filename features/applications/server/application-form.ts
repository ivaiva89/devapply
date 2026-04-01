import "server-only";

import type { CreateApplicationFormValues } from "@/features/applications/create-application-form";

function getStringValue(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);

  return typeof value === "string" ? value : "";
}

export function readApplicationFormValues(
  formData: FormData,
): CreateApplicationFormValues {
  return {
    company: getStringValue(formData, "company"),
    role: getStringValue(formData, "role"),
    location: getStringValue(formData, "location"),
    source: getStringValue(
      formData,
      "source",
    ) as CreateApplicationFormValues["source"],
    status: getStringValue(
      formData,
      "status",
    ) as CreateApplicationFormValues["status"],
    salaryMin: getStringValue(formData, "salaryMin"),
    salaryMax: getStringValue(formData, "salaryMax"),
    currency: getStringValue(formData, "currency"),
    jobUrl: getStringValue(formData, "jobUrl"),
    notes: getStringValue(formData, "notes"),
    appliedDate: getStringValue(formData, "appliedDate"),
  };
}
