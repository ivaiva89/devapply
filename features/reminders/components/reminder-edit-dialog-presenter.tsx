import type { ComponentProps, RefObject } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { ReminderFormFields } from "@/features/reminders/components/reminder-form-fields";
import type {
  ReminderApplicationOption,
  ReminderFormValues,
} from "@/features/reminders/types";

type ReminderEditDialogPresenterProps = {
  action?: ComponentProps<"form">["action"];
  applicationOptions: ReminderApplicationOption[];
  error?: string;
  formRef?: RefObject<HTMLFormElement | null>;
  idPrefix?: string;
  isOpen: boolean;
  isPending?: boolean;
  onCancel?: () => void;
  onSubmit?: ComponentProps<"form">["onSubmit"];
  values: ReminderFormValues;
};

export function ReminderEditDialogPresenter({
  action,
  applicationOptions,
  error,
  formRef,
  idPrefix = "edit-reminder",
  isOpen,
  isPending = false,
  onCancel,
  onSubmit,
  values,
}: ReminderEditDialogPresenterProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={
        onCancel ? (open) => (!open ? onCancel() : undefined) : undefined
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

        <form
          ref={formRef}
          action={action}
          onSubmit={onSubmit}
          className="space-y-5"
        >
          <input type="hidden" name="timezoneOffsetMinutes" defaultValue="" />
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
