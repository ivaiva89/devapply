import { cn } from "@/shared/lib/utils";

const toneStyles = {
  slate:   { bg: "bg-surface-2",     text: "text-text-3",  dot: "bg-text-4"   },
  primary: { bg: "bg-primary-soft",  text: "text-primary", dot: "bg-primary"  },
  info:    { bg: "bg-info-soft",     text: "text-info",    dot: "bg-info"     },
  accent:  { bg: "bg-accent-soft",   text: "text-accent",  dot: "bg-accent"   },
  success: { bg: "bg-success-soft",  text: "text-success", dot: "bg-success"  },
  danger:  { bg: "bg-danger-soft",   text: "text-danger",  dot: "bg-danger"   },
} as const;

export type ChipTone = keyof typeof toneStyles;

type ChipProps = {
  tone: ChipTone;
  label: string;
  size?: "sm" | "default";
  className?: string;
};

export function Chip({ tone, label, size = "default", className }: ChipProps) {
  const { bg, text, dot } = toneStyles[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-chip font-mono font-medium",
        size === "sm"
          ? "px-2 py-0.5 text-[10.5px]"
          : "px-2.5 py-1 text-[11.5px]",
        bg,
        text,
        className,
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", dot)} />
      {label}
    </span>
  );
}
