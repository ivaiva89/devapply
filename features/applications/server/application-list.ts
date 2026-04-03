import "server-only";

import { ApplicationStatus } from "@prisma/client";

import { getUserPlan } from "@/features/billing/server/plan-enforcement";
import { getApplicationListDataForUser } from "@/entities/application/api/application-service";
import {
  type ApplicationListItem,
  applicationSortOptions,
  type ApplicationSortOption,
  type ApplicationsQueryState,
} from "@/entities/application/model/types";

const DEFAULT_QUERY_STATE: ApplicationsQueryState = {
  query: "",
  status: "ALL",
  sort: "updated-desc",
};

type RawSearchParams = {
  q?: string | string[] | undefined;
  status?: string | string[] | undefined;
  sort?: string | string[] | undefined;
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseStatus(
  value: string | undefined,
): ApplicationsQueryState["status"] {
  if (!value || value === "ALL") {
    return "ALL";
  }

  const matches = Object.values(ApplicationStatus).find(
    (status) => status === value,
  );

  return matches ?? "ALL";
}

function parseSort(value: string | undefined): ApplicationSortOption {
  if (!value) {
    return DEFAULT_QUERY_STATE.sort;
  }

  return (
    applicationSortOptions.find((option) => option === value) ??
    DEFAULT_QUERY_STATE.sort
  );
}

export function parseApplicationsQueryState(
  searchParams?: RawSearchParams,
): ApplicationsQueryState {
  const query = getSingleValue(searchParams?.q)?.trim() ?? "";
  const status = parseStatus(getSingleValue(searchParams?.status));
  const sort = parseSort(getSingleValue(searchParams?.sort));

  return {
    query,
    status,
    sort,
  };
}

export async function getApplicationsForUser(
  userId: string,
  searchParams?: RawSearchParams,
): Promise<{
  items: ApplicationListItem[];
  state: ApplicationsQueryState;
  totalCount: number;
  plan: "FREE" | "PRO" | "LIFETIME";
}> {
  const state = parseApplicationsQueryState(searchParams);
  const [{ items, totalCount }, user] = await Promise.all([
    getApplicationListDataForUser(userId, state),
    getUserPlan(userId),
  ]);

  return {
    items,
    state,
    totalCount,
    plan: user?.plan ?? "FREE",
  };
}
