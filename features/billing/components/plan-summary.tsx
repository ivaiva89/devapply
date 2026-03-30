import { CustomerPortalButton } from "@/features/billing/components/customer-portal-button";
import { PlanSummaryPresenter } from "@/features/billing/components/plan-summary-presenter";
import { UpgradeButton } from "@/features/billing/components/upgrade-button";

type PlanSummaryProps = {
  plan: "FREE" | "PRO";
  userId: string;
};

export function PlanSummary({ plan, userId }: PlanSummaryProps) {
  return (
    <PlanSummaryPresenter
      plan={plan}
      actions={
        plan === "FREE" ? (
          <>
            <UpgradeButton userId={userId} />
            <CustomerPortalButton label="Manage existing billing" />
          </>
        ) : (
          <CustomerPortalButton />
        )
      }
    />
  );
}
