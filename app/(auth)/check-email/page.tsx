import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { ResendConfirmation } from "@/features/auth/ui/resend-confirmation";

export const metadata: Metadata = {
  title: "Check your email · DevApply",
};

export default async function CheckEmailPage({
  searchParams,
}: PageProps<"/check-email">): Promise<ReactNode> {
  // The sign-up form passes the address it signed up with in the query.
  const { email } = await searchParams;
  const address = typeof email === "string" && email !== "" ? email : null;

  return (
    <>
      <h1 className="text-text text-[22px] font-semibold tracking-[-0.015em]">
        Check your email
      </h1>
      <p className="text-text-2 mt-1 mb-6 text-[14px]">
        We sent a confirmation link to{" "}
        {address ? (
          <span className="text-text font-mono text-[13px]">{address}</span>
        ) : (
          "your email"
        )}
        . Open it and press Confirm to finish creating your account.
      </p>
      {address ? <ResendConfirmation email={address} /> : null}
      <p className="mt-6 text-center">
        <Link
          href="/sign-up"
          className="text-text-2 hover:text-text text-[14px] font-medium"
        >
          Use a different email
        </Link>
      </p>
    </>
  );
}
