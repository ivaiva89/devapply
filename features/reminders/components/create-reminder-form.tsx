"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

import { CreateReminderFormPresenter } from "@/features/reminders/components/create-reminder-form-presenter";
import { getTimezoneOffsetMinutesForLocalInput } from "@/features/reminders/reminder-form";
import { createReminder } from "@/features/reminders/server/create-reminder";
import type { CreateReminderActionState, ReminderApplicationOption } from "@/features/reminders/types";

type CreateReminderFormProps = {
  applicationOptions: ReminderApplicationOption[];
  canCreate: boolean;
};

const initialState: CreateReminderActionState = {
  status: "idle",
};

function syncReminderTimezoneOffset(form: HTMLFormElement) {
  const remindAtField = form.elements.namedItem("remindAt");
  const timezoneOffsetField = form.elements.namedItem("timezoneOffsetMinutes");

  if (
    !(remindAtField instanceof HTMLInputElement) ||
    !(timezoneOffsetField instanceof HTMLInputElement)
  ) {
    return;
  }

  const offset = getTimezoneOffsetMinutesForLocalInput(remindAtField.value);

  timezoneOffsetField.value =
    offset === null ? String(new Date().getTimezoneOffset()) : String(offset);
}

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    syncReminderTimezoneOffset(event.currentTarget);
  }

  return (
    <CreateReminderFormPresenter
      formRef={formRef}
      action={formAction}
      applicationOptions={applicationOptions}
      canCreate={canCreate}
      error={state.error}
      isPending={isPending}
      onSubmit={handleSubmit}
    />
  );
}
