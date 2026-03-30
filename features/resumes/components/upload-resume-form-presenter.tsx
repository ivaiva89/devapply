import type { ComponentProps, RefObject } from "react";

import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
      className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm"
    >
      <CardHeader className="space-y-2 px-0">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Upload resume
        </p>
        <CardTitle className="text-xl tracking-tight">
          Add a resume version
        </CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          Upload PDF, DOC, or DOCX files to Blob storage and keep a title you
          can recognize later.
        </p>
      </CardHeader>

      <CardContent className="mt-6 space-y-4 px-0">
        <div className="space-y-2">
          <label
            htmlFor={titleId}
            className="text-sm font-medium text-foreground"
          >
            Title
          </label>
          <Input
            id={titleId}
            name="title"
            disabled={!canUpload || isPending}
            placeholder="Backend resume"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor={fileId}
            className="text-sm font-medium text-foreground"
          >
            File
          </label>
          <Input
            id={fileId}
            name="file"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            disabled={!canUpload || isPending}
            required
            className="h-auto py-2 file:mr-3 file:rounded-full file:bg-primary file:px-3 file:py-1.5 file:text-primary-foreground"
          />
        </div>

        {error ? (
          <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <Button type="submit" disabled={!canUpload || isPending}>
          {isPending ? "Uploading..." : "Upload resume"}
        </Button>
      </CardContent>
    </form>
  );
}
