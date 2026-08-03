"use client";

import posthog from "posthog-js";

import type { AnalyticsEventName, AnalyticsEventProperties } from "./events";

type TrackClientEventInput = {
  distinctId?: string;
  event: AnalyticsEventName;
  properties?: AnalyticsEventProperties;
};

export function trackClientEvent({ event, properties }: TrackClientEventInput) {
  posthog.capture(event, properties);
}
