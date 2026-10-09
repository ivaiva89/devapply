import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { ConfirmEmailButton } from "@/features/auth/ui/confirm-email-button";

export const metadata: Metadata = {
  title: "Confirm your email · DevApply",
};

// The token is a JWT whose payload names the address. It is read here for
// display only, unverified; the button's request is what checks it.
function addressInToken(token: string): string | null {
  const payload = token.split(".")[1];
  if (!payload) return null;
  try {
    const claims: unknown = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );
    if (claims && typeof claims === "object" && "email" in claims) {
      return typeof claims.email === "string" ? claims.email : null;
    }
  } catch {
    // Not a token we can read: the page still offers the button.
  }
  return null;
}

export default async function ConfirmEmailPage({
  searchParams,
}: PageProps<"/confirm-email">): Promise<ReactNode> {
  const { token } = await searchParams;

  if (typeof token !== "string" || token === "") {
    return (
      <>
        <h1 className="text-text text-[22px] font-semibold tracking-[-0.015em]">
          Confirm your email
        </h1>
        <p className="text-text-2 mt-1 text-[14px]">
          This link is incomplete. Open the link from your confirmation email,
          or{" "}
          <Link
            href="/sign-up"
            className="text-primary hover:text-primary-hover underline"
          >
            sign up again
          </Link>
          .
        </p>
      </>
    );
  }

  const email = addressInToken(token);

  return (
    <>
      <h1 className="text-text text-[22px] font-semibold tracking-[-0.015em]">
        Confirm your email
      </h1>
      <p className="text-text-2 mt-1 mb-6 text-[14px]">
        Press the button to confirm{" "}
        {email ? (
          <span className="text-text font-mono text-[13px]">{email}</span>
        ) : (
          "your email"
        )}{" "}
        and sign in.
      </p>
      <ConfirmEmailButton token={token} email={email} />
    </>
  );
}
