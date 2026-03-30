import type { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  applicationFormStatusOptions,
  applicationSourceOptions,
} from "@/features/applications/config";
import type {
  CreateApplicationActionState,
  CreateApplicationFormValues,
} from "@/features/applications/create-application-form";

type ApplicationFormModalPresenterProps = {
  action?: ComponentProps<"form">["action"];
  description: string;
  idPrefix?: string;
  isOpen: boolean;
  isPending?: boolean;
  onCancel: () => void;
  state: CreateApplicationActionState;
  submitLabel: string;
  submittingLabel: string;
  title: string;
};

type FormFieldProps = {
  children: ReactNode;
  error?: string;
  htmlFor: string;
  label: string;
};

type TextInputFieldProps = Omit<ComponentProps<"input">, "className" | "id"> & {
  error?: string;
  id: string;
};

const baseInputClassName =
  "h-8 w-full rounded-lg border bg-transparent px-2.5 py-1 text-sm text-foreground outline-none transition-colors";

function getInputClassName(error?: string) {
  return `${baseInputClassName} ${
    error
      ? "border-destructive/50 focus-visible:border-destructive focus-visible:ring-3 focus-visible:ring-destructive/20"
      : "border-input focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
  }`;
}

function FormField({ children, error, htmlFor, label }: FormFieldProps) {
  const errorId = `${htmlFor}-error`;

  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error ? (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function TextInputField({ error, ...props }: TextInputFieldProps) {
  const errorId = `${props.id}-error`;

  return (
    <Input
      {...props}
      aria-describedby={error ? errorId : undefined}
      aria-invalid={Boolean(error)}
      className={getInputClassName(error)}
    />
  );
}

function renderSelectOptions(
  options: ReadonlyArray<{ label: string; value: string }>,
) {
  return options.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ));
}

export function ApplicationFormModalPresenter({
  action,
  description,
  idPrefix = "application-form",
  isOpen,
  isPending = false,
  onCancel,
  state,
  submitLabel,
  submittingLabel,
  title,
}: ApplicationFormModalPresenterProps) {
  const formValues: CreateApplicationFormValues = state.values;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onCancel() : undefined)}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-[2rem] p-6 sm:p-8">
        <DialogHeader>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Applications
          </p>
          <DialogTitle className="text-2xl tracking-tight">{title}</DialogTitle>
          <DialogDescription className="mt-1 text-sm leading-6">
            {description}
          </DialogDescription>
        </DialogHeader>

        <form action={action} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              error={state.fieldErrors.company}
              htmlFor={`${idPrefix}-company`}
              label="Company"
            >
              <TextInputField
                id={`${idPrefix}-company`}
                name="company"
                defaultValue={formValues.company}
                error={state.fieldErrors.company}
                placeholder="Linear"
                autoComplete="organization"
                required
              />
            </FormField>

            <FormField
              error={state.fieldErrors.role}
              htmlFor={`${idPrefix}-role`}
              label="Role"
            >
              <TextInputField
                id={`${idPrefix}-role`}
                name="role"
                defaultValue={formValues.role}
                error={state.fieldErrors.role}
                placeholder="Senior Frontend Engineer"
                autoComplete="organization-title"
                required
              />
            </FormField>

            <FormField
              error={state.fieldErrors.location}
              htmlFor={`${idPrefix}-location`}
              label="Location"
            >
              <TextInputField
                id={`${idPrefix}-location`}
                name="location"
                defaultValue={formValues.location}
                error={state.fieldErrors.location}
                placeholder="Remote, US"
              />
            </FormField>

            <FormField
              error={state.fieldErrors.source}
              htmlFor={`${idPrefix}-source`}
              label="Source"
            >
              <select
                id={`${idPrefix}-source`}
                name="source"
                defaultValue={formValues.source}
                aria-describedby={
                  state.fieldErrors.source ? `${idPrefix}-source-error` : undefined
                }
                aria-invalid={Boolean(state.fieldErrors.source)}
                className={getInputClassName(state.fieldErrors.source)}
              >
                {renderSelectOptions(applicationSourceOptions)}
              </select>
            </FormField>

            <FormField
              error={state.fieldErrors.status}
              htmlFor={`${idPrefix}-status`}
              label="Status"
            >
              <select
                id={`${idPrefix}-status`}
                name="status"
                defaultValue={formValues.status}
                aria-describedby={
                  state.fieldErrors.status ? `${idPrefix}-status-error` : undefined
                }
                aria-invalid={Boolean(state.fieldErrors.status)}
                className={getInputClassName(state.fieldErrors.status)}
              >
                {renderSelectOptions(applicationFormStatusOptions)}
              </select>
            </FormField>

            <FormField
              error={state.fieldErrors.salaryMin}
              htmlFor={`${idPrefix}-salary-min`}
              label="Salary min"
            >
              <TextInputField
                id={`${idPrefix}-salary-min`}
                name="salaryMin"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                defaultValue={formValues.salaryMin}
                error={state.fieldErrors.salaryMin}
                placeholder="120000"
              />
            </FormField>

            <FormField
              error={state.fieldErrors.salaryMax}
              htmlFor={`${idPrefix}-salary-max`}
              label="Salary max"
            >
              <TextInputField
                id={`${idPrefix}-salary-max`}
                name="salaryMax"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                defaultValue={formValues.salaryMax}
                error={state.fieldErrors.salaryMax}
                placeholder="160000"
              />
            </FormField>

            <FormField
              error={state.fieldErrors.currency}
              htmlFor={`${idPrefix}-currency`}
              label="Currency"
            >
              <TextInputField
                id={`${idPrefix}-currency`}
                name="currency"
                defaultValue={formValues.currency}
                error={state.fieldErrors.currency}
                placeholder="USD"
                autoCapitalize="characters"
                maxLength={3}
                required
              />
            </FormField>

            <FormField
              error={state.fieldErrors.appliedDate}
              htmlFor={`${idPrefix}-applied-date`}
              label="Applied date"
            >
              <TextInputField
                id={`${idPrefix}-applied-date`}
                name="appliedDate"
                type="date"
                defaultValue={formValues.appliedDate}
                error={state.fieldErrors.appliedDate}
              />
            </FormField>

            <div className="sm:col-span-2">
              <FormField
                error={state.fieldErrors.jobUrl}
                htmlFor={`${idPrefix}-job-url`}
                label="Job URL"
              >
                <TextInputField
                  id={`${idPrefix}-job-url`}
                  name="jobUrl"
                  type="url"
                  defaultValue={formValues.jobUrl}
                  error={state.fieldErrors.jobUrl}
                  placeholder="https://jobs.example.com/roles/frontend-engineer"
                />
              </FormField>
            </div>

            <div className="sm:col-span-2">
              <FormField
                error={state.fieldErrors.notes}
                htmlFor={`${idPrefix}-notes`}
                label="Notes"
              >
                <textarea
                  id={`${idPrefix}-notes`}
                  name="notes"
                  defaultValue={formValues.notes}
                  aria-describedby={
                    state.fieldErrors.notes ? `${idPrefix}-notes-error` : undefined
                  }
                  aria-invalid={Boolean(state.fieldErrors.notes)}
                  className={`${getInputClassName(
                    state.fieldErrors.notes,
                  )} min-h-[140px] resize-y py-2`}
                  placeholder="Interview loop notes, recruiter contacts, referral context, or follow-up reminders"
                />
              </FormField>
            </div>
          </div>

          {state.formError ? (
            <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {state.formError}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? submittingLabel : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
