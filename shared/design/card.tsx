import { cn } from "@/shared/lib/utils";
import type { HTMLAttributes } from "react";

type DesignCardProps = HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
};

export function DesignCard({ interactive, className, children, ...props }: DesignCardProps) {
  return (
    <div
      className={cn(
        "bg-surface border border-border rounded-card p-4",
        interactive &&
          "cursor-pointer transition-all duration-[120ms] hover:border-border-strong hover:shadow-sm hover:-translate-y-px",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
