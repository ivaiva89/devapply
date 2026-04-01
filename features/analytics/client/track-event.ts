"use client";

import type {
  AnalyticsEventName,
  AnalyticsEventProperties,
} from "@/features/analytics/events";

type TrackClientEventInput = {
  distinctId?: string;
  event: AnalyticsEventName;
  properties?: AnalyticsEventProperties;
};

const ANALYTICS_ANONYMOUS_ID_KEY = "devapply_analytics_anonymous_id";

function getAnonymousDistinctId() {
  const existingValue = window.localStorage.getItem(ANALYTICS_ANONYMOUS_ID_KEY);

  if (existingValue) {
    return existingValue;
  }

  const nextValue = window.crypto.randomUUID();
  window.localStorage.setItem(ANALYTICS_ANONYMOUS_ID_KEY, nextValue);

  return nextValue;
}

export function trackClientEvent({
  distinctId,
  event,
  properties,
}: TrackClientEventInput) {
  const payload = JSON.stringify({
    distinctId: distinctId ?? getAnonymousDistinctId(),
    event,
    properties: {
      ...properties,
      pathname: window.location.pathname,
    },
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      "/api/analytics",
      new Blob([payload], { type: "application/json" }),
    );

    return;
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
    keepalive: true,
  });
}
