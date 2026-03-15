import { requireCurrentUser } from "@/features/auth/server/session";
import { ResumeList } from "@/features/resumes/components/resume-list";
import { ResumesEmptyState } from "@/features/resumes/components/resumes-empty-state";
import { UploadResumeForm } from "@/features/resumes/components/upload-resume-form";
import { getResumePageDataForUser } from "@/features/resumes/server/resume-list";

export default async function ResumesPage() {
  const user = await requireCurrentUser();
  const data = await getResumePageDataForUser(user.id);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
          Resumes
        </p>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-stone-950">
              Resume library
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-stone-600">
              Upload resume versions, keep file links in one place, and attach them to the right applications.
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600">
            {data.resumeCount} {data.resumeCount === 1 ? "resume" : "resumes"}
          </div>
        </div>
      </section>
      {!data.canUpload ? (
        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            Free plan limit reached
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">
            Upgrade to add more resume versions.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-700">
            Free plan users can store 1 resume. Upgrade to Pro to keep multiple role-specific versions and tailor attachments per application.
          </p>
        </section>
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
