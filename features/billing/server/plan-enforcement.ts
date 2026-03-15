import "server-only";

import type { Plan } from "@prisma/client";

import { FREE_PLAN_LIMITS } from "@/features/billing/config";
import { prisma } from "@/lib/prisma";

type LimitResource = keyof typeof FREE_PLAN_LIMITS;

export async function getUserPlan(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
    },
  });
}

export function hasUnlimitedAccess(plan: Plan) {
  return plan === "PRO";
}

export async function getUsageCount(userId: string, resource: LimitResource) {
  switch (resource) {
    case "applications":
      return prisma.application.count({
        where: { userId },
      });
    case "resumes":
      return prisma.resume.count({
        where: { userId },
      });
    case "reminders":
      return prisma.reminder.count({
        where: {
          userId,
          completedAt: null,
        },
      });
  }
}

export async function getPlanGate(userId: string, resource: LimitResource) {
  const user = await getUserPlan(userId);

  if (!user) {
    return {
      allowed: false,
      plan: "FREE" as const,
      limit: FREE_PLAN_LIMITS[resource],
      used: 0,
    };
  }

  const used = await getUsageCount(user.id, resource);
  const limit = FREE_PLAN_LIMITS[resource];
  const allowed = hasUnlimitedAccess(user.plan) || used < limit;

  return {
    allowed,
    plan: user.plan,
    limit,
    used,
  };
}
