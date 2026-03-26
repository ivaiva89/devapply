import { UserButton } from "@clerk/nextjs";

import { Badge } from "@/components/ui/badge";

type AppHeaderProps = {
  title: string;
  description: string;
  userName: string;
  userEmail: string;
  planLabel: string;
};

export function AppHeader({
  userName,
  userEmail,
  planLabel,
}: AppHeaderProps) {
  return (
    <header className="flex h-12 items-center justify-end gap-3 border-b border-border px-6">
      <div className="flex items-center gap-2">
        <div className="text-right">
          <p className="text-sm font-medium leading-none text-foreground">
            {userName}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{userEmail}</p>
        </div>
        <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {planLabel}
        </Badge>
        <UserButton />
      </div>
    </header>
  );
}
