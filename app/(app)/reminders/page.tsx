import { PageShell } from "@/components/layout/page-shell";
import { PlaceholderPanel } from "@/components/layout/placeholder-panel";

export default function RemindersPage() {
  return (
    <PageShell
      eyebrow="Reminders"
      title="Keep follow-ups visible and actionable."
      description="This route is reserved for follow-up scheduling, due-state views, and the server-side reminder limits that distinguish free and paid plans."
    >
      <PlaceholderPanel
        title="Planned shape"
        description="Add reminder scheduling, due-date filtering, and notifications once the reminders domain and billing checks are implemented."
      />
    </PageShell>
  );
}
