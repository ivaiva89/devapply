"use client";

import {
  useId,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type ReactNode,
} from "react";

import { updateTimezone } from "@/features/timezone/api/update-timezone";

interface TimezoneFormProps {
  // The account's saved timezone, or null while it has none.
  timezone: string | null;
}

type SaveState =
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
// always among them. A saved zone can be valid and still missing from the
// runtime's list, as one of Asia/Kolkata and Asia/Calcutta always is.
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

// The Settings timezone section: the account's timezone in a picker, and Save.
export function TimezoneForm({ timezone }: TimezoneFormProps): ReactNode {
  const id = useId();
  const zones = useSyncExternalStore(
    subscribeToNothing,
    readRuntimeZones,
    readNoZones,
  );
  // What the user picked since the page loaded, if anything. Until then the
  // picker follows the saved timezone, and shows UTC while there is none:
  // the zone dates are shown in until one is saved.
  const [picked, setPicked] = useState<string | null>(null);
  const [state, setState] = useState<SaveState>({ status: "idle" });

  const zone = picked ?? timezone ?? UTC;
  const isSaving = state.status === "saving";
  const error = state.status === "refused" ? state.message : undefined;

  async function save(): Promise<void> {
    setState({ status: "saving" });
    const result = await updateTimezone(zone);
    setState(
      result.ok
        ? { status: "idle" }
        : { status: "refused", message: result.error },
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    // A second press while the first is in flight sends nothing.
    if (isSaving) return;
    void save();
  }

  return (
    <section className="border-border bg-surface rounded-card border p-5">
      <h2 className="text-text text-[16px] font-semibold tracking-[-0.01em]">
        Timezone
      </h2>
      <form
        noValidate
        onSubmit={handleSubmit}
        className="mt-3 flex flex-col items-start gap-4"
      >
        <div className="flex w-full flex-col gap-1.5 sm:max-w-[320px]">
          <label htmlFor={id} className="text-text text-[13px] font-medium">
            Timezone
          </label>
          <div className="relative">
            <select
              id={id}
              value={zone}
              onChange={(event) => setPicked(event.target.value)}
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
        <p className="text-text-2 text-[13px]">
          Every date in DevApply is shown in this timezone. Changing it
          doesn&apos;t change any stored time.
        </p>
        <button
          type="submit"
          disabled={isSaving}
          className="bg-text text-canvas rounded-button h-[44px] px-3 text-[14px] font-medium hover:opacity-90 disabled:opacity-60 sm:h-[36px]"
        >
          Save
        </button>
      </form>
    </section>
  );
}
