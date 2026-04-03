import type { ComponentProps } from "react";

import { Button } from "@/shared/ui/button";
import { FieldShell, FormErrorMessage } from "@/shared/ui/field";
import { compactControlClassName } from "@/shared/ui/form-controls";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import type { ResumeApplicationOption } from "@/features/resumes/types";

type AttachResumeFormPresenterProps = {
  action?: ComponentProps<"form">["action"];
  applicationOptions: ResumeApplicationOption[];
  error?: string;
  isPending?: boolean;
  resumeId: string;
};

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
      <FieldShell
        htmlFor={`application-${resumeId}`}
        label="Attach to application"
      >
        <Select
          items={applicationOptions.map((application) => ({
            value: application.id,
            label: application.label,
          }))}
          name="applicationId"
          disabled={disabled}
          defaultValue=""
        >
          <SelectTrigger
            id={`application-${resumeId}`}
            className={compactControlClassName}
          >
            <SelectValue
              placeholder={
                applicationOptions.length > 0
                  ? "Select an application"
                  : "No applications available"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {applicationOptions.map((application) => (
              <SelectItem key={application.id} value={application.id}>
                {application.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldShell>

      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}

      <Button type="submit" variant="outline" size="sm" disabled={disabled}>
        {isPending ? "Attaching..." : "Attach resume"}
      </Button>
    </form>
  );
}
