import { EmptyState } from "@/shared/design/empty-state";

export function DashboardEmptyState() {
  return (
    <EmptyState
      eyebrow="Dashboard"
      title="No dashboard data yet."
      description="Start by adding applications or reminders. Once activity exists, this dashboard will show pipeline momentum, recent applications, and upcoming follow-ups."
    />
  );
}
