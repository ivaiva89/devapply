import { CustomerPortal } from "@polar-sh/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/features/auth/server/session";
import { getBillingConfig } from "@/features/billing/server/provider-config";
import { getPolarPortalHandlerConfig } from "@/features/billing/server/polar";

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

    const portalConfig = getPolarPortalHandlerConfig(config);

    if (!portalConfig) {
      return NextResponse.json(
        { error: "Polar billing portal is not configured." },
        { status: 500 },
      );
    }

    const response = await CustomerPortal({
      ...portalConfig,
      getExternalCustomerId: async () => user.id,
    })(request);

    if (response.headers.get("location")) {
      return response;
    }

    console.error("polar customer portal route failed", {
      status: response.status,
    });

    return NextResponse.redirect(
      new URL("/settings?billing=portal_unavailable", request.url),
    );
  } catch (error) {
    console.error("polar customer portal route failed", error);

    return NextResponse.redirect(
      new URL("/settings?billing=portal_unavailable", request.url),
    );
  }
}
