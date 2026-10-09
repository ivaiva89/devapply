"use client";

import { useState, type ReactNode } from "react";

import { authClient } from "@/shared/lib/auth/client";

type ResendState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "sent" }
  | { status: "failed" };

interface ResendConfirmationProps {
  email: string;
}

// Sends a new confirmation email for the address, only when pressed.
export function ResendConfirmation({
  email,
}: ResendConfirmationProps): ReactNode {
  const [state, setState] = useState<ResendState>({ status: "idle" });

  async function handleResend(): Promise<void> {
    setState({ status: "sending" });
    const { error } = await authClient.sendVerificationEmail({ email });
    setState({ status: error ? "failed" : "sent" });
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleResend}
        disabled={state.status === "sending"}
        className="border-border-strong bg-surface text-text hover:bg-surface-2 h-9 rounded-button border text-[14px] font-medium disabled:opacity-60"
      >
        Resend email
      </button>
      <p aria-live="polite" className="text-text-2 text-[13px] empty:hidden">
        {state.status === "sent" ? "We sent a new confirmation link." : ""}
      </p>
      {state.status === "failed" ? (
        <p role="alert" className="text-danger text-[13px]">
          We couldn&apos;t send the email. Press Resend email to try again.
        </p>
      ) : null}
    </div>
  );
}
