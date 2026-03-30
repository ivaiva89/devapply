"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useEffectEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  createEditReminderValues,
  getUpdateReminderInitialState,
} from "@/features/reminders/reminder-edit";
import { ReminderEditDialogPresenter } from "@/features/reminders/components/reminder-edit-dialog-presenter";
import { updateReminder } from "@/features/reminders/server/update-reminder";
import type { ReminderApplicationOption } from "@/features/reminders/types";

type ReminderEditDialogProps = {
  applicationOptions: ReminderApplicationOption[];
  reminder: {
    applicationId?: string | null;
    id: string;
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
  const initialValues = createEditReminderValues({
    applicationId: reminder.applicationId,
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

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
        Edit
      </Button>
      <ReminderEditDialogPresenter
        action={formAction}
        applicationOptions={applicationOptions}
        error={state.error}
        isOpen={isOpen}
        isPending={isPending}
        onCancel={() => setIsOpen(false)}
        values={state.values}
      />
    </>
  );
}
