"use client";

import { BillingActionButtonPresenter } from "@/features/billing/components/billing-action-button-presenter";

type CustomerPortalButtonProps = {
  className?: string;
  label?: string;
};

export function CustomerPortalButton({
  className,
  label = "Manage billing",
}: CustomerPortalButtonProps) {
  return (
    <BillingActionButtonPresenter
      action="/api/billing/portal"
      className={className}
      label={label}
      method="get"
      pendingLabel="Opening..."
      variant="outline"
    />
  );
}
