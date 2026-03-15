"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { createReminder } from "@/features/reminders/server/create-reminder";
import type { CreateReminderActionState, ReminderApplicationOption } from "@/features/reminders/types";

type CreateReminderFormProps = {
  applicationOptions: ReminderApplicationOption[];
  canCreate: boolean;
};

const initialState: CreateReminderActionState = {
  status: "idle",
};

export function CreateReminderForm({
  applicationOptions,
  canCreate,
}: CreateReminderFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    createReminder,
    initialState,
  );

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    formRef.current?.reset();
    startTransition(() => {
      router.refresh();
    });
  }, [router, state.status]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm"
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
          New reminder
        </p>
        <h2 className="text-xl font-semibold tracking-tight text-stone-950">
          Schedule a follow-up
        </h2>
        <p className="text-sm leading-6 text-stone-600">
          Create reminders for outreach, status checks, or interview follow-ups.
        </p>
      </div>
      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-stone-700">
            Title
          </label>
          <input
            id="title"
            name="title"
            placeholder="Follow up with hiring manager"
            disabled={!canCreate || isPending}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950 disabled:cursor-not-allowed disabled:bg-stone-100"
            required
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="remindAt"
            className="text-sm font-medium text-stone-700"
          >
            Remind at
          </label>
          <input
            id="remindAt"
            name="remindAt"
            type="datetime-local"
            disabled={!canCreate || isPending}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950 disabled:cursor-not-allowed disabled:bg-stone-100"
            required
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="applicationId"
            className="text-sm font-medium text-stone-700"
          >
            Linked application
          </label>
          <select
            id="applicationId"
            name="applicationId"
            disabled={isPending}
            defaultValue=""
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950 disabled:cursor-not-allowed disabled:bg-stone-100"
          >
            <option value="">No linked application</option>
            {applicationOptions.map((application) => (
              <option key={application.id} value={application.id}>
                {application.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {state.error ? (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={!canCreate || isPending}
        className="mt-6 rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
      >
        {isPending ? "Saving..." : "Create reminder"}
      </button>
    </form>
  );
}
