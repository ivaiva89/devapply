export const applicationStatusValues = [
  "WISHLIST",
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
] as const;

export type ApplicationStatusValue = (typeof applicationStatusValues)[number];

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
  WISHLIST: "Wishlist",
  APPLIED: "Applied",
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

export const applicationStatusTones: Record<
  ApplicationStatusValue,
  "neutral" | "info" | "warning" | "success" | "danger"
> = {
  WISHLIST: "neutral",
  APPLIED: "info",
  INTERVIEW: "warning",
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
