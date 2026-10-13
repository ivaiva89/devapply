import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { currentUserScope } from "@/shared/db/scoped";
import { returnPath } from "@/shared/lib/auth/return-path";
import { TimezoneConfirm } from "@/widgets/timezone-confirm/ui/timezone-confirm";

export const metadata: Metadata = {
  title: "Confirm your timezone · DevApply",
};

export default async function SignUpTimezonePage({
  searchParams,
}: PageProps<"/sign-up/timezone">): Promise<ReactNode> {
  const { returnTo } = await searchParams;
  const requested = typeof returnTo === "string" ? returnTo : undefined;

  const scope = await currentUserScope();
  const { timezone } = await scope.readAccount();

  // An account that has a timezone, `UTC` included, has nothing to confirm:
  // it goes back to where it came from and nothing is saved.
  if (timezone !== null) redirect(returnPath(requested));

  return <TimezoneConfirm returnTo={requested} />;
}
