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

  async function syncProAccess(payload: { data: { productId?: string | null } }) {
    if (proProductId && payload.data.productId && payload.data.productId !== proProductId) {
      return;
    }

    await syncUserPlanFromBillingPayload(payload, "PRO");
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
      await syncBillingLinkageFromPayload(payload);
    },
    onSubscriptionUpdated: async (payload) => {
      await syncBillingLinkageFromPayload(payload);
    },
    onSubscriptionCanceled: async (payload) => {
      await syncBillingLinkageFromPayload(payload);
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
