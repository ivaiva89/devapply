import "server-only";

import type {
  AnalyticsEventName,
  AnalyticsEventProperties,
} from "@/features/analytics/events";

type TrackServerEventInput = {
  distinctId: string;
  event: AnalyticsEventName;
  properties?: AnalyticsEventProperties;
};

function getAnalyticsConfig() {
  const apiKey =
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ?? process.env.POSTHOG_KEY;

  if (!apiKey) {
    return null;
  }

  return {
    apiKey,
    host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST ??
      process.env.POSTHOG_HOST ??
      "https://us.i.posthog.com",
  };
}

export async function trackServerEvent({
  distinctId,
  event,
  properties,
}: TrackServerEventInput) {
  const config = getAnalyticsConfig();

  if (!config) {
    return;
  }

  try {
    await fetch(`${config.host}/capture/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: config.apiKey,
        event,
        distinct_id: distinctId,
        properties: {
          ...properties,
          $lib: "devapply-server",
        },
      }),
      cache: "no-store",
    });
  } catch (error) {
    console.error("Analytics capture failed.", error);
  }
}
