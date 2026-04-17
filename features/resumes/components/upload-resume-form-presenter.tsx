import type { ComponentProps, RefObject } from "react";

import { Button } from "@/shared/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  FieldShell,
  FormErrorMessage,
  getFieldDescribedBy,
} from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";

type UploadResumeFormPresenterProps = {
  action?: ComponentProps<"form">["action"];
  canUpload: boolean;
  error?: string;
  formRef?: RefObject<HTMLFormElement | null>;
  idPrefix?: string;
  isPending?: boolean;
};

export function UploadResumeFormPresenter({
  action,
  canUpload,
  error,
  formRef,
  idPrefix = "upload-resume",
  isPending = false,
}: UploadResumeFormPresenterProps) {
  const titleId = `${idPrefix}-title`;
  const fileId = `${idPrefix}-file`;

  return (
    <form
      ref={formRef}
      action={action}
      className="rounded-3xl border border-border/70 bg-surface p-6 shadow-sm"
    >
      <CardHeader className="space-y-2 px-0">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-3">
          Upload resume
        </p>
        <CardTitle className="text-xl tracking-tight">
          Add a resume version
        </CardTitle>
        <p className="text-sm leading-6 text-text-3">
          Upload PDF, DOC, or DOCX files to Blob storage and keep a title you
          can recognize later.
        </p>
      </CardHeader>

      <CardContent className="mt-6 space-y-4 px-0">
        <FieldShell htmlFor={titleId} label="Title">
          <Input
            id={titleId}
            name="title"
            disabled={!canUpload || isPending}
            placeholder="Backend resume"
            required
          />
        </FieldShell>

        <FieldShell
          description="PDF, DOC, or DOCX only. Maximum file size: 5 MB."
          htmlFor={fileId}
          label="File"
        >
          <Input
            id={fileId}
            name="file"
            type="file"
            aria-describedby={getFieldDescribedBy(fileId, {
              description: "PDF, DOC, or DOCX only. Maximum file size: 5 MB.",
            })}
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            disabled={!canUpload || isPending}
            required
            className="h-auto rounded-lg px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground file:shadow-sm hover:file:bg-primary/90"
          />
        </FieldShell>

        {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}

        <Button type="submit" disabled={!canUpload || isPending}>
          {isPending ? "Uploading..." : "Upload resume"}
        </Button>
      </CardContent>
    </form>
  );
}
