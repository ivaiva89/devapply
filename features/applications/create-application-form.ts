import type {
  ApplicationSourceValue,
  ApplicationStatusValue,
} from "@/features/applications/config";

export type CreateApplicationFormValues = {
  company: string;
  role: string;
  location: string;
  source: ApplicationSourceValue;
  status: ApplicationStatusValue;
  salaryMin: string;
  salaryMax: string;
  currency: string;
  jobUrl: string;
  notes: string;
  appliedDate: string;
};

export type CreateApplicationFieldName = keyof CreateApplicationFormValues;

export type CreateApplicationFieldErrors = Partial<
  Record<CreateApplicationFieldName, string>
>;

export type CreateApplicationActionState = {
  status: "idle" | "error" | "success";
  values: CreateApplicationFormValues;
  fieldErrors: CreateApplicationFieldErrors;
  formError?: string;
};

export const createApplicationFieldNames = [
  "company",
  "role",
  "location",
  "source",
  "status",
  "salaryMin",
  "salaryMax",
  "currency",
  "jobUrl",
  "notes",
  "appliedDate",
] as const satisfies readonly CreateApplicationFieldName[];

export const createApplicationDefaultValues: CreateApplicationFormValues = {
  company: "",
  role: "",
  location: "",
  source: "LINKEDIN",
  status: "WISHLIST",
  salaryMin: "",
  salaryMax: "",
  currency: "USD",
  jobUrl: "",
  notes: "",
  appliedDate: "",
};

type ApplicationFormValueSource = {
  company: string;
  role: string;
  location: string | null;
  source: CreateApplicationFormValues["source"];
  status: CreateApplicationFormValues["status"];
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  jobUrl: string | null;
  notes: string | null;
  appliedDate: Date | null;
};

function formatDateForInput(value: Date) {
  return value.toISOString().slice(0, 10);
}

export function getApplicationFormValues(
  value: ApplicationFormValueSource,
): CreateApplicationFormValues {
  return {
    company: value.company,
    role: value.role,
    location: value.location ?? "",
    source: value.source,
    status: value.status,
    salaryMin: value.salaryMin?.toString() ?? "",
    salaryMax: value.salaryMax?.toString() ?? "",
    currency: value.currency,
    jobUrl: value.jobUrl ?? "",
    notes: value.notes ?? "",
    appliedDate: value.appliedDate ? formatDateForInput(value.appliedDate) : "",
  };
}

export function getCreateApplicationInitialState(
  values: CreateApplicationFormValues = createApplicationDefaultValues,
): CreateApplicationActionState {
  return {
    status: "idle",
    values: { ...values },
    fieldErrors: {},
  };
}
