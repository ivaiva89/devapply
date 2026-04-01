import Image from "next/image";
import Link from "next/link";

import { appNavigation } from "@/features/navigation/config";
import { cn } from "@/lib/utils";

type AppSidebarPresenterProps = {
  currentPath: string;
};

function isItemActive(currentPath: string, href: string) {
  if (href === "/dashboard") {
    return currentPath === href;
  }

  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export function AppSidebarPresenter({ currentPath }: AppSidebarPresenterProps) {
  return (
    <aside className="flex h-full flex-col bg-sidebar">
      {/* Logo — same height as header (h-10) so it aligns across the shell */}
      <div className="flex h-10 items-center gap-2 px-4">
        <Image
          src="/devapply-logo-optimized.svg"
          alt="DevApply"
          width={20}
          height={20}
          className="shrink-0"
        />
        <span className="font-display text-[15px] font-semibold tracking-tight text-foreground">
          DevApply
        </span>
      </div>

      <nav
        aria-label="Primary navigation"
        className="flex flex-col gap-px p-2 pt-3"
      >
        {appNavigation.map((item) => {
          const isActive = isItemActive(currentPath, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors duration-100",
                isActive
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "size-4 shrink-0",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
