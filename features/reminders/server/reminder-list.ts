import "server-only";

import { getPlanGateFromUsage } from "@/features/billing/server/plan-enforcement";
import { prisma } from "@/lib/prisma";
import type { RemindersPageData } from "@/features/reminders/types";

export async function getRemindersPageDataForUser(
  userId: string,
): Promise<RemindersPageData> {
  const [user, reminders, applications] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        plan: true,
      },
    }),
    prisma.reminder.findMany({
      where: {
        userId,
        completedAt: null,
      },
      orderBy: [{ dueAt: "asc" }],
      select: {
        id: true,
        title: true,
        dueAt: true,
        application: {
          select: {
            id: true,
            company: true,
            role: true,
          },
        },
      },
    }),
    prisma.application.findMany({
      where: { userId },
      orderBy: [{ updatedAt: "desc" }],
      select: {
        id: true,
        company: true,
        role: true,
      },
    }),
  ]);

  if (!user) {
    return {
      plan: "FREE",
      activeReminderCount: 0,
      canCreate: false,
      reminders: [],
      applicationOptions: [],
    };
  }

  const activeReminderCount = reminders.length;
  const canCreate = getPlanGateFromUsage(
    user.plan,
    activeReminderCount,
    "reminders",
  ).allowed;

  return {
    plan: user.plan,
    activeReminderCount,
    canCreate,
    reminders: reminders.map((reminder) => ({
      id: reminder.id,
      title: reminder.title,
      remindAt: reminder.dueAt.toISOString(),
      application: reminder.application,
    })),
    applicationOptions: applications.map((application) => ({
      id: application.id,
      label: `${application.company} - ${application.role}`,
    })),
  };
}
