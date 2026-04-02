import { requireCurrentUser } from "@/features/auth/server/session";
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

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border-none bg-card p-8 shadow-sm">
        <p className="font-label text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Settings
        </p>
        <div className="mt-3 space-y-2">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Account and Billing
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Review your current plan, understand the MVP limits, start hosted
            checkout to upgrade, or manage an existing Polar subscription.
          </p>
        </div>
      </section>
      <SettingsBillingPanel billingState={billingState} plan={user.plan} />
    </div>
  );
}
