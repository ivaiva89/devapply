import { PageHeader } from "@/shared/design/page-header";
import { requireCurrentUser } from "@/features/auth/server/session";
import { ResumeList } from "@/widgets/resumes-panel/ui/resume-list";
import { ResumesEmptyState } from "@/widgets/resumes-panel/ui/resumes-empty-state";
import { UploadResumeForm } from "@/features/resumes/components/upload-resume-form";
import { getResumePageDataForUser } from "@/features/resumes/server/resume-list";

export default async function ResumesPage() {
  const user = await requireCurrentUser();
  const data = await getResumePageDataForUser(user.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resumes"
        description="Upload resume versions and attach them to your applications."
        breadcrumb="resumes"
        actions={
          <div className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-3">
            {data.resumeCount} {data.resumeCount === 1 ? "resume" : "resumes"}
          </div>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <UploadResumeForm />
        <div className="space-y-4">
          {data.resumes.length > 0 ? (
            <ResumeList
              applicationOptions={data.applicationOptions}
              resumes={data.resumes}
            />
          ) : (
            <ResumesEmptyState />
          )}
        </div>
      </div>
    </div>
  );
}
