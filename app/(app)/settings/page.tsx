import { PageHeader } from "@/components/design/page-header";
import { requireCurrentUser } from "@/features/auth/server/session";
import { getPlanGate } from "@/features/billing/server/plan-enforcement";
import { SettingsBillingPanel } from "@/widgets/settings-billing/ui/settings-billing-panel";

type SettingsPageProps = {
  searchParams?: Promise<{
    billing?: string | string[] | undefined;
  }>;
};

export default async function SettingsPage({
  searchParams,
}: SettingsPageProps) {
  const user = await requireCurrentUser();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const billingState = Array.isArray(resolvedSearchParams?.billing)
    ? resolvedSearchParams?.billing[0]
    : resolvedSearchParams?.billing;

  const applicationsGate =
    user.plan === "FREE"
      ? await getPlanGate(user, "applications")
      : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Review your current plan, understand the MVP limits, start hosted checkout to upgrade, or manage an existing Polar subscription."
        breadcrumb="settings"
      />
      <SettingsBillingPanel
        billingState={billingState}
        plan={user.plan}
        applicationsUsed={applicationsGate?.used}
        applicationsLimit={applicationsGate?.limit}
      />
    </div>
  );
}
