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

export function AppSidebarPresenter({
  currentPath,
}: AppSidebarPresenterProps) {
  return (
    <aside className="flex h-full flex-col border-r border-border bg-sidebar px-4 py-6">
      <div className="mb-8 px-2">
        <span className="text-sm font-semibold tracking-tight text-foreground">
          DevApply
        </span>
      </div>

      <nav aria-label="Primary navigation" className="flex flex-col gap-0.5">
        {appNavigation.map((item) => {
          const isActive = isItemActive(currentPath, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center rounded-md px-2 py-1.5 text-sm transition-colors duration-150",
                isActive
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
