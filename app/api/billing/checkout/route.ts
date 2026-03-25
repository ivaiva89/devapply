import { Checkout } from "@polar-sh/nextjs";
import { NextRequest, NextResponse } from "next/server";

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
      return NextResponse.json(
        { error: "Unsupported billing provider." },
        { status: 500 },
      );
    }

    const checkoutConfig = getPolarCheckoutHandlerConfig(config);

    if (!checkoutConfig) {
      return NextResponse.json(
        { error: "Polar billing checkout is not configured." },
        { status: 500 },
      );
    }

    const checkoutUrl = request.nextUrl.clone();
    checkoutUrl.search = getPolarCheckoutSearchParams(config, {
      plan: "PRO",
      user,
    }).toString();

    const checkoutRequest = new NextRequest(checkoutUrl, request);

    return await Checkout(checkoutConfig)(checkoutRequest);
  } catch (error) {
    console.error("polar checkout route failed", error);

    if (
      error instanceof Error &&
      "statusCode" in error &&
      error.statusCode === 401
    ) {
      return NextResponse.json(
        {
          error:
            "Polar rejected the configured access token. Replace POLAR_ACCESS_TOKEN with a valid sandbox organization access token.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Polar checkout route failed.",
      },
      { status: 500 },
    );
  }
}
