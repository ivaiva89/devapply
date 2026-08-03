import type { ChipTone } from "@/shared/design/chip";

export const applicationStatusValues = [
  "WISHLIST",
  "APPLIED",
  "SCREEN",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
] as const;

export type ApplicationStatusValue = (typeof applicationStatusValues)[number];

// Stages shown on the kanban board. Rejected is past-tense — it lives in the
// table, never on the board (DESIGN.md §0). Order is the pipeline doctrine.
export const pipelineStageValues = [
  "WISHLIST",
  "APPLIED",
  "SCREEN",
  "INTERVIEW",
  "OFFER",
] as const satisfies readonly ApplicationStatusValue[];

export type PipelineStageValue = (typeof pipelineStageValues)[number];

export const applicationSourceValues = [
  "LINKEDIN",
  "COMPANY_SITE",
  "REFERRAL",
  "INDEED",
  "WELLFOUND",
  "OTHER",
] as const;

export type ApplicationSourceValue = (typeof applicationSourceValues)[number];

export const applicationStatusLabels: Record<ApplicationStatusValue, string> = {
  WISHLIST: "Saved",
  APPLIED: "Applied",
  SCREEN: "Screen",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
};

export const applicationSourceLabels: Record<ApplicationSourceValue, string> = {
  LINKEDIN: "LinkedIn",
  COMPANY_SITE: "Company site",
  REFERRAL: "Referral",
  INDEED: "Indeed",
  WELLFOUND: "Wellfound",
  OTHER: "Other",
};

// Pipeline-stage doctrine (DESIGN.md §5): Saved=slate, Applied=indigo,
// Screen=blue, Interview=mint (the "active" stage), Offer=green, Rejected=red.
// Every chip carries a leading dot — see shared/design/chip.tsx.
export const applicationStatusChipTones: Record<
  ApplicationStatusValue,
  ChipTone
> = {
  WISHLIST: "slate",
  APPLIED: "primary",
  SCREEN: "info",
  INTERVIEW: "accent",
  OFFER: "success",
  REJECTED: "danger",
};

export const applicationFormStatusOptions: ReadonlyArray<{
  value: ApplicationStatusValue;
  label: string;
}> = applicationStatusValues.map((value) => ({
  value,
  label: applicationStatusLabels[value],
}));

export const applicationStatusFilterOptions: ReadonlyArray<{
  value: ApplicationStatusValue | "ALL";
  label: string;
}> = [{ value: "ALL", label: "All statuses" }, ...applicationFormStatusOptions];

export const applicationSourceOptions: ReadonlyArray<{
  value: ApplicationSourceValue;
  label: string;
}> = applicationSourceValues.map((value) => ({
  value,
  label: applicationSourceLabels[value],
}));

export const applicationSortSelectOptions = [
  { value: "updated-desc", label: "Recently updated" },
  { value: "updated-asc", label: "Least recently updated" },
  { value: "applied-desc", label: "Newest applied date" },
  { value: "applied-asc", label: "Oldest applied date" },
] as const;
