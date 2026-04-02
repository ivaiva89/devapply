import { EmptyState } from "@/shared/design/empty-state";

type RemindersEmptyStateProps = {
  canCreate: boolean;
};

export function RemindersEmptyState({ canCreate }: RemindersEmptyStateProps) {
  return (
    <EmptyState
      eyebrow="Reminders"
      title="No active reminders."
      description={
        canCreate
          ? "Create your first reminder to keep follow-ups and outreach visible."
          : "Your free-plan reminder limit has been reached. Upgrade to Pro to keep more active reminders."
      }
    />
  );
}
