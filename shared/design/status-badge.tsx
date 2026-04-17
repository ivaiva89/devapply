import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";

const toneClasses = {
  neutral: "border-transparent bg-surface-2 text-text-3",
  info: "border-transparent bg-blue-950/60 text-blue-300",
  warning: "border-transparent bg-warning-soft text-warning", // intentionally violet — maps to Interview status
  success: "border-transparent bg-success-soft text-success",
  danger: "border-transparent bg-danger-soft text-danger",
} as const;

type StatusBadgeProps = {
  label: string;
  tone?: keyof typeof toneClasses;
  className?: string;
};

export function StatusBadge({
  label,
  tone = "neutral",
  className,
}: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        toneClasses[tone],
        className,
      )}
    >
      {label}
    </Badge>
  );
}
