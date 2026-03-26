import Link from "next/link";

import { appNavigation } from "@/features/navigation/config";

type AppSidebarProps = {
  currentPath: string;
};

export function AppSidebar({ currentPath }: AppSidebarProps) {
  return (
    <aside className="flex flex-col border-r border-border bg-sidebar px-4 py-6">
      {/* Wordmark */}
      <div className="mb-8 px-2">
        <span className="text-sm font-semibold tracking-tight text-foreground">
          DevApply
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5">
        {appNavigation.map((item) => {
          const isActive = currentPath === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center rounded-md px-2 py-1.5 text-sm transition-colors duration-150",
                isActive
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
