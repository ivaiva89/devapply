"use client";

import { useRouter } from "next/navigation";
import { useSyncExternalStore, type ReactNode } from "react";

import {
  TimezoneStep,
  type TimezoneConfirmResult,
} from "@/features/auth/ui/timezone-step";
import { setFirstTimezone } from "@/features/timezone/api/set-first-timezone";
import { returnPath } from "@/shared/lib/auth/return-path";
import { detectTimezone } from "@/shared/lib/timezone/detect";

interface TimezoneConfirmProps {
  // The page the visitor was on when the shell sent them here, if any.
  returnTo?: string;
}

// What the browser reported is known in the browser only. The server draws
// the UTC wording, and the browser settles it after hydration, so the two
// renders never differ.
function readIsUndetected(): boolean {
  return detectTimezone() === null;
}
function readServerIsUndetected(): boolean {
  return false;
}
function subscribeToNothing(): () => void {
  return () => {};
}

// The confirm step for a signed-in account with no timezone: saves the answer
// as the account's first timezone, then goes back to where the visitor was.
export function TimezoneConfirm({ returnTo }: TimezoneConfirmProps): ReactNode {
  const router = useRouter();
  const isUndetected = useSyncExternalStore(
    subscribeToNothing,
    readIsUndetected,
    readServerIsUndetected,
  );

  async function confirm(timezone: string): Promise<TimezoneConfirmResult> {
    let result: Awaited<ReturnType<typeof setFirstTimezone>>;
    try {
      result = await setFirstTimezone(timezone);
    } catch {
      // The save did not happen: the account keeps no timezone, and the step
      // can be answered again.
      return { status: "failed" };
    }
    if (!result.ok) return { status: "refused", message: result.error };
    // Replaces the step, so Back does not return to it.
    router.replace(returnPath(returnTo));
    return { status: "done" };
  }

  return <TimezoneStep onConfirm={confirm} isUndetected={isUndetected} />;
}
