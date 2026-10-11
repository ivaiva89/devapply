import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { ForgotPasswordForm } from "@/features/auth/ui/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset your password · DevApply",
};

export default function ForgotPasswordPage(): ReactNode {
  return (
    <>
      <h1 className="text-text text-[22px] font-semibold tracking-[-0.015em]">
        Reset your password
      </h1>
      <ForgotPasswordForm />
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
