import type { ReactNode } from "react";

type PageShellProps = {
  title: string;
  description: string;
  eyebrow?: string;
  children?: ReactNode;
};

export function PageShell({
  title,
  description,
  children,
}: PageShellProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-base font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      {children ? <div>{children}</div> : null}
    </div>
  );
}
