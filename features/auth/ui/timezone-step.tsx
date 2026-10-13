"use client";

import {
  useId,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type ReactNode,
} from "react";

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

const NO_ZONES: string[] = [];
let runtimeZones: string[] | undefined;

// The zones this runtime knows. The server's list and the browser's differ,
// so the server renders none and the browser fills its own in after
// hydration.
function readRuntimeZones(): string[] {
  runtimeZones ??= Intl.supportedValuesOf("timeZone");
  return runtimeZones;
}
function readNoZones(): string[] {
  return NO_ZONES;
}
function subscribeToNothing(): () => void {
  return () => {};
}

// The picker's options: the runtime's zones, with `UTC` and the selected zone
// always among them.
function zoneOptions(zones: string[], selected: string): string[] {
  return [...new Set([UTC, selected, ...zones])].sort();
}

// The zone's offset from UTC right now, as the design writes it: "UTC+02:00".
function utcOffset(zone: string): string {
  const offset = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    timeZoneName: "longOffset",
  })
    .formatToParts(new Date())
    .find((part) => part.type === "timeZoneName")?.value;
  const hours = offset?.replace("GMT", "") ?? "";
  return `${UTC}${hours === "" ? "+00:00" : hours}`;
}

// Asked when the browser reports UTC or no usable zone: the visitor picks a
// zone and continues, or keeps UTC. Nothing is saved until one of the two
// buttons is pressed.
export function TimezoneStep({ onConfirm }: TimezoneStepProps): ReactNode {
  const id = useId();
  const zones = useSyncExternalStore(
    subscribeToNothing,
    readRuntimeZones,
    readNoZones,
  );
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
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-text text-[13px] font-medium">
          Timezone
        </label>
        <div className="relative">
          <select
            id={id}
            value={zone}
            onChange={(event) => setZone(event.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            className="border-border-strong bg-surface-1 text-text aria-invalid:border-danger rounded-input h-[44px] w-full appearance-none border pr-[96px] pl-3 text-[14px] sm:h-[36px]"
          >
            {zoneOptions(zones, zone).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {/* The offset is read from each runtime's own zone data. */}
          <span
            suppressHydrationWarning
            className="text-text-3 pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-[12px]"
          >
            {utcOffset(zone)}
          </span>
        </div>
        {error ? (
          <p
            id={`${id}-error`}
            role="alert"
            className="text-danger text-[12px]"
          >
            {error}
          </p>
        ) : null}
      </div>
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
