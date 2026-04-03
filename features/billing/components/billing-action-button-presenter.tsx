import type { ComponentProps, ReactNode } from "react";

import { Button } from "@/shared/ui/button";
import { FormErrorMessage } from "@/shared/ui/field";

type BillingActionButtonPresenterProps = {
  action?: ComponentProps<"form">["action"];
  children?: ReactNode;
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
  children,
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
      {children}
      <Button
        type={type}
        variant={variant}
        disabled={isPending}
        onClick={onClick}
        className={className}
      >
        {isPending ? pendingLabel : label}
      </Button>
      {error ? (
        <FormErrorMessage className="px-3 py-2">{error}</FormErrorMessage>
      ) : null}
    </form>
  );
}
