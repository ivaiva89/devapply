"use client";

import { Button } from "@/components/ui/button";
import { DashboardErrorState } from "@/features/dashboard/components/dashboard-error-state";

type DashboardErrorProps = {
  error: Error;
  reset: () => void;
};

export default function DashboardError({
  error,
  reset,
}: DashboardErrorProps) {
  return (
    <DashboardErrorState
      description={
        error.message || "An unexpected error occurred while loading the dashboard."
      }
      action={
        <Button type="button" onClick={reset}>
          Try again
        </Button>
      }
    />
  );
}
