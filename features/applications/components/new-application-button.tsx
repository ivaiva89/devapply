"use client";

import { Button } from "@/shared/ui/button";
import { requestNewApplication } from "@/shared/lib/app-commands";

type NewApplicationButtonProps = {
  label?: string;
  variant?: "primary" | "outline";
};

/**
 * Opens the global new-application modal (owned by AppCommandLayer) and shows
 * the ⌘N hotkey hint. Usable from any page without prop drilling the modal.
 */
export function NewApplicationButton({
  label = "New application",
  variant = "primary",
}: NewApplicationButtonProps) {
  return (
    <Button
      type="button"
      variant={variant === "outline" ? "outline" : "default"}
      onClick={requestNewApplication}
    >
      {label}
      <span className="font-mono text-xs opacity-60">⌘N</span>
    </Button>
  );
}
