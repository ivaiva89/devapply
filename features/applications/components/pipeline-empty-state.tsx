import { EmptyState } from "@/components/design/empty-state";

export function PipelineEmptyState() {
  return (
    <EmptyState
      eyebrow="Pipeline"
      title="No applications to organize yet."
      description="Once applications are created, they will appear here in status columns so you can track movement through the funnel."
    />
  );
}
