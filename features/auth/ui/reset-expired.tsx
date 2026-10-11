import Link from "next/link";
import type { ReactNode } from "react";

// Shown in place of the new-password form when a reset link was already used
// or is past its hour. It sends nothing itself: a new link is asked for on
// /forgot-password, the one page that requests one.
export function ResetExpired(): ReactNode {
  return (
    <>
      <h1 className="text-text text-[22px] font-semibold tracking-[-0.015em]">
        This link has expired
      </h1>
      <p className="text-text-2 mt-1 mb-6 text-[14px]">
        Reset links work once and expire one hour after they&apos;re sent.
      </p>
      <Link
        href="/forgot-password"
        className="bg-text text-canvas rounded-button flex h-[44px] items-center justify-center text-[14px] font-medium hover:opacity-90 sm:h-[36px]"
      >
        Send a new link
      </Link>
      <p className="mt-4 text-center">
        <Link
          href="/sign-in"
          className="text-primary hover:text-primary-hover text-[13px] underline"
        >
          Back to sign in
        </Link>
      </p>
    </>
  );
}
