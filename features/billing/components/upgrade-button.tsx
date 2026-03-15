"use client";

import {
  createCheckoutSession,
  type CreateCheckoutSessionState,
} from "@/features/billing/server/create-checkout-session";
import { useActionState } from "react";

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
  const [state, formAction, isPending] = useActionState(
    createCheckoutSession,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-3">
      <button
        type="submit"
        disabled={isPending}
        className={
          className ??
          "rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
        }
      >
        {isPending ? "Redirecting..." : label}
      </button>
      {state.error ? (
        <p className="text-sm text-red-700">{state.error}</p>
      ) : null}
    </form>
  );
}
