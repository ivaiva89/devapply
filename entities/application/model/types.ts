import type { Application } from "@prisma/client";

import type {
  ApplicationSourceValue,
  ApplicationStatusValue,
} from "@/entities/application/model/config";

export type ApplicationFormInput = {
  company: string;
  role: string;
  location: string | undefined;
  source: ApplicationSourceValue;
  status: ApplicationStatusValue;
  salaryMin: number | undefined;
  salaryMax: number | undefined;
  currency: string;
  jobUrl: string | undefined;
  notes: string | undefined;
  appliedDate: Date | undefined;
};

export type ApplicationListItem = Pick<
  Application,
  | "id"
  | "company"
  | "role"
  | "location"
  | "status"
  | "source"
  | "salaryMin"
  | "salaryMax"
  | "currency"
  | "jobUrl"
  | "notes"
  | "appliedDate"
  | "lastActivityAt"
  | "updatedAt"
> & {
  status: ApplicationStatusValue;
  source: ApplicationSourceValue;
};

export const applicationSortOptions = [
  "updated-desc",
  "updated-asc",
  "applied-desc",
  "applied-asc",
] as const;

export type ApplicationSortOption = (typeof applicationSortOptions)[number];

export type ApplicationsQueryState = {
  query: string;
  status: ApplicationStatusValue | "ALL";
  sort: ApplicationSortOption;
};
