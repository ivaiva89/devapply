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
  eyebrow,
  children,
}: PageShellProps) {
  return (
    <section className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
      <div className="space-y-3">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-stone-950">
            {title}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-stone-600">
            {description}
          </p>
        </div>
      </div>
      {children ? <div className="mt-8">{children}</div> : null}
    </section>
  );
}
