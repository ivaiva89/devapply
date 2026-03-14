import { PageShell } from "@/components/layout/page-shell";
import { PlaceholderPanel } from "@/components/layout/placeholder-panel";

export default function ApplicationsPage() {
  return (
    <PageShell
      eyebrow="Applications"
      title="Manage job applications in a fast, filterable workflow."
      description="This route is reserved for the primary CRUD surface, including list management, status changes, ownership-scoped queries, and plan-limit enforcement."
    >
      <PlaceholderPanel
        title="Planned shape"
        description="Introduce an applications table, create and edit flows, and server-side validation in the next phase."
      />
    </PageShell>
  );
}
