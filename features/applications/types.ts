import { ApplicationSource, ApplicationStatus } from "@prisma/client";

export type ApplicationListItem = {
  id: string;
  company: string;
  role: string;
  location: string | null;
  status: ApplicationStatus;
  source: ApplicationSource;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  jobUrl: string | null;
  notes: string | null;
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
