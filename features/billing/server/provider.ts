import "server-only";

import type { AuthenticatedAppUser } from "@/features/auth/server/session";
import { getBillingConfig } from "@/features/billing/server/provider-config";
import {
  getPolarCheckoutConfigError,
  getPolarCheckoutUrl,
  getPolarPortalConfigError,
  getPolarPortalUrl,
} from "@/features/billing/server/polar";

type HostedCheckoutInput = {
  plan: "PRO" | "LIFETIME";
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
      return `${getPolarCheckoutUrl()}?plan=${input.plan}`;
  }
}

export function getCustomerPortalError() {
  const config = getBillingConfig();

  switch (config.provider) {
    case "polar":
      return getPolarPortalConfigError(config);
  }
}

export function getCustomerPortalUrl() {
  const config = getBillingConfig();

  switch (config.provider) {
    case "polar":
      return getPolarPortalUrl();
  }
}
