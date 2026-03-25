"use client";

import { useActionState } from "react";

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
    <form action={formAction} className="space-y-3">
      <button
        type="submit"
        disabled={isPending}
        className={
          className ??
          "rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-950 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:border-stone-200 disabled:text-stone-400"
        }
      >
        {isPending ? "Opening..." : label}
      </button>
      {state.error ? (
        <p className="text-sm text-red-700">{state.error}</p>
      ) : null}
    </form>
  );
}
