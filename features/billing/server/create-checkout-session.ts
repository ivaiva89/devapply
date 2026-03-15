"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Stripe from "stripe";

import { trackServerEvent } from "@/features/analytics/server/track-event";
import { requireCurrentUser } from "@/features/auth/server/session";

export type CreateCheckoutSessionState = {
  status: "idle" | "error";
  error?: string;
};

function getBaseUrlFromHeaders(headerStore: Headers) {
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? "https";

  if (!host) {
    return null;
  }

  return `${protocol}://${host}`;
}

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

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID_PRO;

  if (!secretKey || !priceId) {
    return {
      status: "error",
      error:
        "Stripe billing is not configured yet. Add STRIPE_SECRET_KEY and STRIPE_PRICE_ID_PRO to enable upgrades.",
    };
  }

  const headerStore = await headers();
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || getBaseUrlFromHeaders(headerStore);

  if (!baseUrl) {
    return {
      status: "error",
      error:
        "Could not determine the application URL for Stripe checkout. Set NEXT_PUBLIC_APP_URL.",
    };
  }

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/settings?billing=success`,
      cancel_url: `${baseUrl}/settings?billing=cancelled`,
      metadata: {
        userId: user.id,
      },
    });

    if (!session.url) {
      return {
        status: "error",
        error: "Stripe did not return a checkout URL.",
      };
    }

    await trackServerEvent({
      distinctId: user.id,
      event: "checkout_started",
      properties: {
        checkoutSessionId: session.id,
        plan: "PRO",
      },
    });

    redirect(session.url);
  } catch {
    return {
      status: "error",
      error: "Stripe checkout could not be started. Try again.",
    };
  }
}
