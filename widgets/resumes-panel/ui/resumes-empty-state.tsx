import { EmptyState } from "@/shared/design/empty-state";

type ResumesEmptyStateProps = {
  canUpload: boolean;
};

export function ResumesEmptyState({ canUpload }: ResumesEmptyStateProps) {
  return (
    <EmptyState
      eyebrow="Resumes"
      title="No resumes uploaded yet."
      description={
        canUpload
          ? "Upload your first resume version to attach it to applications and keep role-specific variants organized."
          : "Your free-plan resume limit has been reached. Upgrade to Pro to add more resume versions."
      }
    />
  );
}
