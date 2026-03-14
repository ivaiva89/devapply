import { PageShell } from "@/components/layout/page-shell";
import { PlaceholderPanel } from "@/components/layout/placeholder-panel";

export default function DashboardPage() {
  return (
    <PageShell
      eyebrow="Dashboard"
      title="Track momentum across your job search funnel."
      description="This placeholder reserves the authenticated dashboard route for aggregate metrics, upcoming reminders, recent applications, and plan-aware usage summaries."
    >
      <PlaceholderPanel
        title="Next implementation target"
        description="Add authenticated data loading, summary cards, recent activity, and reminder highlights once the application and reminder domains exist."
      />
    </PageShell>
  );
}
