import "server-only";

import type { Plan } from "@prisma/client";

import { FREE_PLAN_LIMITS } from "@/features/billing/config";
import { prisma } from "@/lib/prisma";

export type LimitResource = keyof typeof FREE_PLAN_LIMITS;

const PLAN_LIMIT_REACHED_MESSAGES: Record<LimitResource, string> = {
  applications:
    `Free plan users can track ${FREE_PLAN_LIMITS.applications} applications. Upgrade to Pro to keep adding applications.`,
  resumes:
    `Free plan users can upload ${FREE_PLAN_LIMITS.resumes} resume. Upgrade to Pro to store multiple versions.`,
  reminders:
    `Free plan users can keep ${FREE_PLAN_LIMITS.reminders} active reminders. Upgrade to Pro to create more reminders.`,
};

type SupportedPlan = Plan | "FREE" | "PRO";

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

export function getPlanLimit(resource: LimitResource) {
  return FREE_PLAN_LIMITS[resource];
}

export function getPlanLimitReachedMessage(resource: LimitResource) {
  return PLAN_LIMIT_REACHED_MESSAGES[resource];
}

export function getPlanGateFromUsage(
  plan: SupportedPlan,
  used: number,
  resource: LimitResource,
) {
  const limit = getPlanLimit(resource);
  const allowed = hasUnlimitedAccess(plan) || used < limit;

  return {
    allowed,
    limit,
    plan,
    used,
  };
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
      limit: getPlanLimit(resource),
      used: 0,
    };
  }

  const used = await getUsageCount(user.id, resource);

  return getPlanGateFromUsage(user.plan, used, resource);
}
