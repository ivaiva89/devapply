"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/ui/button";
import {
  createEditReminderValues,
  getUpdateReminderInitialState,
} from "@/features/reminders/reminder-edit";
import { getTimezoneOffsetMinutesForLocalInput } from "@/features/reminders/reminder-form";
import { ReminderEditDialogPresenter } from "@/features/reminders/components/reminder-edit-dialog-presenter";
import { updateReminder } from "@/features/reminders/server/update-reminder";
import type { ReminderApplicationOption } from "@/features/reminders/types";

type ReminderEditDialogProps = {
  applicationOptions: ReminderApplicationOption[];
  reminder: {
    applicationId?: string | null;
    id: string;
    notes?: string | null;
    remindAt: string;
    title: string;
  };
};

export function ReminderEditDialog({
  applicationOptions,
  reminder,
}: ReminderEditDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const initialValues = createEditReminderValues({
    applicationId: reminder.applicationId,
    notes: reminder.notes,
    remindAt: reminder.remindAt,
    title: reminder.title,
  });
  const updateAction = updateReminder.bind(null, reminder.id);
  const [state, formAction, isPending] = useActionState(
    updateAction,
    getUpdateReminderInitialState(initialValues),
  );
  const handleSuccess = useEffectEvent(() => {
    setIsOpen(false);
    startTransition(() => {
      router.refresh();
    });
  });

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    handleSuccess();
  }, [state.status]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const remindAtField = event.currentTarget.elements.namedItem("remindAt");
    const timezoneOffsetField = event.currentTarget.elements.namedItem(
      "timezoneOffsetMinutes",
    );

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

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
        Edit
      </Button>
      <ReminderEditDialogPresenter
        action={formAction}
        applicationOptions={applicationOptions}
        error={state.error}
        formRef={formRef}
        isOpen={isOpen}
        isPending={isPending}
        onCancel={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        values={state.values}
      />
    </>
  );
}
