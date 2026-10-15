import Link from "next/link";
import type { ReactNode } from "react";

interface LockedNoticeProps {
  // The other ways in the form offers, placed between the message and Reset
  // password.
  children?: ReactNode;
}

// Shown in place of the sign-in form once password sign-in is locked. The
// lock covers the password only, so the other ways in stay on offer.
export function LockedNotice({ children }: LockedNoticeProps): ReactNode {
  return (
    <div className="flex flex-col gap-4">
      <p
        role="alert"
        className="bg-danger-soft text-danger rounded-card px-3 py-[10px] text-[13px] leading-[1.5]"
      >
        Password sign-in is paused for this account for 15 minutes after five
        failed attempts. You can still continue with GitHub or Google, or reset
        your password.
      </p>
      {children}
      <Link
        href="/forgot-password"
        className="border-border-strong bg-surface text-text hover:bg-surface-2 rounded-button flex h-[44px] items-center justify-center border text-[14px] font-medium sm:h-[36px]"
      >
        Reset password
      </Link>
    </div>
  );
}
