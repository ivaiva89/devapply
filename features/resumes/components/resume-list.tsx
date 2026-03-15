import { AttachResumeForm } from "@/features/resumes/components/attach-resume-form";
import type { ResumeApplicationOption, ResumeListItem } from "@/features/resumes/types";

type ResumeListProps = {
  applicationOptions: ResumeApplicationOption[];
  resumes: ResumeListItem[];
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

export function ResumeList({ applicationOptions, resumes }: ResumeListProps) {
  return (
    <div className="space-y-4">
      {resumes.map((resume) => (
        <section
          key={resume.id}
          className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <div>
                <p className="text-lg font-semibold tracking-tight text-stone-950">
                  {resume.title}
                </p>
                <p className="text-sm text-stone-600">{resume.fileName}</p>
              </div>
              <dl className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-stone-500">
                <div>{formatBytes(resume.fileSizeBytes)}</div>
                <div>{resume.mimeType}</div>
                <div>Uploaded {formatDate(resume.uploadedAt)}</div>
              </dl>
              <a
                href={resume.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
              >
                Open file
              </a>
            </div>
            <div className="w-full max-w-sm">
              <AttachResumeForm
                applicationOptions={applicationOptions}
                resumeId={resume.id}
              />
            </div>
          </div>
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              Attached applications
            </p>
            {resume.attachedApplications.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {resume.attachedApplications.map((application) => (
                  <span
                    key={application.id}
                    className="rounded-full bg-stone-100 px-3 py-2 text-sm text-stone-700"
                  >
                    {application.company} - {application.role}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-stone-600">
                This resume is not attached to any application yet.
              </p>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
