import Link from "next/link";

import { appNavigation } from "@/features/navigation/config";

type AppSidebarProps = {
  currentPath: string;
};

export function AppSidebar({ currentPath }: AppSidebarProps) {
  return (
    <aside className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
          DevApply
        </p>
        <h1 className="mt-2 text-lg font-semibold tracking-tight text-stone-950">
          Job Tracker MVP
        </h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          A focused workspace for managing applications, follow-ups, and resume versions.
        </p>
      </div>
      <nav className="mt-8 space-y-2">
        {appNavigation.map((item) => {
          const isActive = currentPath === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "block rounded-xl px-3 py-2 text-sm transition",
                isActive
                  ? "bg-stone-950 text-white"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-950",
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
