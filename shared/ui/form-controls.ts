import { cn } from "@/shared/lib/utils";

export const compactControlClassName =
  "h-8 rounded-lg px-2.5 py-1 text-sm shadow-none focus-visible:ring-3 focus-visible:ring-ring/50";

export const nativePickerAffordanceClassName =
  "[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70";

export function getCompactFieldControlClassName(error?: string) {
  return cn(
    compactControlClassName,
    error
      ? "border-destructive/50 focus-visible:border-destructive focus-visible:ring-destructive/20"
      : "border-input focus-visible:border-ring",
  );
}
