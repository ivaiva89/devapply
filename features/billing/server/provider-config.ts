import "server-only";

export type BillingProviderName = "polar";
export type BillingPlan = "FREE" | "PRO";
export type BillingEnvironment = "sandbox" | "production";

type PolarBillingConfig = {
  accessToken: string | null;
  environment: BillingEnvironment;
  productIdPro: string | null;
  webhookSecret: string | null;
};

export type BillingConfig = {
  provider: BillingProviderName;
  appUrl: string | null;
  polar: PolarBillingConfig;
};

function getOptionalEnv(name: string) {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : null;
}

function getBillingEnvironment(): BillingEnvironment {
  const value = process.env.POLAR_ENVIRONMENT?.trim().toLowerCase();
  return value === "production" ? "production" : "sandbox";
}

export function getBillingConfig(): BillingConfig {
  return {
    provider: "polar",
    appUrl: getOptionalEnv("NEXT_PUBLIC_APP_URL"),
    polar: {
      accessToken: getOptionalEnv("POLAR_ACCESS_TOKEN"),
      environment: getBillingEnvironment(),
      productIdPro: getOptionalEnv("POLAR_PRODUCT_ID_PRO"),
      webhookSecret: getOptionalEnv("POLAR_WEBHOOK_SECRET"),
    },
  };
}
