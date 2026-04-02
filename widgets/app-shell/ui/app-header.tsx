import type { ReactNode } from "react";
import { UserButton } from "@clerk/nextjs";

import { AppHeaderPresenter } from "@/widgets/app-shell/ui/app-header-presenter";

type AppHeaderProps = {
  title: string;
  description?: string;
  userControl?: ReactNode;
  userName: string;
  userEmail: string;
  planLabel: string;
};

export function AppHeader({
  title,
  description,
  userName,
  userEmail,
  planLabel,
  userControl,
}: AppHeaderProps) {
  return (
    <AppHeaderPresenter
      title={title}
      description={description}
      userName={userName}
      userEmail={userEmail}
      planLabel={planLabel}
      userControl={userControl ?? <UserButton />}
    />
  );
}
