import "server-only";

import { ApplicationStatus, Prisma } from "@prisma/client";

import { getUserPlan } from "@/features/billing/server/plan-enforcement";
import { prisma } from "@/lib/prisma";
import {
  type ApplicationListItem,
  applicationSortOptions,
  type ApplicationSortOption,
  type ApplicationsQueryState,
} from "@/features/applications/types";

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

function parseStatus(value: string | undefined): ApplicationsQueryState["status"] {
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

  return applicationSortOptions.find((option) => option === value) ?? DEFAULT_QUERY_STATE.sort;
}

function getOrderBy(sort: ApplicationSortOption): Prisma.ApplicationOrderByWithRelationInput[] {
  switch (sort) {
    case "updated-asc":
      return [{ updatedAt: "asc" }];
    case "applied-desc":
      return [{ appliedDate: "desc" }, { updatedAt: "desc" }];
    case "applied-asc":
      return [{ appliedDate: "asc" }, { updatedAt: "desc" }];
    case "updated-desc":
    default:
      return [{ updatedAt: "desc" }];
  }
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
  plan: "FREE" | "PRO";
}> {
  const state = parseApplicationsQueryState(searchParams);
  const where: Prisma.ApplicationWhereInput = {
    userId,
  };

  if (state.query) {
    where.OR = [
      { company: { contains: state.query, mode: "insensitive" } },
      { role: { contains: state.query, mode: "insensitive" } },
    ];
  }

  if (state.status !== "ALL") {
    where.status = state.status;
  }

  const [items, totalCount, user] = await Promise.all([
    prisma.application.findMany({
      where,
      orderBy: getOrderBy(state.sort),
      select: {
        id: true,
        company: true,
        role: true,
        location: true,
        status: true,
        source: true,
        salaryMin: true,
        salaryMax: true,
        currency: true,
        jobUrl: true,
        notes: true,
        appliedDate: true,
        updatedAt: true,
      },
    }),
    prisma.application.count({
      where: {
        userId,
      },
    }),
    getUserPlan(userId),
  ]);

  return {
    items,
    state,
    totalCount,
    plan: user?.plan ?? "FREE",
  };
}
