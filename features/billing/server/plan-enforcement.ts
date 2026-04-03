import "server-only";

import type { Plan } from "@prisma/client";

import { FREE_PLAN_LIMITS } from "@/features/billing/config";
import type { AuthenticatedAppUser } from "@/features/auth/server/session";
import { prisma } from "@/shared/lib/prisma";

export type LimitResource = keyof typeof FREE_PLAN_LIMITS;

const PLAN_LIMIT_REACHED_MESSAGES: Record<LimitResource, string> = {
  applications: `Free plan users can track ${FREE_PLAN_LIMITS.applications} applications. Upgrade to Pro or Lifetime to keep adding applications.`,
  resumes: `Free plan users can upload ${FREE_PLAN_LIMITS.resumes} resume. Upgrade to Pro or Lifetime to store multiple versions.`,
  reminders: `Free plan users can keep ${FREE_PLAN_LIMITS.reminders} active reminders. Upgrade to Pro or Lifetime to create more reminders.`,
};

type SupportedPlan = Plan | "FREE" | "PRO" | "LIFETIME";
type PlanGateUser = Pick<AuthenticatedAppUser, "id" | "plan">;

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

export function hasUnlimitedAccess(plan: SupportedPlan) {
  return plan === "PRO" || plan === "LIFETIME";
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

export async function getPlanGate(
  userOrId: string | PlanGateUser,
  resource: LimitResource,
) {
  const user =
    typeof userOrId === "string" ? await getUserPlan(userOrId) : userOrId;

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
