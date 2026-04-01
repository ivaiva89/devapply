import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

type BillingActionButtonPresenterProps = {
  action?: ComponentProps<"form">["action"];
  className?: string;
  error?: string;
  isPending?: boolean;
  label: string;
  pendingLabel: string;
  type?: "submit" | "button";
  variant?: "default" | "outline";
  onClick?: () => void;
};

export function BillingActionButtonPresenter({
  action,
  className,
  error,
  isPending = false,
  label,
  pendingLabel,
  type = "submit",
  variant = "default",
  onClick,
}: BillingActionButtonPresenterProps) {
  return (
    <form action={action} className="space-y-3">
      <Button
        type={type}
        variant={variant}
        disabled={isPending}
        onClick={onClick}
        className={className}
      >
        {isPending ? pendingLabel : label}
      </Button>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </form>
  );
}
