import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function SectionHeader({
  title,
  description,
  actions,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div>
        <h2 className="text-sm font-medium text-text">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-xs text-text-3">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
