"use client";

import { useActionState } from "react";
import { usePathname } from "next/navigation";

import { trackClientEvent } from "@/features/analytics/client/track-event";
import {
  createCheckoutSession,
  type CreateCheckoutSessionState,
} from "@/features/billing/server/create-checkout-session";

type UpgradeButtonProps = {
  className?: string;
  label?: string;
  userId?: string;
};

const initialState: CreateCheckoutSessionState = {
  status: "idle",
};

export function UpgradeButton({
  className,
  label = "Upgrade to Pro",
  userId,
}: UpgradeButtonProps) {
  const pathname = usePathname();
  const [state, formAction, isPending] = useActionState(
    createCheckoutSession,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-3">
      <button
        type="submit"
        disabled={isPending}
        onClick={() => {
          trackClientEvent({
            distinctId: userId,
            event: "upgrade_clicked",
            properties: {
              ctaLabel: label,
              source: pathname,
            },
          });
        }}
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
