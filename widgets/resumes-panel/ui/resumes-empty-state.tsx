import { EmptyState } from "@/shared/design/empty-state";

export function ResumesEmptyState() {
  return (
    <EmptyState
      eyebrow="Resumes"
      title="No resumes uploaded yet."
      description="Upload your first resume version to attach it to applications and keep role-specific variants organized."
    />
  );
}
