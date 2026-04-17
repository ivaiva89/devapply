import { z } from "zod";

import {
  applicationSourceValues,
  applicationStatusValues,
} from "@/entities/application/model/config";
import {
  createApplicationDefaultValues,
  createApplicationFieldNames,
  type CreateApplicationActionState,
  type CreateApplicationFieldErrors,
  type CreateApplicationFormValues,
} from "@/features/applications/create-application-form";

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidDateInput(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day, 12));

  return (
    parsedDate.getUTCFullYear() === year &&
    parsedDate.getUTCMonth() === month - 1 &&
    parsedDate.getUTCDate() === day
  );
}

function createDateFromInput(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day, 12));
}

const optionalWholeNumberSchema = (label: string) =>
  z
    .string()
    .trim()
    .refine((value) => value === "" || /^\d+$/.test(value), {
      message: `${label} must be a whole number.`,
    })
    .transform((value) => (value === "" ? undefined : Number(value)));

export const applicationFormSchema = z
  .object({
    company: z
      .string()
      .trim()
      .min(1, "Enter the company.")
      .max(120, "Company must be 120 characters or fewer."),
    role: z
      .string()
      .trim()
      .min(1, "Enter the role.")
      .max(160, "Role must be 160 characters or fewer."),
    location: z
      .string()
      .trim()
      .max(120, "Location must be 120 characters or fewer.")
      .transform((value) => (value === "" ? undefined : value)),
    source: z.enum(applicationSourceValues),
    status: z.enum(applicationStatusValues),
    salaryMin: optionalWholeNumberSchema("Minimum salary"),
    salaryMax: optionalWholeNumberSchema("Maximum salary"),
    currency: z
      .string()
      .trim()
      .toUpperCase()
      .refine((value) => /^[A-Z]{3}$/.test(value), {
        message: "Use a 3-letter currency code.",
      }),
    jobUrl: z
      .string()
      .trim()
      .refine((value) => value === "" || isValidHttpUrl(value), {
        message: "Enter a valid URL.",
      })
      .transform((value) => (value === "" ? undefined : value)),
    notes: z
      .string()
      .trim()
      .max(4000, "Notes must be 4000 characters or fewer.")
      .transform((value) => (value === "" ? undefined : value)),
    appliedDate: z
      .string()
      .trim()
      .refine((value) => value === "" || isValidDateInput(value), {
        message: "Choose a valid applied date.",
      })
      .transform((value) =>
        value === "" ? undefined : createDateFromInput(value),
      ),
  })
  .superRefine((value, context) => {
    if (
      value.salaryMin !== undefined &&
      value.salaryMax !== undefined &&
      value.salaryMax < value.salaryMin
    ) {
      context.addIssue({
        code: "custom",
        path: ["salaryMax"],
        message:
          "Maximum salary must be greater than or equal to minimum salary.",
      });
    }
  });

export type ParsedApplicationFormValues = z.output<
  typeof applicationFormSchema
>;

export function getApplicationFormFieldErrors(
  error: z.ZodError,
): CreateApplicationFieldErrors {
  const flattened = error.flatten().fieldErrors as Partial<
    Record<(typeof createApplicationFieldNames)[number], string[]>
  >;
  const fieldErrors: CreateApplicationFieldErrors = {};

  for (const fieldName of createApplicationFieldNames) {
    const message = flattened[fieldName]?.[0];

    if (message) {
      fieldErrors[fieldName] = message;
    }
  }

  return fieldErrors;
}

export function getApplicationFormSuccessState(
  values: CreateApplicationFormValues = createApplicationDefaultValues,
): CreateApplicationActionState {
  return {
    status: "success",
    values: { ...values },
    fieldErrors: {},
  };
}

export function getApplicationFormErrorState(
  values: CreateApplicationFormValues,
  overrides: Partial<CreateApplicationActionState>,
): CreateApplicationActionState {
  return {
    status: "error",
    values,
    fieldErrors: {},
    ...overrides,
  };
}
