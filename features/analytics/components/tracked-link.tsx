"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import { trackClientEvent } from "@/features/analytics/client/track-event";
import type {
  AnalyticsEventName,
  AnalyticsEventProperties,
} from "@/features/analytics/events";

type TrackedLinkProps = {
  children: ReactNode;
  className?: string;
  event: AnalyticsEventName;
  href: string;
  properties?: AnalyticsEventProperties;
};

export function TrackedLink({
  children,
  className,
  event,
  href,
  properties,
}: TrackedLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        trackClientEvent({
          event,
          properties,
        });
      }}
    >
      {children}
    </Link>
  );
}
