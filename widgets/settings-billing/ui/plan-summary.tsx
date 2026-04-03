import { CustomerPortalButton } from "@/features/billing/components/customer-portal-button";
import { UpgradeButton } from "@/features/billing/components/upgrade-button";
import { PlanSummaryPresenter } from "@/widgets/settings-billing/ui/plan-summary-presenter";

type PlanSummaryProps = {
  plan: "FREE" | "PRO" | "LIFETIME";
};

export function PlanSummary({ plan }: PlanSummaryProps) {
  return (
    <PlanSummaryPresenter
      plan={plan}
      actions={
        plan === "FREE" ? (
          <>
            <UpgradeButton />
            <UpgradeButton
              plan="LIFETIME"
              label="Get lifetime access"
              variant="outline"
            />
            <CustomerPortalButton label="Manage existing billing" />
          </>
        ) : (
          <CustomerPortalButton />
        )
      }
    />
  );
}
