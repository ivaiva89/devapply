"use client";

import { Button } from "@/shared/ui/button";

type PipelineErrorProps = {
  error: Error;
  reset: () => void;
};

export default function PipelineError({ error, reset }: PipelineErrorProps) {
  return (
    <div className="rounded-3xl border border-destructive/30 bg-card p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-destructive">
        Pipeline error
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
        The pipeline board could not be loaded.
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        {error.message ||
          "An unexpected error occurred while loading the board."}
      </p>
      <Button onClick={reset} className="mt-6" variant="outline">
        Try again
      </Button>
    </div>
  );
}
