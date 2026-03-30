import "server-only";

import { ApplicationStatus, Prisma } from "@prisma/client";

import {
  applicationStatusLabels,
  applicationStatusValues,
  applicationSourceLabels,
} from "@/features/applications/config";
import type { ParsedApplicationFormValues } from "@/features/applications/schemas/application-form-schema";
import type {
  ApplicationListItem,
  ApplicationSortOption,
  ApplicationsQueryState,
} from "@/features/applications/types";
import { prisma } from "@/lib/prisma";

type ApplicationClient = typeof prisma | Prisma.TransactionClient;

export type PipelineApplicationCard = {
  id: string;
  company: string;
  role: string;
  source: string;
  appliedDate: string | null;
  updatedAt: string;
};

export type PipelineColumn = {
  status: (typeof applicationStatusValues)[number];
  label: string;
  items: PipelineApplicationCard[];
};

function getApplicationOrderBy(
  sort: ApplicationSortOption,
): Prisma.ApplicationOrderByWithRelationInput[] {
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

function buildApplicationListWhere(
  userId: string,
  state: ApplicationsQueryState,
): Prisma.ApplicationWhereInput {
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

  return where;
}

function toPipelineCard(application: {
  id: string;
  company: string;
  role: string;
  source: keyof typeof applicationSourceLabels;
  appliedDate: Date | null;
  updatedAt: Date;
}): PipelineApplicationCard {
  return {
    id: application.id,
    company: application.company,
    role: application.role,
    source: applicationSourceLabels[application.source],
    appliedDate: application.appliedDate?.toISOString() ?? null,
    updatedAt: application.updatedAt.toISOString(),
  };
}

export async function getApplicationListDataForUser(
  userId: string,
  state: ApplicationsQueryState,
) {
  const where = buildApplicationListWhere(userId, state);

  const [items, totalCount] = await Promise.all([
    prisma.application.findMany({
      where,
      orderBy: getApplicationOrderBy(state.sort),
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
  ]);

  return {
    items: items as ApplicationListItem[],
    totalCount,
  };
}

export async function getPipelineColumnsForUser(
  userId: string,
): Promise<PipelineColumn[]> {
  const applications = await prisma.application.findMany({
    where: {
      userId,
      status: {
        in: [...applicationStatusValues] as ApplicationStatus[],
      },
    },
    orderBy: [{ updatedAt: "desc" }],
    select: {
      id: true,
      company: true,
      role: true,
      source: true,
      status: true,
      appliedDate: true,
      updatedAt: true,
    },
  });

  return applicationStatusValues.map((status) => ({
    status,
    label: applicationStatusLabels[status],
    items: applications
      .filter((application) => application.status === status)
      .map(toPipelineCard),
  }));
}

export async function createApplicationWithCountForUser(
  client: ApplicationClient,
  userId: string,
  input: ParsedApplicationFormValues,
) {
  const application = await client.application.create({
    data: {
      userId,
      company: input.company,
      role: input.role,
      location: input.location,
      source: input.source,
      status: input.status,
      salaryMin: input.salaryMin,
      salaryMax: input.salaryMax,
      currency: input.currency,
      jobUrl: input.jobUrl,
      notes: input.notes,
      appliedDate: input.appliedDate,
    },
  });
  const totalApplications = await client.application.count({
    where: {
      userId,
    },
  });

  return {
    application,
    totalApplications,
  };
}

export async function updateApplicationForUser(
  userId: string,
  applicationId: string,
  input: ParsedApplicationFormValues,
) {
  return prisma.application.updateMany({
    where: {
      id: applicationId,
      userId,
    },
    data: {
      company: input.company,
      role: input.role,
      location: input.location,
      source: input.source,
      status: input.status,
      salaryMin: input.salaryMin,
      salaryMax: input.salaryMax,
      currency: input.currency,
      jobUrl: input.jobUrl,
      notes: input.notes,
      appliedDate: input.appliedDate,
    },
  });
}

export async function deleteApplicationForUser(
  userId: string,
  applicationId: string,
) {
  return prisma.application.deleteMany({
    where: {
      id: applicationId,
      userId,
    },
  });
}

export async function updateApplicationStatusForUser(
  userId: string,
  applicationId: string,
  nextStatus: ApplicationStatus,
) {
  return prisma.application.updateMany({
    where: {
      id: applicationId,
      userId,
    },
    data: {
      status: nextStatus,
    },
  });
}
