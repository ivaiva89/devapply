import { PageShell } from "@/components/layout/page-shell";
import { PlaceholderPanel } from "@/components/layout/placeholder-panel";

export default function ResumesPage() {
  return (
    <PageShell
      eyebrow="Resumes"
      title="Store and manage resume versions."
      description="This route is reserved for resume uploads, ownership checks, and plan-limited attachment management tied to job applications."
    >
      <PlaceholderPanel
        title="Planned shape"
        description="Add secure storage integration, upload metadata, and attachment selection flows in a dedicated resumes module."
      />
    </PageShell>
  );
}
