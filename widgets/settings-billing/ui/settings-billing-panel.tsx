import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/shared/lib/support";
import { PlanSummary } from "@/widgets/settings-billing/ui/plan-summary";

type SettingsBillingPanelProps = {
  billingState?: string;
  plan: "FREE" | "PRO" | "LIFETIME";
};

function BillingStatusNotice({ billingState }: { billingState?: string }) {
  if (billingState === "success") {
    return (
      <section className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 shadow-sm">
        <p className="text-sm text-emerald-800">
          Checkout completed. Plan changes take effect after Polar webhook
          delivery updates your account.
        </p>
      </section>
    );
  }

  if (billingState === "cancelled") {
    return (
      <section className="rounded-3xl border border-border bg-muted/40 p-6 shadow-sm">
        <p className="text-sm text-foreground/80">
          Checkout was cancelled. You can restart it whenever you are ready.
        </p>
      </section>
    );
  }

  if (billingState === "portal_return") {
    return (
      <section className="rounded-3xl border border-border bg-muted/40 p-6 shadow-sm">
        <p className="text-sm text-foreground/80">
          Returned from the billing portal.
        </p>
      </section>
    );
  }

  if (billingState === "portal_unavailable") {
    return (
      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 shadow-sm">
        <p className="text-sm text-amber-900">
          Billing portal is not available for this account yet. Complete a Pro
          checkout first or verify the Polar customer linkage for this user.
        </p>
      </section>
    );
  }

  if (billingState === "checkout_unavailable") {
    return (
      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 shadow-sm">
        <p className="text-sm text-amber-900">
          Checkout could not be started for this account. Verify the Polar
          billing configuration and try again.
        </p>
      </section>
    );
  }

  return null;
}

function BillingSupportCard() {
  return (
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
  );
}

export function SettingsBillingPanel({
  billingState,
  plan,
}: SettingsBillingPanelProps) {
  return (
    <div className="space-y-6">
      <BillingStatusNotice billingState={billingState} />
      <PlanSummary plan={plan} />
      <BillingSupportCard />
    </div>
  );
}
