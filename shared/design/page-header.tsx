import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumb?: string;
  className?: string;
};

export function PageHeader({ title, description, actions, breadcrumb, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      {breadcrumb ? (
        <div className="mb-2 flex items-center gap-2 font-mono text-[11px] text-text-3">
          <span>Workspace</span>
          <span className="text-text-4">/</span>
          <span className="capitalize text-text">{breadcrumb}</span>
          <span className="ml-auto inline-flex items-center rounded-xs border border-border bg-surface-2 px-1.5 py-0.5 text-[10.5px] text-text-3">
            ⌘K to search
          </span>
        </div>
      ) : null}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">{title}</h1>
          {description ? (
            <p className="mt-0.5 text-sm text-text-3">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
