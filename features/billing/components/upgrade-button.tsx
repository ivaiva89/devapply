"use client";

import { useActionState } from "react";
import { usePathname } from "next/navigation";

import { trackClientEvent } from "@/features/analytics/client/track-event";
import { BillingActionButtonPresenter } from "@/features/billing/components/billing-action-button-presenter";
import {
  createCheckoutSession,
  type CreateCheckoutSessionState,
} from "@/features/billing/server/create-checkout-session";

type UpgradeButtonProps = {
  className?: string;
  label?: string;
};

const initialState: CreateCheckoutSessionState = {
  status: "idle",
};

export function UpgradeButton({
  className,
  label = "Upgrade to Pro",
}: UpgradeButtonProps) {
  const pathname = usePathname();
  const [state, formAction, isPending] = useActionState(
    createCheckoutSession,
    initialState,
  );

  return (
    <BillingActionButtonPresenter
      action={formAction}
      className={className}
      error={state.error}
      isPending={isPending}
      label={label}
      pendingLabel="Redirecting..."
      onClick={() => {
        trackClientEvent({
          event: "upgrade_clicked",
          properties: {
            ctaLabel: label,
            source: pathname,
          },
        });
      }}
    />
  );
}
