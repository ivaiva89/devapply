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

export function getCreateApplicationInitialState(): CreateApplicationActionState {
  return {
    status: "idle",
    values: { ...createApplicationDefaultValues },
    fieldErrors: {},
  };
}
