import { Button } from "@/shared/ui/button";
import {
  FieldShell,
  FormErrorMessage,
  getFieldDescribedBy,
} from "@/shared/ui/field";
import {
  compactControlClassName,
  nativePickerAffordanceClassName,
} from "@/shared/ui/form-controls";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import type {
  ReminderApplicationOption,
  ReminderFormValues,
} from "@/features/reminders/types";

type ReminderFormFieldsProps = {
  applicationOptions: ReminderApplicationOption[];
  error?: string;
  idPrefix: string;
  isDisabled?: boolean;
  isPending?: boolean;
  submitLabel: string;
  submittingLabel: string;
  values: ReminderFormValues;
};

export function ReminderFormFields({
  applicationOptions,
  error,
  idPrefix,
  isDisabled = false,
  isPending = false,
  submitLabel,
  submittingLabel,
  values,
}: ReminderFormFieldsProps) {
  const titleId = `${idPrefix}-title`;
  const remindAtId = `${idPrefix}-remind-at`;
  const applicationId = `${idPrefix}-application-id`;
  const notesId = `${idPrefix}-notes`;

  return (
    <div className="space-y-4">
      <FieldShell htmlFor={titleId} label="Title">
        <Input
          id={titleId}
          name="title"
          placeholder="Follow up with hiring manager"
          defaultValue={values.title}
          disabled={isDisabled || isPending}
          required
        />
      </FieldShell>

      <FieldShell
        description="Uses your local time and will be saved consistently for reminders."
        htmlFor={remindAtId}
        label="Remind at"
      >
        <Input
          id={remindAtId}
          name="remindAt"
          type="datetime-local"
          defaultValue={values.remindAt}
          aria-describedby={getFieldDescribedBy(remindAtId, {
            description:
              "Uses your local time and will be saved consistently for reminders.",
          })}
          disabled={isDisabled || isPending}
          required
          className={`${compactControlClassName} ${nativePickerAffordanceClassName}`}
        />
      </FieldShell>

      <FieldShell htmlFor={applicationId} label="Linked application">
        <Select
          items={[
            { value: "", label: "No linked application" },
            ...applicationOptions.map((application) => ({
              value: application.id,
              label: application.label,
            })),
          ]}
          name="applicationId"
          disabled={isDisabled || isPending}
          defaultValue={values.applicationId}
        >
          <SelectTrigger
            id={applicationId}
            className={compactControlClassName}
          >
            <SelectValue placeholder="No linked application" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No linked application</SelectItem>
            {applicationOptions.map((application) => (
              <SelectItem key={application.id} value={application.id}>
                {application.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldShell>

      <FieldShell
        htmlFor={notesId}
        label={
          <>
            Notes{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </>
        }
      >
        <Textarea
          id={notesId}
          name="notes"
          placeholder="Any context, links, or follow-up details"
          defaultValue={values.notes}
          disabled={isDisabled || isPending}
          rows={3}
          className="resize-none"
        />
      </FieldShell>

      {error ? (
        <FormErrorMessage>
          {error}
        </FormErrorMessage>
      ) : null}

      <Button type="submit" disabled={isDisabled || isPending}>
        {isPending ? submittingLabel : submitLabel}
      </Button>
    </div>
  );
}
