import { cn } from "@/shared/lib/utils";
import type { InputHTMLAttributes } from "react";

type DesignInputProps = InputHTMLAttributes<HTMLInputElement>;

export function DesignInput({ className, ...props }: DesignInputProps) {
  return (
    <input
      className={cn(
        "h-8 w-full rounded-input border border-border bg-surface-1 px-3 text-sm text-text placeholder:text-text-4",
        "transition-colors duration-[120ms]",
        "hover:border-border-strong",
        "focus-visible:outline-2 focus-visible:outline-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 focus-visible:bg-surface",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
