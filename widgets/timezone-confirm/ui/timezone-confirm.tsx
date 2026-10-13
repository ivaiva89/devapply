"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { TimezoneStep } from "@/features/auth/ui/timezone-step";
import { setFirstTimezone } from "@/features/timezone/api/set-first-timezone";
import { returnPath } from "@/shared/lib/auth/return-path";

interface TimezoneConfirmProps {
  // The page the visitor was on when the shell sent them here, if any.
  returnTo?: string;
}

// The confirm step for a signed-in account with no timezone: saves the answer
// as the account's first timezone, then goes back to where the visitor was.
export function TimezoneConfirm({ returnTo }: TimezoneConfirmProps): ReactNode {
  const router = useRouter();

  async function confirm(timezone: string): Promise<string | undefined> {
    const result = await setFirstTimezone(timezone);
    if (!result.ok) return result.error;
    // Replaces the step, so Back does not return to it.
    router.replace(returnPath(returnTo));
    return undefined;
  }

  return <TimezoneStep onConfirm={confirm} />;
}
