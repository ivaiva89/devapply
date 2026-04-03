import "server-only";

import type { CheckoutConfig, CustomerPortalConfig } from "@polar-sh/nextjs";

import type {
  BillingConfig,
  BillingEnvironment,
} from "@/features/billing/server/provider-config";

type CheckoutUser = {
  id: string;
  email: string;
  name: string | null;
};

type PolarCheckoutUrlInput = {
  user: CheckoutUser;
  plan: "PRO" | "LIFETIME";
};

function getCheckoutSuccessUrl(appUrl: string) {
  return `${appUrl}/settings?billing=success`;
}

function getCheckoutReturnUrl(appUrl: string) {
  return `${appUrl}/settings?billing=cancelled`;
}

function getPortalReturnUrl(appUrl: string) {
  return `${appUrl}/settings?billing=portal_return`;
}

function getPolarEnvironmentLabel(environment: BillingEnvironment) {
  return environment === "production" ? "production" : "sandbox";
}

export function getPolarCheckoutConfigError(config: BillingConfig) {
  if (!config.appUrl) {
    return "Could not determine the application URL for Polar checkout. Set NEXT_PUBLIC_APP_URL.";
  }

  if (!config.polar.accessToken || !config.polar.productIdPro) {
    return "Polar billing is not configured yet. Add POLAR_ACCESS_TOKEN and POLAR_PRODUCT_ID_PRO to enable upgrades.";
  }

  return null;
}

export function getPolarCheckoutHandlerConfig(
  config: BillingConfig,
): CheckoutConfig | null {
  const error = getPolarCheckoutConfigError(config);

  if (error || !config.appUrl || !config.polar.accessToken) {
    return null;
  }

  return {
    accessToken: config.polar.accessToken,
    successUrl: getCheckoutSuccessUrl(config.appUrl),
    returnUrl: getCheckoutReturnUrl(config.appUrl),
    server: getPolarEnvironmentLabel(config.polar.environment),
  };
}

export function getPolarPortalConfigError(config: BillingConfig) {
  if (!config.appUrl) {
    return "Could not determine the application URL for the billing portal. Set NEXT_PUBLIC_APP_URL.";
  }

  if (!config.polar.accessToken) {
    return "Polar billing portal is not configured yet. Add POLAR_ACCESS_TOKEN to enable access.";
  }

  return null;
}

export function getPolarPortalHandlerConfig(
  config: BillingConfig,
): Omit<
  CustomerPortalConfig,
  "getExternalCustomerId" | "getCustomerId"
> | null {
  const error = getPolarPortalConfigError(config);

  if (error || !config.appUrl || !config.polar.accessToken) {
    return null;
  }

  return {
    accessToken: config.polar.accessToken,
    returnUrl: getPortalReturnUrl(config.appUrl),
    server: getPolarEnvironmentLabel(config.polar.environment),
  };
}

export function getPolarCheckoutUrl() {
  return "/api/billing/checkout";
}

export function getPolarPortalUrl() {
  return "/api/billing/portal";
}

export function getPolarCheckoutSearchParams(
  config: BillingConfig,
  input: PolarCheckoutUrlInput,
) {
  const productId =
    input.plan === "LIFETIME"
      ? config.polar.productIdLifetime
      : config.polar.productIdPro;

  if (!productId) {
    throw new Error(`Polar ${input.plan} product is not configured.`);
  }

  const params = new URLSearchParams({
    products: productId,
    customerExternalId: input.user.id,
    customerEmail: input.user.email,
    metadata: JSON.stringify({
      plan: input.plan,
      userId: input.user.id,
    }),
  });

  if (input.user.name) {
    params.set("customerName", input.user.name);
  }

  return params;
}
