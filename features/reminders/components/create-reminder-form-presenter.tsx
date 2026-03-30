import type { ComponentProps, RefObject } from "react";

import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ReminderApplicationOption } from "@/features/reminders/types";

type CreateReminderFormPresenterProps = {
  action?: ComponentProps<"form">["action"];
  applicationOptions: ReminderApplicationOption[];
  canCreate: boolean;
  error?: string;
  formRef?: RefObject<HTMLFormElement | null>;
  idPrefix?: string;
  isPending?: boolean;
};

const selectInputClasses =
  "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30 dark:disabled:bg-input/80";

export function CreateReminderFormPresenter({
  action,
  applicationOptions,
  canCreate,
  error,
  formRef,
  idPrefix = "create-reminder",
  isPending = false,
}: CreateReminderFormPresenterProps) {
  const titleId = `${idPrefix}-title`;
  const remindAtId = `${idPrefix}-remind-at`;
  const applicationId = `${idPrefix}-application-id`;

  return (
    <form
      ref={formRef}
      action={action}
      className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm"
    >
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

      <CardContent className="mt-6 space-y-4 px-0">
        <div className="space-y-2">
          <label htmlFor={titleId} className="text-sm font-medium text-foreground">
            Title
          </label>
          <Input
            id={titleId}
            name="title"
            placeholder="Follow up with hiring manager"
            disabled={!canCreate || isPending}
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
            disabled={!canCreate || isPending}
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
            disabled={!canCreate || isPending}
            defaultValue=""
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

        <Button type="submit" disabled={!canCreate || isPending}>
          {isPending ? "Saving..." : "Create reminder"}
        </Button>
      </CardContent>
    </form>
  );
}
