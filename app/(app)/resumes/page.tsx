import { requireCurrentUser } from "@/features/auth/server/session";
import { UpgradeButton } from "@/features/billing/components/upgrade-button";
import { UpgradePrompt } from "@/features/billing/components/upgrade-prompt";
import { FREE_PLAN_LIMITS } from "@/features/billing/config";
import { ResumeList } from "@/features/resumes/components/resume-list";
import { ResumesEmptyState } from "@/features/resumes/components/resumes-empty-state";
import { UploadResumeForm } from "@/features/resumes/components/upload-resume-form";
import { getResumePageDataForUser } from "@/features/resumes/server/resume-list";

export default async function ResumesPage() {
  const user = await requireCurrentUser();
  const data = await getResumePageDataForUser(user.id);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Resumes
        </p>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Resume library
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Upload resume versions, keep file links in one place, and attach
              them to the right applications.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            {data.resumeCount} {data.resumeCount === 1 ? "resume" : "resumes"}
          </div>
        </div>
      </section>
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
