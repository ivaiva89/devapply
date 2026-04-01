import "server-only";

import type { Prisma } from "@prisma/client";

import { trackServerEvent } from "@/features/analytics/server/track-event";
import type { BillingPlan } from "@/features/billing/server/provider-config";
import { prisma } from "@/lib/prisma";

type BillingPayloadMetadata = Record<
  string,
  string | number | boolean | null | undefined
>;

type BillingPayload = {
  type?: string;
  customerId?: string | null;
  externalCustomerId?: string | null;
  metadata?: BillingPayloadMetadata;
  data: {
    id?: string | null;
    status?: string | null;
    productId?: string | null;
    customerId?: string | null;
    externalCustomerId?: string | null;
    externalId?: string | null;
    metadata?: BillingPayloadMetadata;
    customer?: {
      id?: string | null;
      externalId?: string | null;
    } | null;
    currentPeriodEnd?: Date | string | null;
  };
};

function getStringValue(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function getPayloadUserId(payload: BillingPayload) {
  const externalId = getStringValue(
    payload.data.customer?.externalId ??
      payload.data.externalCustomerId ??
      payload.data.externalId ??
      payload.externalCustomerId,
  );

  if (externalId) {
    return externalId;
  }

  const metadataUserId =
    payload.data.metadata?.userId ?? payload.metadata?.userId;

  return getStringValue(metadataUserId);
}

function getPayloadCustomerId(payload: BillingPayload) {
  if (payload.type?.startsWith("customer.")) {
    return getStringValue(payload.data.id);
  }

  return getStringValue(
    payload.data.customer?.id ?? payload.customerId ?? payload.data.customerId,
  );
}

function getPayloadSubscriptionId(payload: BillingPayload) {
  const dataStatus = getStringValue(payload.data.status);

  if (dataStatus) {
    return getStringValue(payload.data.id);
  }

  return getStringValue(
    payload.data.metadata?.subscriptionId ?? payload.metadata?.subscriptionId,
  );
}

function getPayloadProductId(payload: BillingPayload) {
  return getStringValue(
    payload.data.productId ??
      payload.data.metadata?.productId ??
      payload.metadata?.productId,
  );
}

function getPayloadCurrentPeriodEnd(payload: BillingPayload) {
  const value = payload.data.currentPeriodEnd;

  if (value instanceof Date) {
    return value;
  }

  const dateValue = getStringValue(value);

  if (!dateValue) {
    return null;
  }

  const parsedDate = new Date(dateValue);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function getPayloadStatus(payload: BillingPayload) {
  return getStringValue(payload.data.status);
}

function getBillingUpdateData(payload: BillingPayload, plan: BillingPlan) {
  const data: Prisma.UserUpdateManyMutationInput = {
    billingProvider: "POLAR",
    billingSyncedAt: new Date(),
    plan,
  };

  const billingCustomerId = getPayloadCustomerId(payload);
  const billingSubscriptionId = getPayloadSubscriptionId(payload);
  const billingProductId = getPayloadProductId(payload);
  const billingSubscriptionStatus = getPayloadStatus(payload);

  if (billingCustomerId) {
    data.billingCustomerId = billingCustomerId;
  }

  if (billingSubscriptionId) {
    data.billingSubscriptionId = billingSubscriptionId;
  }

  if (billingProductId) {
    data.billingProductId = billingProductId;
  }

  if (billingSubscriptionStatus) {
    data.billingSubscriptionStatus = billingSubscriptionStatus;
  }

  const currentPeriodEnd = getPayloadCurrentPeriodEnd(payload);

  if (currentPeriodEnd) {
    data.billingCurrentPeriodEnd = currentPeriodEnd;
  }

  return data;
}

function getBillingLinkUpdateData(payload: BillingPayload) {
  const data: Prisma.UserUpdateManyMutationInput = {
    billingProvider: "POLAR",
    billingSyncedAt: new Date(),
  };

  const billingCustomerId = getPayloadCustomerId(payload);
  const billingSubscriptionId = getPayloadSubscriptionId(payload);
  const billingProductId = getPayloadProductId(payload);
  const billingSubscriptionStatus = getPayloadStatus(payload);

  if (billingCustomerId) {
    data.billingCustomerId = billingCustomerId;
  }

  if (billingSubscriptionId) {
    data.billingSubscriptionId = billingSubscriptionId;
  }

  if (billingProductId) {
    data.billingProductId = billingProductId;
  }

  if (billingSubscriptionStatus) {
    data.billingSubscriptionStatus = billingSubscriptionStatus;
  }

  const currentPeriodEnd = getPayloadCurrentPeriodEnd(payload);

  if (currentPeriodEnd) {
    data.billingCurrentPeriodEnd = currentPeriodEnd;
  }

  return data;
}

async function updateBillingStateForUser(
  payload: BillingPayload,
  data: Prisma.UserUpdateManyMutationInput,
) {
  const userId = getPayloadUserId(payload);

  if (!userId) {
    throw new Error("billing webhook payload missing user identifier");
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      plan: true,
    },
  });

  if (!currentUser) {
    throw new Error(`billing webhook user not found for id: ${userId}`);
  }

  await prisma.user.updateMany({
    where: {
      id: userId,
    },
    data,
  });

  if (data.plan === "PRO" && currentUser.plan !== "PRO") {
    await trackServerEvent({
      distinctId: userId,
      event: "checkout_success",
      properties: {
        billingProvider: "polar",
        plan: "PRO",
        sourceEvent: payload.type ?? "unknown",
      },
    });
  }
}

export async function syncUserPlanFromBillingPayload(
  payload: BillingPayload,
  plan: BillingPlan,
) {
  await updateBillingStateForUser(payload, getBillingUpdateData(payload, plan));
}

export async function syncBillingLinkageFromPayload(payload: BillingPayload) {
  await updateBillingStateForUser(payload, getBillingLinkUpdateData(payload));
}
