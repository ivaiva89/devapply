import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/shared/lib/support";
import { UpgradeButton } from "@/features/billing/components/upgrade-button";
import { PlanSummary } from "@/widgets/settings-billing/ui/plan-summary";

type SettingsBillingPanelProps = {
  billingState?: string;
  plan: "FREE" | "PRO" | "LIFETIME";
  applicationsUsed?: number;
  applicationsLimit?: number;
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
      <section className="rounded-3xl border border-border bg-surface-1/40 p-6 shadow-sm">
        <p className="text-sm text-text/80">
          Checkout was cancelled. You can restart it whenever you are ready.
        </p>
      </section>
    );
  }

  if (billingState === "portal_return") {
    return (
      <section className="rounded-3xl border border-border bg-surface-1/40 p-6 shadow-sm">
        <p className="text-sm text-text/80">
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
      <p className="font-label text-xs font-semibold uppercase tracking-[0.24em] text-text-3">
        Support
      </p>
      <div className="mt-3 space-y-2">
        <h2 className="font-display text-2xl font-bold tracking-tight text-text">
          Need account or billing help?
        </h2>
        <p className="text-sm leading-6 text-text-3">
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

function UpgradeCallout({
  applicationsUsed,
  applicationsLimit,
}: {
  applicationsUsed: number;
  applicationsLimit: number;
}) {
  const applicationsRemaining = applicationsLimit - applicationsUsed;

  return (
    <div className="rounded-card border border-warning/30 bg-warning-soft p-4">
      <p className="text-sm font-medium text-text">
        You have {applicationsUsed} of {applicationsLimit} applications tracked
        {applicationsRemaining <= 0
          ? " — you've hit the free plan limit"
          : ""}
      </p>
      <p className="mt-1 text-sm text-text-3">
        Upgrade to track unlimited applications and attachments.
      </p>
      <div className="mt-3">
        <UpgradeButton />
      </div>
    </div>
  );
}

export function SettingsBillingPanel({
  billingState,
  plan,
  applicationsUsed,
  applicationsLimit,
}: SettingsBillingPanelProps) {
  const showUpgradeCallout =
    plan === "FREE" &&
    applicationsUsed !== undefined &&
    applicationsLimit !== undefined;

  return (
    <div className="space-y-6">
      <BillingStatusNotice billingState={billingState} />
      <PlanSummary plan={plan} />
      {showUpgradeCallout && (
        <UpgradeCallout
          applicationsUsed={applicationsUsed}
          applicationsLimit={applicationsLimit}
        />
      )}
      <BillingSupportCard />
    </div>
  );
}
