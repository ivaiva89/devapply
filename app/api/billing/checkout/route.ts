import { Checkout } from "@polar-sh/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { trackServerEvent } from "@/features/analytics/server/track-event";
import { getCurrentUser } from "@/features/auth/server/session";
import { getBillingConfig } from "@/features/billing/server/provider-config";
import {
  getPolarCheckoutHandlerConfig,
  getPolarCheckoutSearchParams,
} from "@/features/billing/server/polar";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const config = getBillingConfig();

    if (config.provider !== "polar") {
      return NextResponse.redirect(
        new URL("/settings?billing=checkout_unavailable", request.url),
      );
    }

    const checkoutConfig = getPolarCheckoutHandlerConfig(config);

    if (!checkoutConfig) {
      return NextResponse.redirect(
        new URL("/settings?billing=checkout_unavailable", request.url),
      );
    }

    const planParam = request.nextUrl.searchParams.get("plan");
    const plan: "PRO" | "LIFETIME" =
      planParam === "LIFETIME" ? "LIFETIME" : "PRO";

    const checkoutUrl = request.nextUrl.clone();
    checkoutUrl.search = getPolarCheckoutSearchParams(config, {
      plan,
      user,
    }).toString();

    await trackServerEvent({
      distinctId: user.id,
      event: "checkout_started",
      properties: {
        billingProvider: "polar",
        plan,
      },
    });

    const checkoutRequest = new NextRequest(checkoutUrl, request);

    return await Checkout(checkoutConfig)(checkoutRequest);
  } catch (error) {
    console.error("polar checkout route failed", error);

    if (
      error instanceof Error &&
      "statusCode" in error &&
      error.statusCode === 401
    ) {
      return NextResponse.redirect(
        new URL("/settings?billing=checkout_unavailable", request.url),
      );
    }

    return NextResponse.redirect(
      new URL("/settings?billing=checkout_unavailable", request.url),
    );
  }
}
