type ResumesEmptyStateProps = {
  canUpload: boolean;
};

export function ResumesEmptyState({ canUpload }: ResumesEmptyStateProps) {
  return (
    <section className="rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
        Resumes
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
        No resumes uploaded yet.
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-stone-600">
        {canUpload
          ? "Upload your first resume version to attach it to applications and keep role-specific variants organized."
          : "Your free-plan resume limit has been reached. Upgrade to Pro to add more resume versions."}
      </p>
    </section>
  );
}
