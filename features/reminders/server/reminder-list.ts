import "server-only";

import { prisma } from "@/shared/lib/prisma";
import type { RemindersPageData } from "@/features/reminders/types";

export async function getRemindersPageDataForUser(
  userId: string,
): Promise<RemindersPageData> {
  const [reminders, applications] = await Promise.all([
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
        notes: true,
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

  return {
    activeReminderCount: reminders.length,
    reminders: reminders.map((reminder) => ({
      id: reminder.id,
      title: reminder.title,
      remindAt: reminder.dueAt.toISOString(),
      notes: reminder.notes,
      application: reminder.application,
    })),
    applicationOptions: applications.map((application) => ({
      id: application.id,
      label: `${application.company} - ${application.role}`,
    })),
  };
}
