import type { Application } from "@prisma/client";

import type {
  ApplicationSourceValue,
  ApplicationStatusValue,
} from "@/entities/application/model/config";

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
