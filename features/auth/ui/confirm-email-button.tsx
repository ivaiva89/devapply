"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

import { authClient } from "@/shared/lib/auth/client";

type ConfirmState =
  | { status: "idle" }
  | { status: "confirming" }
  | { status: "expired" }
  | { status: "failed"; message: string };

interface ConfirmEmailButtonProps {
  token: string;
  email: string | null;
}

// Uses the link's token up, and only when pressed: mail scanners open links
// before people do, so rendering the page must confirm nothing.
export function ConfirmEmailButton({
  token,
  email,
}: ConfirmEmailButtonProps): ReactNode {
  const router = useRouter();
  const [state, setState] = useState<ConfirmState>({ status: "idle" });

  async function handleConfirm(): Promise<void> {
    setState({ status: "confirming" });
    const { error } = await authClient.verifyEmail({ query: { token } });
    if (!error) {
      router.replace("/sign-in");
      return;
    }
    setState(
      error.code === "TOKEN_EXPIRED"
        ? { status: "expired" }
        : {
            status: "failed",
            message: error.message ?? "This link could not be used.",
          },
    );
  }

  const resendHref = email
    ? `/check-email?email=${encodeURIComponent(email)}`
    : "/sign-up";

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={handleConfirm}
        disabled={state.status === "confirming"}
        className="bg-text text-canvas h-9 rounded-button text-[14px] font-medium hover:opacity-90 disabled:opacity-60"
      >
        Confirm email
      </button>
      {state.status === "expired" ? (
        <p role="alert" className="text-danger text-[13px]">
          This link has expired.{" "}
          <Link
            href={resendHref}
            className="text-primary hover:text-primary-hover underline"
          >
            Send a new link
          </Link>
        </p>
      ) : null}
      {state.status === "failed" ? (
        <p role="alert" className="text-danger text-[13px]">
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
