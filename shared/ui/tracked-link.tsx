"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import { trackClientEvent } from "@/shared/lib/analytics/track-client";
import type {
  AnalyticsEventName,
  AnalyticsEventProperties,
} from "@/shared/lib/analytics/events";

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
