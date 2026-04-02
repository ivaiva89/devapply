"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useEffectEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/ui/button";
import { ReminderDeleteDialogPresenter } from "@/features/reminders/components/reminder-delete-dialog-presenter";
import { getDeleteReminderInitialState } from "@/features/reminders/reminder-delete";
import { deleteReminder } from "@/features/reminders/server/delete-reminder";

type ReminderDeleteDialogProps = {
  reminderId: string;
  title: string;
};

export function ReminderDeleteDialog({
  reminderId,
  title,
}: ReminderDeleteDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const deleteAction = deleteReminder.bind(null, reminderId);
  const [state, formAction, isPending] = useActionState(
    deleteAction,
    getDeleteReminderInitialState(),
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
        Delete
      </Button>
      <ReminderDeleteDialogPresenter
        action={formAction}
        error={state.error}
        isOpen={isOpen}
        isPending={isPending}
        onCancel={() => setIsOpen(false)}
        title={title}
      />
    </>
  );
}
