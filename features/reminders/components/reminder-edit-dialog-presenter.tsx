import type { ComponentProps } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReminderFormFields } from "@/features/reminders/components/reminder-form-fields";
import type {
  ReminderApplicationOption,
  ReminderFormValues,
} from "@/features/reminders/types";

type ReminderEditDialogPresenterProps = {
  action?: ComponentProps<"form">["action"];
  applicationOptions: ReminderApplicationOption[];
  error?: string;
  idPrefix?: string;
  isOpen: boolean;
  isPending?: boolean;
  onCancel?: () => void;
  values: ReminderFormValues;
};

export function ReminderEditDialogPresenter({
  action,
  applicationOptions,
  error,
  idPrefix = "edit-reminder",
  isOpen,
  isPending = false,
  onCancel,
  values,
}: ReminderEditDialogPresenterProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={
        onCancel
          ? (open) => (!open ? onCancel() : undefined)
          : undefined
      }
    >
      <DialogContent className="max-w-lg rounded-[2rem] p-6 sm:p-8">
        <DialogHeader>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Reminders
          </p>
          <DialogTitle className="text-2xl tracking-tight">
            Edit reminder
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm leading-6">
            Update the reminder title, due date, or linked application.
          </DialogDescription>
        </DialogHeader>

        <form action={action} className="space-y-5">
          <ReminderFormFields
            applicationOptions={applicationOptions}
            error={error}
            idPrefix={idPrefix}
            isPending={isPending}
            submitLabel="Save reminder"
            submittingLabel="Saving..."
            values={values}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
