import { CustomerPortalButton } from "@/features/billing/components/customer-portal-button";
import { UpgradeButton } from "@/features/billing/components/upgrade-button";
import { PlanSummaryPresenter } from "@/widgets/settings-billing/ui/plan-summary-presenter";

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
