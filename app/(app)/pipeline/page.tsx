import { PageShell } from "@/components/layout/page-shell";
import { PlaceholderPanel } from "@/components/layout/placeholder-panel";

export default function PipelinePage() {
  return (
    <PageShell
      eyebrow="Pipeline"
      title="Visualize progress by stage."
      description="This route is reserved for the kanban-style pipeline view that will sit on top of the same application domain model as the table view."
    >
      <PlaceholderPanel
        title="Planned shape"
        description="Implement grouped columns, drag-and-drop or controlled status changes, and consistent stage metrics after the application domain is in place."
      />
    </PageShell>
  );
}
