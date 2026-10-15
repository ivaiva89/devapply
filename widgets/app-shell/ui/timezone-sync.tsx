"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { setFirstTimezone } from "@/features/timezone/api/set-first-timezone";
import { detectTimezone } from "@/shared/lib/timezone/detect";

interface TimezoneSyncProps {
  // The account's saved timezone, or null while it has none.
  timezone: string | null;
}

type SyncState =
  { status: "idle" } | { status: "failed" } | { status: "retrying" };

type SaveOutcome = "saved" | "refused" | "failed";

const SAVE_FAILED = "We couldn't save your timezone. Try again.";

// A refusal is the server's answer about the zone; a rejection is a save
// that did not happen.
async function saveFirstTimezone(timezone: string): Promise<SaveOutcome> {
  try {
    const result = await setFirstTimezone(timezone);
    return result.ok ? "saved" : "refused";
  } catch {
    return "failed";
  }
}

// Gives an account with no timezone its first one on a signed-in page. A valid
// browser zone other than UTC is saved without a question. UTC, or no usable
// zone, sends the visitor to the confirm step with this page as the way back.
// An account that has a timezone, `UTC` included, is left alone. A save that
// fails is tried once on each page, then only when Retry is pressed.
export function TimezoneSync({ timezone }: TimezoneSyncProps): ReactNode {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const [state, setState] = useState<SyncState>({ status: "idle" });
  // Each press of Retry asks the effect for one more attempt.
  const [attempt, setAttempt] = useState(0);
  // Saves still in flight, so a press of Retry never starts a second one.
  const inFlight = useRef(0);

  const askOnConfirmStep = useEffectEvent((): void => {
    const here = search ? `${pathname}?${search}` : pathname;
    // The step reads the same parameter the sign-in page does.
    router.replace(`/sign-up/timezone?returnTo=${encodeURIComponent(here)}`);
  });

  // Runs once on each page, and once more on each press of Retry.
  useEffect(() => {
    if (timezone !== null) return;

    const detected = detectTimezone();
    if (detected === null || detected === "UTC") {
      askOnConfirmStep();
      return;
    }

    let isCurrent = true;
    inFlight.current += 1;
    void saveFirstTimezone(detected).then((outcome) => {
      inFlight.current -= 1;
      // A page the visitor has left makes its own attempt.
      if (!isCurrent) return;
      if (outcome === "saved") setState({ status: "idle" });
      // No UTC is saved in its place, and nothing is tried again on its own.
      else if (outcome === "failed") setState({ status: "failed" });
      // A zone the browser knows and the server refuses is not dropped: it
      // counts as no detection, and the visitor is asked.
      else askOnConfirmStep();
    });
    return () => {
      isCurrent = false;
    };
  }, [timezone, pathname, search, attempt]);

  function handleRetry(): void {
    if (inFlight.current > 0) return;
    setState({ status: "retrying" });
    setAttempt((count) => count + 1);
  }

  if (state.status === "idle") return null;

  return (
    <div className="border-border bg-surface-1 rounded-card mb-6 flex items-center justify-between gap-4 border px-4 py-3">
      <p role="alert" className="text-danger text-[13px]">
        {SAVE_FAILED}
      </p>
      <button
        type="button"
        onClick={handleRetry}
        disabled={state.status === "retrying"}
        className="text-text border-border-strong rounded-button h-8 shrink-0 border px-3 text-[13px] font-medium disabled:opacity-60"
      >
        Retry
      </button>
    </div>
  );
}
