import { PageHeader } from "@/components/design/page-header";
import { requireCurrentUser } from "@/features/auth/server/session";
import { UpgradeButton } from "@/features/billing/components/upgrade-button";
import { UpgradePrompt } from "@/features/billing/components/upgrade-prompt";
import { FREE_PLAN_LIMITS } from "@/features/billing/config";
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
      {!data.canUpload ? (
        <>
          <UpgradePrompt
            title="Upgrade to keep multiple resume versions."
            description={`Free plan users can store ${FREE_PLAN_LIMITS.resumes} resume. Upgrade to Pro to keep multiple role-specific versions and tailor attachments per application.`}
          />
          <UpgradeButton />
        </>
      ) : null}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <UploadResumeForm canUpload={data.canUpload} />
        <div className="space-y-4">
          {data.resumes.length > 0 ? (
            <ResumeList
              applicationOptions={data.applicationOptions}
              resumes={data.resumes}
            />
          ) : (
            <ResumesEmptyState canUpload={data.canUpload} />
          )}
        </div>
      </div>
    </div>
  );
}
