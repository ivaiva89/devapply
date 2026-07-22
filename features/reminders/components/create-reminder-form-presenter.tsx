import type { ComponentProps, RefObject } from "react";

import { CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { createEmptyReminderFormValues } from "@/features/reminders/reminder-form";
import { ReminderFormFields } from "@/features/reminders/components/reminder-form-fields";
import type { ReminderApplicationOption } from "@/features/reminders/types";

type CreateReminderFormPresenterProps = {
  action?: ComponentProps<"form">["action"];
  applicationOptions: ReminderApplicationOption[];
  error?: string;
  formRef?: RefObject<HTMLFormElement | null>;
  idPrefix?: string;
  isPending?: boolean;
  onSubmit?: ComponentProps<"form">["onSubmit"];
};

export function CreateReminderFormPresenter({
  action,
  applicationOptions,
  error,
  formRef,
  idPrefix = "create-reminder",
  isPending = false,
  onSubmit,
}: CreateReminderFormPresenterProps) {
  const values = createEmptyReminderFormValues();

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={onSubmit}
      className="rounded-3xl border border-border/70 bg-surface p-6 shadow-sm"
    >
      <input type="hidden" name="timezoneOffsetMinutes" defaultValue="" />
      <CardHeader className="space-y-2 px-0">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-3">
          New reminder
        </p>
        <CardTitle className="text-xl tracking-tight">
          Schedule a follow-up
        </CardTitle>
        <p className="text-sm leading-6 text-text-3">
          Create reminders for outreach, status checks, or interview follow-ups.
        </p>
      </CardHeader>

      <CardContent className="mt-6 px-0">
        <ReminderFormFields
          applicationOptions={applicationOptions}
          error={error}
          idPrefix={idPrefix}
          isPending={isPending}
          submitLabel="Create reminder"
          submittingLabel="Saving..."
          values={values}
        />
      </CardContent>
    </form>
  );
}
