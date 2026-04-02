import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type FieldShellProps = {
  children: ReactNode;
  className?: string;
  description?: string;
  error?: string;
  htmlFor: string;
  label: ReactNode;
};

type FormErrorMessageProps = {
  children: ReactNode;
  className?: string;
};

export function getFieldDescriptionId(id: string) {
  return `${id}-description`;
}

export function getFieldErrorId(id: string) {
  return `${id}-error`;
}

export function getFieldDescribedBy(
  id: string,
  options: {
    description?: string | null;
    error?: string | null;
  },
) {
  const ids = [];

  if (options.description) {
    ids.push(getFieldDescriptionId(id));
  }

  if (options.error) {
    ids.push(getFieldErrorId(id));
  }

  return ids.length > 0 ? ids.join(" ") : undefined;
}

export function FieldShell({
  children,
  className,
  description,
  error,
  htmlFor,
  label,
}: FieldShellProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {description ? (
        <p
          id={getFieldDescriptionId(htmlFor)}
          className="text-xs leading-5 text-muted-foreground"
        >
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={getFieldErrorId(htmlFor)} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function FormErrorMessage({
  children,
  className,
}: FormErrorMessageProps) {
  return (
    <p
      className={cn(
        "rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive",
        className,
      )}
    >
      {children}
    </p>
  );
}
