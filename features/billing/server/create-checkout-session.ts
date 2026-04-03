"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

import { trackServerEvent } from "@/features/analytics/server/track-event";
import { requireCurrentUser } from "@/features/auth/server/session";
import { hasUnlimitedAccess } from "@/features/billing/server/plan-enforcement";
import {
  getHostedCheckoutError,
  getHostedCheckoutUrl,
} from "@/features/billing/server/provider";

export type CreateCheckoutSessionState = {
  status: "idle" | "error";
  error?: string;
};

export async function createCheckoutSession(
  _prevState: CreateCheckoutSessionState,
  formData: FormData,
): Promise<CreateCheckoutSessionState> {
  void _prevState;
  const user = await requireCurrentUser();

  const planParam = formData.get("plan");
  const plan: "PRO" | "LIFETIME" =
    planParam === "LIFETIME" ? "LIFETIME" : "PRO";

  if (hasUnlimitedAccess(user.plan)) {
    return {
      status: "error",
      error: "Your account already has unlimited access.",
    };
  }

  const configurationError = getHostedCheckoutError(plan);

  if (configurationError) {
    return {
      status: "error",
      error: configurationError,
    };
  }

  try {
    const checkoutUrl = getHostedCheckoutUrl({ plan, user });

    await trackServerEvent({
      distinctId: user.id,
      event: "checkout_started",
      properties: {
        billingProvider: "polar",
        plan,
      },
    });

    redirect(checkoutUrl);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      status: "error",
      error: "Polar checkout could not be started. Try again.",
    };
  }
}
