"use client";

import { usePathname } from "next/navigation";

import { trackClientEvent } from "@/features/analytics/client/track-event";
import { BillingActionButtonPresenter } from "@/features/billing/components/billing-action-button-presenter";

type UpgradeButtonProps = {
  className?: string;
  label?: string;
  plan?: "PRO" | "LIFETIME";
  variant?: "default" | "outline";
};

export function UpgradeButton({
  className,
  label = "Upgrade to Pro",
  plan = "PRO",
  variant = "default",
}: UpgradeButtonProps) {
  const pathname = usePathname();

  return (
    <BillingActionButtonPresenter
      action="/api/billing/checkout"
      className={className}
      label={label}
      method="get"
      pendingLabel="Redirecting..."
      variant={variant}
      onClick={() => {
        trackClientEvent({
          event: "upgrade_clicked",
          properties: {
            ctaLabel: label,
            source: pathname,
          },
        });
      }}
    >
      <input type="hidden" name="plan" value={plan} />
    </BillingActionButtonPresenter>
  );
}
