import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ResetExpired } from "@/features/auth/ui/reset-expired";
import { ResetPasswordForm } from "@/features/auth/ui/reset-password-form";
import { isResetTokenUsable } from "@/shared/lib/auth/server";

export const metadata: Metadata = {
  title: "Set a new password · DevApply",
};

export default async function ResetPasswordPage({
  searchParams,
}: PageProps<"/reset-password">): Promise<ReactNode> {
  const { token } = await searchParams;

  // Opening the link only asks whether its token can still be used. The
  // form's button is what uses it up.
  if (
    typeof token !== "string" ||
    token === "" ||
    !(await isResetTokenUsable(token))
  ) {
    return <ResetExpired />;
  }

  return (
    <>
      <h1 className="text-text text-[22px] font-semibold tracking-[-0.015em]">
        Set a new password
      </h1>
      <p className="text-text-2 mt-1 mb-6 text-[14px]">
        This link works once and expires one hour after it was sent.
      </p>
      <ResetPasswordForm token={token} />
    </>
  );
}
