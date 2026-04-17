import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type EmptyStateProps = {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
  compact?: boolean;
};

export function EmptyState({
  eyebrow,
  title,
  description,
  action,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-border text-center",
        compact ? "py-8" : "py-16",
      )}
    >
      {eyebrow ? (
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-text-3">
          {eyebrow}
        </p>
      ) : null}
      <p className="text-sm font-medium text-text">{title}</p>
      <p className="mt-1 max-w-sm text-xs leading-5 text-text-3">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
