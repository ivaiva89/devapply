import type { ComponentProps } from "react";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  FieldShell,
  FormErrorMessage,
  getFieldDescribedBy,
} from "@/shared/ui/field";
import {
  getCompactFieldControlClassName,
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
import {
  applicationFormStatusOptions,
  applicationSourceOptions,
} from "@/entities/application/model/config";
import type {
  CreateApplicationActionState,
  CreateApplicationFormValues,
} from "@/features/applications/create-application-form";
import { cn } from "@/shared/lib/utils";

type ApplicationFormModalPresenterProps = {
  action?: ComponentProps<"form">["action"];
  description: string;
  idPrefix?: string;
  isOpen: boolean;
  isPending?: boolean;
  onCancel?: () => void;
  state: CreateApplicationActionState;
  submitLabel: string;
  submittingLabel: string;
  title: string;
};

type TextInputFieldProps = Omit<ComponentProps<"input">, "id"> & {
  description?: string;
  error?: string;
  id: string;
};

function TextInputField({
  className,
  description,
  error,
  ...props
}: TextInputFieldProps) {
  return (
    <Input
      {...props}
      aria-describedby={getFieldDescribedBy(props.id, { description, error })}
      aria-invalid={Boolean(error)}
      className={cn(getCompactFieldControlClassName(error), className)}
    />
  );
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
    <Dialog
      open={isOpen}
      onOpenChange={
        onCancel ? (open) => (!open ? onCancel() : undefined) : undefined
      }
    >
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-[2rem] p-6 sm:p-8">
        <DialogHeader>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-text-3">
            Applications
          </p>
          <DialogTitle className="text-2xl tracking-tight">{title}</DialogTitle>
          <DialogDescription className="mt-1 text-sm leading-6">
            {description}
          </DialogDescription>
        </DialogHeader>

        <form action={action} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldShell
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
            </FieldShell>

            <FieldShell
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
            </FieldShell>

            <FieldShell
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
            </FieldShell>

            <FieldShell
              error={state.fieldErrors.source}
              htmlFor={`${idPrefix}-source`}
              label="Source"
            >
              <Select
                items={applicationSourceOptions}
                name="source"
                defaultValue={formValues.source}
              >
                <SelectTrigger
                  id={`${idPrefix}-source`}
                  aria-describedby={getFieldDescribedBy(`${idPrefix}-source`, {
                    error: state.fieldErrors.source,
                  })}
                  aria-invalid={Boolean(state.fieldErrors.source)}
                  className={getCompactFieldControlClassName(
                    state.fieldErrors.source,
                  )}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {applicationSourceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldShell>

            <FieldShell
              error={state.fieldErrors.status}
              htmlFor={`${idPrefix}-status`}
              label="Status"
            >
              <Select
                items={applicationFormStatusOptions}
                name="status"
                defaultValue={formValues.status}
              >
                <SelectTrigger
                  id={`${idPrefix}-status`}
                  aria-describedby={getFieldDescribedBy(`${idPrefix}-status`, {
                    error: state.fieldErrors.status,
                  })}
                  aria-invalid={Boolean(state.fieldErrors.status)}
                  className={getCompactFieldControlClassName(
                    state.fieldErrors.status,
                  )}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {applicationFormStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldShell>

            <FieldShell
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
            </FieldShell>

            <FieldShell
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
            </FieldShell>

            <FieldShell
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
            </FieldShell>

            <FieldShell
              description="Optional. Leave blank if you have not applied yet."
              error={state.fieldErrors.appliedDate}
              htmlFor={`${idPrefix}-applied-date`}
              label="Applied date"
            >
              <TextInputField
                id={`${idPrefix}-applied-date`}
                name="appliedDate"
                type="date"
                defaultValue={formValues.appliedDate}
                description="Optional. Leave blank if you have not applied yet."
                error={state.fieldErrors.appliedDate}
                className={nativePickerAffordanceClassName}
              />
            </FieldShell>

            <div className="sm:col-span-2">
              <FieldShell
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
              </FieldShell>
            </div>

            <div className="sm:col-span-2">
              <FieldShell
                error={state.fieldErrors.notes}
                htmlFor={`${idPrefix}-notes`}
                label="Notes"
              >
                <textarea
                  id={`${idPrefix}-notes`}
                  name="notes"
                  defaultValue={formValues.notes}
                  aria-describedby={getFieldDescribedBy(`${idPrefix}-notes`, {
                    error: state.fieldErrors.notes,
                  })}
                  aria-invalid={Boolean(state.fieldErrors.notes)}
                  className={cn(
                    getCompactFieldControlClassName(state.fieldErrors.notes),
                    "min-h-[140px] resize-y py-2",
                  )}
                  placeholder="Interview loop notes, recruiter contacts, referral context, or follow-up reminders"
                />
              </FieldShell>
            </div>
          </div>

          {state.formError ? (
            <FormErrorMessage>{state.formError}</FormErrorMessage>
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
