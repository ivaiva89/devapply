import { requireCurrentUser } from "@/features/auth/server/session";
import { PlanSummary } from "@/features/billing/components/plan-summary";
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/support";

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
      {billingState === "success" ? (
        <section className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 shadow-sm">
          <p className="text-sm text-emerald-800">
            Checkout completed. Plan changes take effect after Polar webhook
            delivery updates your account.
          </p>
        </section>
      ) : null}
      {billingState === "cancelled" ? (
        <section className="rounded-3xl border border-border bg-muted/40 p-6 shadow-sm">
          <p className="text-sm text-foreground/80">
            Checkout was cancelled. You can restart it whenever you are ready.
          </p>
        </section>
      ) : null}
      {billingState === "portal_return" ? (
        <section className="rounded-3xl border border-border bg-muted/40 p-6 shadow-sm">
          <p className="text-sm text-foreground/80">
            Returned from the billing portal.
          </p>
        </section>
      ) : null}
      {billingState === "portal_unavailable" ? (
        <section className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 shadow-sm">
          <p className="text-sm text-amber-900">
            Billing portal is not available for this account yet. Complete a Pro
            checkout first or verify the Polar customer linkage for this user.
          </p>
        </section>
      ) : null}
      <PlanSummary plan={user.plan} />
      <section className="rounded-3xl border-none bg-card p-6 shadow-sm">
        <p className="font-label text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Support
        </p>
        <div className="mt-3 space-y-2">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Need account or billing help?
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Contact the DevApply team directly for billing questions, access
            issues, or support requests.
          </p>
          <a
            href={SUPPORT_MAILTO}
            className="inline-flex text-sm font-medium text-primary underline underline-offset-4"
          >
            {SUPPORT_EMAIL}
          </a>
        </div>
      </section>
    </div>
  );
}
