import "server-only";

import type { AuthenticatedAppUser } from "@/features/auth/server/session";
import { getBillingConfig, type BillingPlan } from "@/features/billing/server/provider-config";
import {
  getPolarCheckoutConfigError,
  getPolarCheckoutUrl,
} from "@/features/billing/server/polar";

type HostedCheckoutInput = {
  plan: Extract<BillingPlan, "PRO">;
  user: AuthenticatedAppUser;
};

export function getHostedCheckoutError() {
  const config = getBillingConfig();

  switch (config.provider) {
    case "polar":
      return getPolarCheckoutConfigError(config);
  }
}

export function getHostedCheckoutUrl(input: HostedCheckoutInput) {
  const config = getBillingConfig();

  switch (config.provider) {
    case "polar":
      void input;
      return getPolarCheckoutUrl();
  }
}
