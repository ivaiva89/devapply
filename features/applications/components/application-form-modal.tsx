"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  type ComponentProps,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import {
  applicationFormStatusOptions,
  applicationSourceOptions,
} from "@/features/applications/config";
import {
  getCreateApplicationInitialState,
  type CreateApplicationActionState,
  type CreateApplicationFormValues,
} from "@/features/applications/create-application-form";

type ApplicationFormAction = (
  state: CreateApplicationActionState,
  formData: FormData,
) => Promise<CreateApplicationActionState>;

type ApplicationFormModalProps = {
  action: ApplicationFormAction;
  description: string;
  initialValues: CreateApplicationFormValues;
  isOpen: boolean;
  onCancel: () => void;
  onSuccess: () => void;
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
  "w-full rounded-2xl border bg-white px-4 py-3 text-sm text-stone-950 outline-none transition";

function getInputClassName(error?: string) {
  return `${baseInputClassName} ${
    error
      ? "border-red-300 focus:border-red-500"
      : "border-stone-300 focus:border-stone-950"
  }`;
}

function FormField({ children, error, htmlFor, label }: FormFieldProps) {
  const errorId = `${htmlFor}-error`;

  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-stone-700">
        {label}
      </label>
      {children}
      {error ? (
        <p id={errorId} className="text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function TextInputField({ error, ...props }: TextInputFieldProps) {
  const errorId = `${props.id}-error`;

  return (
    <input
      {...props}
      aria-describedby={error ? errorId : undefined}
      aria-invalid={Boolean(error)}
      className={getInputClassName(error)}
    />
  );
}

export function ApplicationFormModal({
  action,
  description,
  initialValues,
  isOpen,
  onCancel,
  onSuccess,
  submitLabel,
  submittingLabel,
  title,
}: ApplicationFormModalProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    action,
    getCreateApplicationInitialState(initialValues),
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    onSuccess();
    startTransition(() => {
      router.refresh();
    });
  }, [onSuccess, router, state.status]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isPending, onCancel]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/45 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="application-form-heading"
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-black/10 bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-6 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
            Applications
          </p>
          <div>
            <h2
              id="application-form-heading"
              className="text-2xl font-semibold tracking-tight text-stone-950"
            >
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              {description}
            </p>
          </div>
        </div>
        <form action={formAction} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              error={state.fieldErrors.company}
              htmlFor="company"
              label="Company"
            >
              <TextInputField
                id="company"
                name="company"
                defaultValue={initialValues.company}
                error={state.fieldErrors.company}
                placeholder="Linear"
                autoComplete="organization"
                required
              />
            </FormField>
            <FormField error={state.fieldErrors.role} htmlFor="role" label="Role">
              <TextInputField
                id="role"
                name="role"
                defaultValue={initialValues.role}
                error={state.fieldErrors.role}
                placeholder="Senior Frontend Engineer"
                autoComplete="organization-title"
                required
              />
            </FormField>
            <FormField
              error={state.fieldErrors.location}
              htmlFor="location"
              label="Location"
            >
              <TextInputField
                id="location"
                name="location"
                defaultValue={initialValues.location}
                error={state.fieldErrors.location}
                placeholder="Remote, US"
              />
            </FormField>
            <FormField error={state.fieldErrors.source} htmlFor="source" label="Source">
              <select
                id="source"
                name="source"
                defaultValue={initialValues.source}
                aria-describedby={
                  state.fieldErrors.source ? "source-error" : undefined
                }
                aria-invalid={Boolean(state.fieldErrors.source)}
                className={getInputClassName(state.fieldErrors.source)}
              >
                {applicationSourceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField error={state.fieldErrors.status} htmlFor="status" label="Status">
              <select
                id="status"
                name="status"
                defaultValue={initialValues.status}
                aria-describedby={
                  state.fieldErrors.status ? "status-error" : undefined
                }
                aria-invalid={Boolean(state.fieldErrors.status)}
                className={getInputClassName(state.fieldErrors.status)}
              >
                {applicationFormStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField
              error={state.fieldErrors.salaryMin}
              htmlFor="salaryMin"
              label="Salary min"
            >
              <TextInputField
                id="salaryMin"
                name="salaryMin"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                defaultValue={initialValues.salaryMin}
                error={state.fieldErrors.salaryMin}
                placeholder="120000"
              />
            </FormField>
            <FormField
              error={state.fieldErrors.salaryMax}
              htmlFor="salaryMax"
              label="Salary max"
            >
              <TextInputField
                id="salaryMax"
                name="salaryMax"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                defaultValue={initialValues.salaryMax}
                error={state.fieldErrors.salaryMax}
                placeholder="160000"
              />
            </FormField>
            <FormField
              error={state.fieldErrors.currency}
              htmlFor="currency"
              label="Currency"
            >
              <TextInputField
                id="currency"
                name="currency"
                defaultValue={initialValues.currency}
                error={state.fieldErrors.currency}
                placeholder="USD"
                autoCapitalize="characters"
                maxLength={3}
                required
              />
            </FormField>
            <FormField
              error={state.fieldErrors.appliedDate}
              htmlFor="appliedDate"
              label="Applied date"
            >
              <TextInputField
                id="appliedDate"
                name="appliedDate"
                type="date"
                defaultValue={initialValues.appliedDate}
                error={state.fieldErrors.appliedDate}
              />
            </FormField>
            <div className="sm:col-span-2">
              <FormField
                error={state.fieldErrors.jobUrl}
                htmlFor="jobUrl"
                label="Job URL"
              >
                <TextInputField
                  id="jobUrl"
                  name="jobUrl"
                  type="url"
                  defaultValue={initialValues.jobUrl}
                  error={state.fieldErrors.jobUrl}
                  placeholder="https://jobs.example.com/roles/frontend-engineer"
                />
              </FormField>
            </div>
            <div className="sm:col-span-2">
              <FormField error={state.fieldErrors.notes} htmlFor="notes" label="Notes">
                <textarea
                  id="notes"
                  name="notes"
                  defaultValue={initialValues.notes}
                  aria-describedby={state.fieldErrors.notes ? "notes-error" : undefined}
                  aria-invalid={Boolean(state.fieldErrors.notes)}
                  rows={5}
                  placeholder="Hiring manager details, timeline, or prep notes."
                  className={`${getInputClassName(
                    state.fieldErrors.notes,
                  )} resize-y`}
                />
              </FormField>
            </div>
          </div>
          {state.formError ? (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.formError}
            </p>
          ) : null}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={isPending}
              className="rounded-full border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
            >
              {isPending ? submittingLabel : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
