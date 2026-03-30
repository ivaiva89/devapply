import type { ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ResumeListItem } from "@/features/resumes/types";

type ResumeListPresenterProps = {
  resumes: ResumeListItem[];
  renderAttachForm?: (resume: ResumeListItem) => ReactNode;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatBytes(value: number) {
  if (value < 1024 * 1024) {
    return `${Math.round(value / 1024)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

export function ResumeListPresenter({
  resumes,
  renderAttachForm,
}: ResumeListPresenterProps) {
  return (
    <div className="space-y-4">
      {resumes.map((resume) => (
        <Card
          key={resume.id}
          className="rounded-3xl border border-border/70 bg-card shadow-sm"
        >
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <div>
                  <p className="text-lg font-semibold tracking-tight text-foreground">
                    {resume.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {resume.fileName}
                  </p>
                </div>

                <dl className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <div>{formatBytes(resume.fileSizeBytes)}</div>
                  <div>{resume.mimeType}</div>
                  <div>Uploaded {formatDate(resume.uploadedAt)}</div>
                </dl>

                <a
                  href={resume.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Open file
                </a>
              </div>

              {renderAttachForm ? (
                <div className="w-full max-w-sm">
                  {renderAttachForm(resume)}
                </div>
              ) : null}
            </div>

            <div className="space-y-3">
              <CardHeader className="px-0">
                <CardTitle className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Attached applications
                </CardTitle>
              </CardHeader>

              {resume.attachedApplications.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {resume.attachedApplications.map((application) => (
                    <span
                      key={application.id}
                      className="rounded-full bg-muted px-3 py-2 text-sm text-muted-foreground"
                    >
                      {application.company} - {application.role}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  This resume is not attached to any application yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
