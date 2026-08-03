import { CustomerPortalButton } from "@/features/billing/components/customer-portal-button";
import { PLAN_LABELS } from "@/features/billing/config";
import { Chip, type ChipTone } from "@/shared/design/chip";
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/shared/lib/support";

type Plan = "FREE" | "PRO" | "LIFETIME";

type SettingsBillingPanelProps = {
  billingState?: string;
  plan: Plan;
  applicationsUsed: number;
  remindersUsed: number;
  resumesUsed: number;
};

const PLAN_TONE: Record<Plan, ChipTone> = {
  FREE: "slate",
  PRO: "primary",
  LIFETIME: "success",
};

const PLAN_DESCRIPTION: Record<Plan, string> = {
  FREE: "You are on the Free plan. Usage limits are not enforced — track as much as you need.",
  PRO: "You have Pro access. Manage renewals or cancellation through Polar's hosted portal.",
  LIFETIME: "You have lifetime access. No subscription is required.",
};

function BillingStatusNotice({ billingState }: { billingState?: string }) {
  if (!billingState) {
    return null;
  }

  const notices: Record<
    string,
    { tone: "neutral" | "success" | "warning"; message: string }
  > = {
    success: {
      tone: "success",
      message:
        "Checkout completed. Plan changes take effect once the Polar webhook updates your account.",
    },
    cancelled: {
      tone: "neutral",
      message: "Checkout was cancelled. You can restart it whenever you're ready.",
    },
    portal_return: {
      tone: "neutral",
      message: "Returned from the billing portal.",
    },
    portal_unavailable: {
      tone: "warning",
      message:
        "The billing portal isn't available for this account yet. Complete a checkout first or verify the Polar customer linkage.",
    },
    checkout_unavailable: {
      tone: "warning",
      message:
        "Checkout couldn't be started for this account. Verify the Polar billing configuration and try again.",
    },
  };

  const notice = notices[billingState];
  if (!notice) {
    return null;
  }

  const toneClass =
    notice.tone === "success"
      ? "border-success-soft bg-success-soft text-success"
      : notice.tone === "warning"
        ? "border-warning-soft bg-warning-soft text-warning"
        : "border-border bg-surface-1 text-text-2";

  return (
    <div
      role="status"
      className={`rounded-card border p-4 text-[13px] ${toneClass}`}
    >
      {notice.message}
    </div>
  );
}

function UsageTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-button border border-border bg-surface-1 p-4">
      <p className="font-mono text-[11px] uppercase tracking-wide text-text-3">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-text">
        {value}
      </p>
    </div>
  );
}

export function SettingsBillingPanel({
  billingState,
  plan,
  applicationsUsed,
  remindersUsed,
  resumesUsed,
}: SettingsBillingPanelProps) {
  return (
    <div className="space-y-4">
      <BillingStatusNotice billingState={billingState} />

      <section
        id="plan"
        className="scroll-mt-6 overflow-hidden rounded-card border border-border bg-surface"
      >
        <div className="border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-semibold text-text">
              Plan &amp; billing
            </h2>
            <Chip tone={PLAN_TONE[plan]} label={PLAN_LABELS[plan]} size="sm" />
          </div>
          <p className="mt-1 text-[12.5px] text-text-3">
            {PLAN_DESCRIPTION[plan]}
          </p>
        </div>

        <div className="space-y-5 p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <UsageTile label="Applications" value={applicationsUsed} />
            <UsageTile label="Active reminders" value={remindersUsed} />
            <UsageTile label="Resumes" value={resumesUsed} />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <CustomerPortalButton label="Manage billing" />
            <p className="text-[12.5px] text-text-3">
              Billing or account help?{" "}
              <a
                href={SUPPORT_MAILTO}
                className="font-medium text-primary underline underline-offset-4"
              >
                {SUPPORT_EMAIL}
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
