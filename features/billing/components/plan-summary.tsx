import { CustomerPortalButton } from "@/features/billing/components/customer-portal-button";
import { PlanSummaryPresenter } from "@/features/billing/components/plan-summary-presenter";
import { UpgradeButton } from "@/features/billing/components/upgrade-button";

type PlanSummaryProps = {
  plan: "FREE" | "PRO";
};

export function PlanSummary({ plan }: PlanSummaryProps) {
  return (
    <PlanSummaryPresenter
      plan={plan}
      actions={
        plan === "FREE" ? (
          <>
            <UpgradeButton />
            <CustomerPortalButton label="Manage existing billing" />
          </>
        ) : (
          <CustomerPortalButton />
        )
      }
    />
  );
}
