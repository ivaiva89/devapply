"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { setFirstTimezone } from "@/features/timezone/api/set-first-timezone";
import { detectTimezone } from "@/shared/lib/timezone/detect";

interface TimezoneSyncProps {
  // The account's saved timezone, or null while it has none.
  timezone: string | null;
}

// Gives an account with no timezone its first one on a signed-in page. A valid
// browser zone other than UTC is saved without a question. UTC, or no usable
// zone, sends the visitor to the confirm step with this page as the way back.
// An account that has a timezone, `UTC` included, is left alone. Renders
// nothing.
export function TimezoneSync({ timezone }: TimezoneSyncProps): ReactNode {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams().toString();

  useEffect(() => {
    if (timezone !== null) return;

    function askOnConfirmStep(): void {
      const here = search ? `${pathname}?${search}` : pathname;
      // The step reads the same parameter the sign-in page does.
      router.replace(`/sign-up/timezone?returnTo=${encodeURIComponent(here)}`);
    }

    const detected = detectTimezone();
    if (detected === null || detected === "UTC") {
      askOnConfirmStep();
      return;
    }
    // A zone the browser knows and the server refuses is not dropped: it
    // counts as no detection, and the visitor is asked.
    void setFirstTimezone(detected).then((result) => {
      if (!result.ok) askOnConfirmStep();
    });
  }, [timezone, pathname, search, router]);

  return null;
}
