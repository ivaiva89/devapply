import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SignOutButton } from "@/features/auth/ui/sign-out-button";
import { TimezoneForm } from "@/features/timezone/ui/timezone-form";
import { currentUserScope } from "@/shared/db/scoped";

export const metadata: Metadata = {
  title: "Settings · DevApply",
};

export default async function SettingsPage(): Promise<ReactNode> {
  const scope = await currentUserScope();
  const { timezone } = await scope.readAccount();

  return (
    <>
      <h1 className="text-text text-[22px] font-semibold tracking-[-0.015em]">
        Settings
      </h1>
      <p className="text-text-3 text-[13px]">Your account</p>
      {/* 640px is the design's section width; it has no token. */}
      <div className="mt-5 flex max-w-[640px] flex-col gap-5">
        <TimezoneForm timezone={timezone} />
        <section className="border-border bg-surface rounded-card flex flex-col items-start gap-4 border p-5">
          <h2 className="text-text text-[16px] font-semibold tracking-[-0.01em]">
            Account
          </h2>
          <SignOutButton />
        </section>
      </div>
    </>
  );
}
