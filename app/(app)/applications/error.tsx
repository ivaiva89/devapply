"use client";

import { Button } from "@/shared/ui/button";

type ApplicationsErrorProps = {
  error: Error;
  reset: () => void;
};

export default function ApplicationsError({
  error,
  reset,
}: ApplicationsErrorProps) {
  return (
    <div className="rounded-3xl border border-danger/30 bg-surface p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-danger">
        Applications error
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-text">
        The applications list could not be loaded.
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-text-3">
        {error.message ||
          "An unexpected error occurred while loading applications."}
      </p>
      <Button onClick={reset} className="mt-6" variant="outline">
        Try again
      </Button>
    </div>
  );
}
