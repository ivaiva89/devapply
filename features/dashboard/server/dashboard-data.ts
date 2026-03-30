import "server-only";

import { ApplicationStatus } from "@prisma/client";

import { applicationStatusLabels } from "@/features/applications/config";
import { prisma } from "@/lib/prisma";

type DashboardKpi = {
  label: string;
  value: number;
  helper: string;
};

type DashboardRecentApplication = {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  updatedAt: string;
};

type DashboardReminder = {
  id: string;
  title: string;
  dueAt: string;
  company: string | null;
};

type DashboardConversionItem = {
  label: string;
  value: string;
  helper: string;
};

type DashboardApplicationsOverTimeItem = {
  label: string;
  count: number;
};

type DashboardStatusItem = {
  status: ApplicationStatus;
  count: number;
  percentage: number;
};

export type DashboardData = {
  kpis: DashboardKpi[];
  applicationsOverTime: DashboardApplicationsOverTimeItem[];
  statuses: DashboardStatusItem[];
  recentApplications: DashboardRecentApplication[];
  reminders: DashboardReminder[];
  conversions: DashboardConversionItem[];
  isEmpty: boolean;
};

function getMonthStart() {
  const now = new Date();

  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

function getMonthBuckets(monthCount: number) {
  const currentMonthStart = getMonthStart();

  return Array.from({ length: monthCount }, (_, index) => {
    const bucketDate = new Date(
      Date.UTC(
        currentMonthStart.getUTCFullYear(),
        currentMonthStart.getUTCMonth() - (monthCount - index - 1),
        1,
      ),
    );

    return {
      key: `${bucketDate.getUTCFullYear()}-${String(
        bucketDate.getUTCMonth() + 1,
      ).padStart(2, "0")}`,
      label: new Intl.DateTimeFormat("en-US", {
        month: "short",
      }).format(bucketDate),
      start: bucketDate,
      end: new Date(
        Date.UTC(
          bucketDate.getUTCFullYear(),
          bucketDate.getUTCMonth() + 1,
          1,
        ),
      ),
    };
  });
}

function formatPercentage(value: number, total: number) {
  if (total === 0) {
    return "0%";
  }

  return `${Math.round((value / total) * 100)}%`;
}

export async function getDashboardDataForUser(
  userId: string,
): Promise<DashboardData> {
  const monthStart = getMonthStart();
  const monthBuckets = getMonthBuckets(6);
  const now = new Date();

  const [
    totalApplications,
    applicationsThisMonth,
    interviews,
    offers,
    statusCounts,
    applicationsOverTime,
    recentApplications,
    reminders,
  ] = await Promise.all([
    prisma.application.count({
      where: { userId },
    }),
    prisma.application.count({
      where: {
        userId,
        createdAt: {
          gte: monthStart,
        },
      },
    }),
    prisma.application.count({
      where: {
        userId,
        status: ApplicationStatus.INTERVIEW,
      },
    }),
    prisma.application.count({
      where: {
        userId,
        status: ApplicationStatus.OFFER,
      },
    }),
    prisma.application.groupBy({
      by: ["status"],
      where: { userId },
      _count: {
        status: true,
      },
    }),
    prisma.application.findMany({
      where: {
        userId,
        createdAt: {
          gte: monthBuckets[0]?.start,
        },
      },
      select: {
        createdAt: true,
      },
    }),
    prisma.application.findMany({
      where: { userId },
      orderBy: [{ updatedAt: "desc" }],
      take: 5,
      select: {
        id: true,
        company: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    }),
    prisma.reminder.findMany({
      where: {
        userId,
        completedAt: null,
      },
      orderBy: [{ dueAt: "asc" }],
      take: 5,
      select: {
        id: true,
        title: true,
        dueAt: true,
        application: {
          select: {
            company: true,
          },
        },
      },
    }),
  ]);

  const countsByStatus = statusCounts.reduce<Record<ApplicationStatus, number>>(
    (accumulator, item) => {
      accumulator[item.status] = item._count.status;
      return accumulator;
    },
    {
      WISHLIST: 0,
      APPLIED: 0,
      INTERVIEW: 0,
      OFFER: 0,
      REJECTED: 0,
    },
  );

  const respondedCount =
    countsByStatus.INTERVIEW + countsByStatus.OFFER + countsByStatus.REJECTED;
  const activePipelineCount =
    countsByStatus.WISHLIST + countsByStatus.APPLIED + countsByStatus.INTERVIEW;
  const applicationsOverTimeByMonth = monthBuckets.map((bucket) => ({
    label: bucket.label,
    count: applicationsOverTime.filter(
      (application) =>
        application.createdAt >= bucket.start && application.createdAt < bucket.end,
    ).length,
  }));

  return {
    kpis: [
      {
        label: "Total applications",
        value: totalApplications,
        helper: "All tracked applications",
      },
      {
        label: "Applications this month",
        value: applicationsThisMonth,
        helper: "Created since the first of the month",
      },
      {
        label: "Interviews",
        value: interviews,
        helper: `${applicationStatusLabels.INTERVIEW} status`,
      },
      {
        label: "Offers",
        value: offers,
        helper: `${applicationStatusLabels.OFFER} status`,
      },
    ],
    applicationsOverTime: applicationsOverTimeByMonth,
    statuses: (
      ["WISHLIST", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"] as ApplicationStatus[]
    ).map((status) => ({
      status,
      count: countsByStatus[status],
      percentage:
        totalApplications === 0
          ? 0
          : (countsByStatus[status] / totalApplications) * 100,
    })),
    recentApplications: recentApplications.map((application) => ({
      id: application.id,
      company: application.company,
      role: application.role,
      status: application.status,
      updatedAt: application.updatedAt.toISOString(),
    })),
    reminders: reminders.map((reminder) => ({
      id: reminder.id,
      title: reminder.title,
      dueAt: reminder.dueAt.toISOString(),
      company: reminder.application?.company ?? null,
    })),
    conversions: [
      {
        label: "Response rate",
        value: formatPercentage(respondedCount, totalApplications),
        helper: "Interview, offer, or rejected",
      },
      {
        label: "Interview conversion",
        value: formatPercentage(
          countsByStatus.INTERVIEW + countsByStatus.OFFER,
          totalApplications,
        ),
        helper: "Current statuses at interview or beyond",
      },
      {
        label: "Offer conversion",
        value: formatPercentage(countsByStatus.OFFER, totalApplications),
        helper: "Current offers out of total applications",
      },
      {
        label: "Active pipeline",
        value: formatPercentage(activePipelineCount, totalApplications),
        helper: "Wishlist, applied, and interview statuses",
      },
    ],
    isEmpty:
      totalApplications === 0 &&
      recentApplications.length === 0 &&
      reminders.length === 0,
  };
}
