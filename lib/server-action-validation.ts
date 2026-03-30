import { z } from "zod";

export function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function getValidationErrorMessage(
  error: z.ZodError,
  fallback: string,
) {
  return error.issues[0]?.message ?? fallback;
}
