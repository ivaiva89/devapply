"use client";

import { Button } from "@/shared/ui/button";

type ResumesErrorProps = {
  error: Error;
  reset: () => void;
};

export default function ResumesError({ error, reset }: ResumesErrorProps) {
  return (
    <div className="rounded-3xl border border-danger/30 bg-surface p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-danger">
        Resumes error
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-text">
        Resume data could not be loaded.
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-text-3">
        {error.message || "An unexpected error occurred while loading resumes."}
      </p>
      <Button onClick={reset} className="mt-6" variant="outline">
        Try again
      </Button>
    </div>
  );
}
