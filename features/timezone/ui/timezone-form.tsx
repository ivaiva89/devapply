"use client";

import { useState, type FormEvent, type ReactNode } from "react";

import { updateTimezone } from "@/features/timezone/api/update-timezone";
import { TimezoneSelect } from "@/shared/ui/timezone-select";

interface TimezoneFormProps {
  // The account's saved timezone, or null while it has none.
  timezone: string | null;
}

type SaveState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "refused"; message: string };

const UTC = "UTC";

// The Settings timezone section: the account's timezone in a picker, and Save.
export function TimezoneForm({ timezone }: TimezoneFormProps): ReactNode {
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
        <div className="w-full sm:max-w-[320px]">
          <TimezoneSelect value={zone} onChange={setPicked} error={error} />
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
