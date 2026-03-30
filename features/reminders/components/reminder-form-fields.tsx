import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const selectInputClasses =
  "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30 dark:disabled:bg-input/80";

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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor={titleId} className="text-sm font-medium text-foreground">
          Title
        </label>
        <Input
          id={titleId}
          name="title"
          placeholder="Follow up with hiring manager"
          defaultValue={values.title}
          disabled={isDisabled || isPending}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor={remindAtId} className="text-sm font-medium text-foreground">
          Remind at
        </label>
        <Input
          id={remindAtId}
          name="remindAt"
          type="datetime-local"
          defaultValue={values.remindAt}
          disabled={isDisabled || isPending}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor={applicationId} className="text-sm font-medium text-foreground">
          Linked application
        </label>
        <select
          id={applicationId}
          name="applicationId"
          disabled={isDisabled || isPending}
          defaultValue={values.applicationId}
          className={selectInputClasses}
        >
          <option value="">No linked application</option>
          {applicationOptions.map((application) => (
            <option key={application.id} value={application.id}>
              {application.label}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={isDisabled || isPending}>
        {isPending ? submittingLabel : submitLabel}
      </Button>
    </div>
  );
}
