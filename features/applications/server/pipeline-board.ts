import "server-only";

import { ApplicationStatus } from "@prisma/client";

import { applicationStatusLabels, applicationStatusValues, applicationSourceLabels } from "@/features/applications/config";
import { prisma } from "@/lib/prisma";

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
