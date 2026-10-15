import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { SignInForm } from "@/features/auth/ui/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in · DevApply",
};

// A query value that was given once.
function single(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export default async function SignInPage({
  searchParams,
}: PageProps<"/sign-in">): Promise<ReactNode> {
  // proxy.ts carries the route a signed-out visitor asked for in the query. A
  // social sign-in that did not finish comes back with `error`, and with the
  // `provider` its button named.
  const { returnTo, error, provider } = await searchParams;
  const failed = single(error);

  // Loaded here, not at the top: `next build` evaluates this module, and has
  // no environment for the server code to load with.
  const { offeredProviders } =
    await import("@/shared/lib/auth/offered-providers");

  return (
    <>
      <h1 className="text-text mb-6 text-[22px] font-semibold tracking-[-0.015em]">
        Sign in<span className="max-sm:hidden"> to DevApply</span>
      </h1>
      <SignInForm
        returnTo={single(returnTo)}
        providers={offeredProviders()}
        oauthFailure={
          failed ? { code: failed, provider: single(provider) } : undefined
        }
        footer={
          <p className="text-text-2 mt-6 text-center text-[14px]">
            New here?{" "}
            <Link
              href="/sign-up"
              className="text-primary hover:text-primary-hover underline"
            >
              Create an account
            </Link>
          </p>
        }
      />
    </>
  );
}
