import { Webhooks } from "@polar-sh/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { getBillingConfig } from "@/features/billing/server/provider-config";
import {
  syncBillingLinkageFromPayload,
  syncUserPlanFromBillingPayload,
} from "@/features/billing/server/subscription-sync";

export async function POST(request: NextRequest) {
  const config = getBillingConfig();
  const webhookSecret = config.polar.webhookSecret;
  const proProductId = config.polar.productIdPro;

  if (!webhookSecret) {
    return NextResponse.json(
      {
        error:
          "Polar webhook handling is not configured. Add POLAR_WEBHOOK_SECRET.",
      },
      { status: 500 },
    );
  }

  function isProProductPayload(payload: { data: { productId?: string | null } }) {
    if (proProductId && payload.data.productId && payload.data.productId !== proProductId) {
      return false;
    }

    return true;
  }

  async function syncProAccess(payload: { data: { productId?: string | null } }) {
    if (!isProProductPayload(payload)) {
      return;
    }

    await syncUserPlanFromBillingPayload(payload, "PRO");
  }

  function shouldPromoteSubscriptionStatus(status?: string | null) {
    return status === "active" || status === "trialing";
  }

  async function syncSubscriptionState(
    payload: {
      data: {
        productId?: string | null;
        status?: string | null;
      };
    },
  ) {
    if (!isProProductPayload(payload)) {
      return;
    }

    await syncBillingLinkageFromPayload(payload);

    if (shouldPromoteSubscriptionStatus(payload.data.status)) {
      await syncUserPlanFromBillingPayload(payload, "PRO");
    }
  }

  return Webhooks({
    webhookSecret,
    onOrderPaid: async (payload) => {
      await syncProAccess(payload);
    },
    onSubscriptionActive: async (payload) => {
      await syncProAccess(payload);
    },
    onSubscriptionCreated: async (payload) => {
      await syncSubscriptionState(payload);
    },
    onSubscriptionUpdated: async (payload) => {
      await syncSubscriptionState(payload);
    },
    onSubscriptionCanceled: async (payload) => {
      await syncSubscriptionState(payload);
    },
    onSubscriptionUncanceled: async (payload) => {
      await syncProAccess(payload);
    },
    onSubscriptionRevoked: async (payload) => {
      await syncUserPlanFromBillingPayload(payload, "FREE");
    },
    onCustomerCreated: async (payload) => {
      await syncBillingLinkageFromPayload(payload);
    },
    onCustomerUpdated: async (payload) => {
      await syncBillingLinkageFromPayload(payload);
    },
  })(request);
}
