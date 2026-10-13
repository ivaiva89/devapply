import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { SignUpForm } from "@/features/auth/ui/sign-up-form";

export const metadata: Metadata = {
  title: "Sign up · DevApply",
};

// Which providers are offered is read per request, so this page is rendered
// per request, as /sign-in is.
export const dynamic = "force-dynamic";

export default async function SignUpPage(): Promise<ReactNode> {
  // Loaded here, not at the top: `next build` evaluates this module, and has
  // no environment for the server code to load with.
  const { offeredProviders } =
    await import("@/shared/lib/auth/offered-providers");

  return (
    <>
      <h1 className="text-text text-[22px] font-semibold tracking-[-0.015em]">
        Create your account
      </h1>
      <p className="text-text-2 mt-1 mb-6 text-[14px]">
        Track every application and interview round. Your first 14 days include
        Pro.
      </p>
      <SignUpForm providers={offeredProviders()} />
      <p className="text-text-2 mt-6 text-center text-[14px]">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="text-primary hover:text-primary-hover underline"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
