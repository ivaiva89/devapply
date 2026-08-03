"use client";

import { Button } from "@/shared/ui/button";

type ApplicationDetailErrorProps = {
  error: Error;
  reset: () => void;
};

export default function ApplicationDetailError({
  error,
  reset,
}: ApplicationDetailErrorProps) {
  return (
    <div className="rounded-card border border-danger/30 bg-surface p-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-danger">
        Application error
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-text">
        This application could not be loaded.
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-text-3">
        {error.message ||
          "An unexpected error occurred while loading this application."}
      </p>
      <Button onClick={reset} className="mt-6" variant="outline">
        Try again
      </Button>
    </div>
  );
}
