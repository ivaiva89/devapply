import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const toneClasses = {
  neutral: "border-transparent bg-slate-800/60 text-slate-400",
  info: "border-transparent bg-blue-950/60 text-blue-300",
  warning: "border-transparent bg-violet-950/60 text-violet-300", // intentionally violet — maps to Interview status
  success: "border-transparent bg-emerald-950/60 text-emerald-300",
  danger: "border-transparent bg-red-950/60 text-red-300",
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
