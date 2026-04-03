"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

type PostHogIdentifyProps = {
  userId: string;
  email: string;
  name: string | null;
  plan: string;
};

export function PostHogIdentify({
  userId,
  email,
  name,
  plan,
}: PostHogIdentifyProps) {
  useEffect(() => {
    posthog.identify(userId, {
      email,
      name: name ?? undefined,
      plan,
    });
  }, [userId, email, name, plan]);

  return null;
}
