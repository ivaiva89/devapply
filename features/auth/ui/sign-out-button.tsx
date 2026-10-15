"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

import { authClient } from "@/shared/lib/auth/client";

// Ends the session on this device and goes to sign in.
export function SignOutButton(): ReactNode {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleClick(): Promise<void> {
    // A second press while the first is in flight sends nothing.
    if (isSigningOut) return;
    setIsSigningOut(true);
    const { error } = await authClient.signOut();
    if (error) {
      // Still signed in, so the button comes back.
      setIsSigningOut(false);
      return;
    }
    // Replaces the page, so Back does not return to a signed-in one.
    router.replace("/sign-in");
  }

  return (
    <button
      type="button"
      disabled={isSigningOut}
      onClick={() => void handleClick()}
      className="border-border-strong bg-surface text-text hover:bg-surface-2 rounded-button h-[44px] border px-3 text-[14px] font-medium disabled:opacity-60 sm:h-[36px]"
    >
      Sign out
    </button>
  );
}
