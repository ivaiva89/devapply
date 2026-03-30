"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { CreateReminderFormPresenter } from "@/features/reminders/components/create-reminder-form-presenter";
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
    <CreateReminderFormPresenter
      formRef={formRef}
      action={formAction}
      applicationOptions={applicationOptions}
      canCreate={canCreate}
      error={state.error}
      isPending={isPending}
    />
  );
}
