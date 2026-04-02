import type { ComponentProps } from "react";

import { Button } from "@/shared/ui/button";
import type { ResumeApplicationOption } from "@/features/resumes/types";

type AttachResumeFormPresenterProps = {
  action?: ComponentProps<"form">["action"];
  applicationOptions: ResumeApplicationOption[];
  error?: string;
  isPending?: boolean;
  resumeId: string;
};

const selectInputClasses =
  "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30 dark:disabled:bg-input/80";

export function AttachResumeFormPresenter({
  action,
  applicationOptions,
  error,
  isPending = false,
  resumeId,
}: AttachResumeFormPresenterProps) {
  const disabled = applicationOptions.length === 0 || isPending;

  return (
    <form action={action} className="space-y-3">
      <div className="space-y-2">
        <label
          className="text-sm font-medium text-foreground"
          htmlFor={`application-${resumeId}`}
        >
          Attach to application
        </label>
        <select
          id={`application-${resumeId}`}
          name="applicationId"
          disabled={disabled}
          className={selectInputClasses}
          defaultValue=""
        >
          <option value="" disabled>
            {applicationOptions.length > 0
              ? "Select an application"
              : "No applications available"}
          </option>
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

      <Button type="submit" variant="outline" size="sm" disabled={disabled}>
        {isPending ? "Attaching..." : "Attach resume"}
      </Button>
    </form>
  );
}
