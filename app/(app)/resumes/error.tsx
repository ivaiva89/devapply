"use client";

import { Button } from "@/components/ui/button";

type ResumesErrorProps = {
  error: Error;
  reset: () => void;
};

export default function ResumesError({ error, reset }: ResumesErrorProps) {
  return (
    <div className="rounded-3xl border border-destructive/30 bg-card p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-destructive">
        Resumes error
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
        Resume data could not be loaded.
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        {error.message || "An unexpected error occurred while loading resumes."}
      </p>
      <Button onClick={reset} className="mt-6" variant="outline">
        Try again
      </Button>
    </div>
  );
}
