"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

import { trackServerEvent } from "@/features/analytics/server/track-event";
import { requireCurrentUser } from "@/features/auth/server/session";
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
): Promise<CreateCheckoutSessionState> {
  void _prevState;
  const user = await requireCurrentUser();

  if (user.plan === "PRO") {
    return {
      status: "error",
      error: "Your account is already on the Pro plan.",
    };
  }

  const configurationError = getHostedCheckoutError();

  if (configurationError) {
    return {
      status: "error",
      error: configurationError,
    };
  }

  try {
    const checkoutUrl = getHostedCheckoutUrl({
      plan: "PRO",
      user,
    });

    await trackServerEvent({
      distinctId: user.id,
      event: "checkout_started",
      properties: {
        billingProvider: "polar",
        plan: "PRO",
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
