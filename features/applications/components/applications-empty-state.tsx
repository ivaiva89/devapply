import { EmptyState } from "@/shared/design/empty-state";

type ApplicationsEmptyStateProps = {
  hasFilters: boolean;
};

export function ApplicationsEmptyState({
  hasFilters,
}: ApplicationsEmptyStateProps) {
  return (
    <EmptyState
      eyebrow="Applications"
      title={
        hasFilters
          ? "No applications match these filters."
          : "No applications yet."
      }
      description={
        hasFilters
          ? "Try a broader search, switch the status filter, or reset sorting and filters to see the full list."
          : "Once applications are created, they will appear here with search, status filtering, and sort controls."
      }
    />
  );
}
