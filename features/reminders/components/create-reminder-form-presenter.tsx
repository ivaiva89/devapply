import type { ComponentProps, RefObject } from "react";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  createEmptyReminderFormValues,
  toReminderFormValues,
} from "@/features/reminders/reminder-form";
import { ReminderFormFields } from "@/features/reminders/components/reminder-form-fields";
import type { ReminderApplicationOption } from "@/features/reminders/types";

type CreateReminderFormPresenterProps = {
  action?: ComponentProps<"form">["action"];
  applicationOptions: ReminderApplicationOption[];
  canCreate: boolean;
  error?: string;
  formRef?: RefObject<HTMLFormElement | null>;
  idPrefix?: string;
  isPending?: boolean;
  onSubmit?: ComponentProps<"form">["onSubmit"];
};

export function CreateReminderFormPresenter({
  action,
  applicationOptions,
  canCreate,
  error,
  formRef,
  idPrefix = "create-reminder",
  isPending = false,
  onSubmit,
}: CreateReminderFormPresenterProps) {
  const values = canCreate
    ? createEmptyReminderFormValues()
    : toReminderFormValues({
        applicationId: "",
        remindAt: "",
        title: "",
      });

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={onSubmit}
      className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm"
    >
      <input type="hidden" name="timezoneOffsetMinutes" defaultValue="" />
      <CardHeader className="space-y-2 px-0">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          New reminder
        </p>
        <CardTitle className="text-xl tracking-tight">
          Schedule a follow-up
        </CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          Create reminders for outreach, status checks, or interview follow-ups.
        </p>
      </CardHeader>

      <CardContent className="mt-6 px-0">
        <ReminderFormFields
          applicationOptions={applicationOptions}
          error={error}
          idPrefix={idPrefix}
          isDisabled={!canCreate}
          isPending={isPending}
          submitLabel="Create reminder"
          submittingLabel="Saving..."
          values={values}
        />
      </CardContent>
    </form>
  );
}
