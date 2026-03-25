import "server-only";

import type { BillingPlan } from "@/features/billing/server/provider-config";
import { prisma } from "@/lib/prisma";

type BillingPayload = {
  data: {
    customer?: {
      externalId?: string | null;
    } | null;
    metadata?: Record<string, string | number | boolean | null | undefined>;
    productId?: string | null;
  };
};

function getPayloadUserId(payload: BillingPayload) {
  const externalId = payload.data.customer?.externalId?.trim();

  if (externalId) {
    return externalId;
  }

  const metadataUserId = payload.data.metadata?.userId;

  return typeof metadataUserId === "string" && metadataUserId.trim().length > 0
    ? metadataUserId.trim()
    : null;
}

export async function syncUserPlanFromBillingPayload(
  payload: BillingPayload,
  plan: BillingPlan,
) {
  const userId = getPayloadUserId(payload);

  if (!userId) {
    console.warn("billing webhook payload missing user identifier");
    return;
  }

  await prisma.user.updateMany({
    where: {
      id: userId,
    },
    data: {
      plan,
    },
  });
}
