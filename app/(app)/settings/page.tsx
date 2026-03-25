import { requireCurrentUser } from "@/features/auth/server/session";
import { PlanSummary } from "@/features/billing/components/plan-summary";

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
      <section className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
          Settings
        </p>
        <div className="mt-3 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-stone-950">
            Account and billing
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-stone-600">
            Review your current plan, understand the MVP limits, start hosted checkout to upgrade, or manage an existing Polar subscription.
          </p>
        </div>
      </section>
      {billingState === "success" ? (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
          <p className="text-sm text-emerald-800">
            Checkout completed. Plan changes take effect after Polar webhook delivery updates your account.
          </p>
        </section>
      ) : null}
      {billingState === "cancelled" ? (
        <section className="rounded-3xl border border-stone-200 bg-stone-50 p-6 shadow-sm">
          <p className="text-sm text-stone-700">
            Checkout was cancelled. You can restart it whenever you are ready.
          </p>
        </section>
      ) : null}
      {billingState === "portal_return" ? (
        <section className="rounded-3xl border border-stone-200 bg-stone-50 p-6 shadow-sm">
          <p className="text-sm text-stone-700">
            Returned from the billing portal.
          </p>
        </section>
      ) : null}
      {billingState === "portal_unavailable" ? (
        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <p className="text-sm text-amber-900">
            Billing portal is not available for this account yet. Complete a Pro checkout first or verify the Polar customer linkage for this user.
          </p>
        </section>
      ) : null}
      <PlanSummary plan={user.plan} userId={user.id} />
    </div>
  );
}
