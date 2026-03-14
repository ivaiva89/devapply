import { ApplicationSource, ApplicationStatus } from "@prisma/client";

export type ApplicationListItem = {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  source: ApplicationSource;
  appliedDate: Date | null;
  updatedAt: Date;
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
  status: ApplicationStatus | "ALL";
  sort: ApplicationSortOption;
};
