import { PageShell } from "@/components/layout/page-shell";
import { PlaceholderPanel } from "@/components/layout/placeholder-panel";

export default function SettingsPage() {
  return (
    <PageShell
      eyebrow="Settings"
      title="Configure account, preferences, and billing entry points."
      description="This route is reserved for user preferences, billing controls, profile management, and future account-level security settings."
    >
      <PlaceholderPanel
        title="Planned shape"
        description="Add account settings sections, subscription state, and secure mutation handlers after auth and billing foundations land."
      />
    </PageShell>
  );
}
