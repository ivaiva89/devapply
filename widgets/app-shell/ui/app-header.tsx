import type { ReactNode } from "react";
import { SignOutButton } from "@clerk/nextjs";

import { AppHeaderPresenter } from "@/widgets/app-shell/ui/app-header-presenter";

type AppHeaderProps = {
  currentPath: string;
  title: string;
  description?: string;
  userControl?: ReactNode;
  userName: string;
  userEmail: string;
  planLabel: string;
};

export function AppHeader({
  currentPath,
  title,
  description,
  userName,
  userEmail,
  planLabel,
  userControl,
}: AppHeaderProps) {
  return (
    <AppHeaderPresenter
      currentPath={currentPath}
      title={title}
      description={description}
      userName={userName}
      userEmail={userEmail}
      planLabel={planLabel}
      userControl={
        userControl ?? (
          <SignOutButton>
            <button
              type="button"
              className="w-full rounded-lg border border-border/70 px-3 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Sign out
            </button>
          </SignOutButton>
        )
      }
    />
  );
}
