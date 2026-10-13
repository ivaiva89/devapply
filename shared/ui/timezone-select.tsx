"use client";

import { useId, useSyncExternalStore, type ReactNode } from "react";

interface TimezoneSelectProps {
  // The zone the picker shows.
  value: string;
  onChange: (timezone: string) => void;
  // The message to show under the picker when the zone was refused.
  error?: string;
}

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

// The timezone picker: its label, a select over the zones, the selected
// zone's offset and the field error. The caller holds the selected zone.
export function TimezoneSelect({
  value,
  onChange,
  error,
}: TimezoneSelectProps): ReactNode {
  const id = useId();
  const zones = useSyncExternalStore(
    subscribeToNothing,
    readRuntimeZones,
    readNoZones,
  );

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-text text-[13px] font-medium">
        Timezone
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="border-border-strong bg-surface-1 text-text aria-invalid:border-danger rounded-input h-[44px] w-full appearance-none border pr-[96px] pl-3 text-[14px] sm:h-[36px]"
        >
          {zoneOptions(zones, value).map((option) => (
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
          {utcOffset(value)}
        </span>
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-danger text-[12px]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
