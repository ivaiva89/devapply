"use client";

import { useState, type FormEvent, type ReactNode } from "react";

import { TimezoneSelect } from "@/shared/ui/timezone-select";

interface TimezoneStepProps {
  // Saves the answer: the picked zone on Continue, `UTC` on Keep UTC. Resolves
  // to the message to show next to the picker when the zone was refused, and
  // to nothing when the caller moves on from here.
  onConfirm: (timezone: string) => Promise<string | undefined>;
}

type StepState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "refused"; message: string };

const UTC = "UTC";

// Asked when the browser reports UTC or no usable zone: the visitor picks a
// zone and continues, or keeps UTC. Nothing is saved until one of the two
// buttons is pressed.
export function TimezoneStep({ onConfirm }: TimezoneStepProps): ReactNode {
  const [zone, setZone] = useState(UTC);
  const [state, setState] = useState<StepState>({ status: "idle" });

  const isSaving = state.status === "saving";
  const error = state.status === "refused" ? state.message : undefined;

  async function confirm(timezone: string): Promise<void> {
    // A second press while the first is in flight sends nothing.
    if (isSaving) return;
    setState({ status: "saving" });
    const refused = await onConfirm(timezone);
    // Saved: the caller moves on, and the buttons stay off until it has.
    if (refused === undefined) return;
    setState({ status: "refused", message: refused });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void confirm(zone);
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col">
      <h1 className="text-text text-[22px] font-semibold tracking-[-0.015em]">
        Confirm your timezone
      </h1>
      <p className="text-text-2 mt-1 mb-6 text-[14px]">
        Your browser reports UTC. Every date in DevApply is shown in the
        timezone you pick here, and you can change it later in Settings.
      </p>
      <TimezoneSelect value={zone} onChange={setZone} error={error} />
      <button
        type="submit"
        disabled={isSaving}
        className="bg-text text-canvas rounded-button mt-4 h-[44px] text-[14px] font-medium hover:opacity-90 disabled:opacity-60 sm:h-[36px]"
      >
        Continue
      </button>
      <button
        type="button"
        disabled={isSaving}
        onClick={() => void confirm(UTC)}
        className="text-text-2 hover:text-text rounded-button mt-2 h-[44px] text-[14px] font-medium disabled:opacity-60 sm:h-[36px]"
      >
        Keep UTC
      </button>
    </form>
  );
}
