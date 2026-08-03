import { EmptyState } from "@/shared/design/empty-state";

export function RemindersEmptyState() {
  return (
    <EmptyState
      eyebrow="Reminders"
      title="No active reminders."
      description="Create your first reminder to keep follow-ups and outreach visible."
    />
  );
}
