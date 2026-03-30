"use client";

import { useActionState } from "react";

import { BillingActionButtonPresenter } from "@/features/billing/components/billing-action-button-presenter";
import {
  createCustomerPortalSession,
  type CreateCustomerPortalSessionState,
} from "@/features/billing/server/create-customer-portal-session";

type CustomerPortalButtonProps = {
  className?: string;
  label?: string;
};

const initialState: CreateCustomerPortalSessionState = {
  status: "idle",
};

export function CustomerPortalButton({
  className,
  label = "Manage billing",
}: CustomerPortalButtonProps) {
  const [state, formAction, isPending] = useActionState(
    createCustomerPortalSession,
    initialState,
  );

  return (
    <BillingActionButtonPresenter
      action={formAction}
      className={className}
      error={state.error}
      isPending={isPending}
      label={label}
      pendingLabel="Opening..."
      variant="outline"
    />
  );
}
