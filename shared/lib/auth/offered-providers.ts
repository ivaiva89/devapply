import "server-only";

import { env } from "@/shared/config/server-env";

export type SocialProvider = "github" | "google";

export interface ProviderCredentials {
  clientId: string;
  clientSecret: string;
}

// The order the buttons are shown in.
const PROVIDERS: SocialProvider[] = ["github", "google"];

// A provider counts only with both of its values: an id without its secret,
// or a secret without its id, is no provider.
function pair(
  clientId: string | undefined,
  clientSecret: string | undefined,
): ProviderCredentials | undefined {
  return clientId && clientSecret ? { clientId, clientSecret } : undefined;
}

// Each provider this environment has both values for, with those values. For
// the auth server only: the values never leave the server.
export function providerCredentials(): Partial<
  Record<SocialProvider, ProviderCredentials>
> {
  const github = pair(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET);
  const google = pair(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET);
  return { ...(github && { github }), ...(google && { google }) };
}

// The names of those providers and nothing else: what a page may pass to the
// browser.
export function offeredProviders(): SocialProvider[] {
  const configured = providerCredentials();
  return PROVIDERS.filter((provider) => configured[provider] !== undefined);
}
