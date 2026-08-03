import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Chip } from "@/shared/design/chip";
import { DesignCard } from "@/shared/design/card";
import { cn } from "@/shared/lib/utils";
import type {
  ApplicationDetailView,
  DetailStepState,
  DetailTimelineTone,
} from "@/widgets/application-detail/model/view";

type ApplicationDetailProps = {
  view: ApplicationDetailView;
  actions?: ReactNode;
};

const stepStateStyles: Record<
  DetailStepState,
  { wrap: string; dot: string }
> = {
  done: { wrap: "text-text-2", dot: "bg-success" },
  active: {
    wrap: "bg-surface text-text font-semibold shadow-sm",
    dot: "bg-primary ring-[3px] ring-primary/25",
  },
  upcoming: { wrap: "text-text-3", dot: "bg-text-4" },
};

const timelineDotStyles: Record<DetailTimelineTone, string> = {
  default: "bg-surface-2 shadow-[0_0_0_1px_var(--color-border)]",
  accent: "bg-primary shadow-[0_0_0_1px_var(--color-primary)]",
  success: "bg-success shadow-[0_0_0_1px_var(--color-success)]",
};

function PanelHeading({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <h2 className="text-base font-semibold text-text">{title}</h2>
      {action}
    </div>
  );
}

export function ApplicationDetail({ view, actions }: ApplicationDetailProps) {
  return (
    <div className="min-w-0">
      <nav className="mb-4 flex items-center gap-2 font-mono text-[11px] text-text-3">
        <Link
          href="/applications"
          className="rounded-xs hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Applications
        </Link>
        <span className="text-text-4">/</span>
        <span className="truncate text-text">{view.company}</span>
      </nav>

      <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3.5">
          <span className="grid size-11 shrink-0 place-items-center rounded-card bg-surface-2 font-mono text-lg font-bold text-text">
            {view.initials}
          </span>
          <div className="min-w-0">
            <h1 className="text-[22px] font-semibold tracking-tight text-text">
              {view.company} · {view.role}
            </h1>
            {view.subline ? (
              <p className="mt-0.5 text-[13px] text-text-3">{view.subline}</p>
            ) : null}
            <div className="mt-2 flex flex-wrap items-center gap-2.5">
              <Chip tone={view.statusTone} label={view.statusLabel} />
              <Chip tone="slate" label={view.sourceLabel} />
              <span className="font-mono text-[11.5px] tabular-nums text-text-4">
                {view.metaTimestamp}
              </span>
            </div>
          </div>
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </header>

      <ol
        className="mb-5 grid grid-cols-5 gap-1 rounded-card border border-border bg-surface-1 p-1.5"
        aria-label="Pipeline stage"
      >
        {view.steps.map((step) => {
          const styles = stepStateStyles[step.state];
          return (
            <li
              key={step.label}
              aria-current={step.state === "active" ? "step" : undefined}
              className={cn(
                "flex min-h-11 items-center justify-center gap-2 rounded-button px-2 text-center font-mono text-[11px] sm:text-xs",
                styles.wrap,
              )}
            >
              <span
                className={cn("size-1.5 shrink-0 rounded-full", styles.dot)}
              />
              <span className="truncate">{step.label}</span>
            </li>
          );
        })}
      </ol>
      {view.isRejected ? (
        <p className="mb-5 -mt-3 font-mono text-[11px] text-text-4">
          This application is closed — no active pipeline stage.
        </p>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <DesignCard className="p-5">
          <PanelHeading title="Timeline" />
          {view.timeline.length > 0 ? (
            <ol className="relative pl-6">
              <span
                aria-hidden
                className="absolute left-[7px] top-1.5 bottom-1.5 w-px bg-border"
              />
              {view.timeline.map((event) => (
                <li
                  key={event.id}
                  className="relative flex flex-col gap-1 pb-4 pt-2.5 last:pb-0"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute -left-[17px] top-3.5 size-[9px] rounded-full border-2 border-canvas",
                      timelineDotStyles[event.tone],
                    )}
                  />
                  <span className="font-mono text-[11px] text-text-4">
                    {event.when}
                  </span>
                  <span className="text-[13.5px] text-text">
                    <span className="font-semibold">{event.label}</span>
                    {event.detail ? (
                      <span className="text-text-2"> {event.detail}</span>
                    ) : null}
                  </span>
                  {event.body ? (
                    <p className="mt-1.5 rounded-button border border-border bg-surface-1 px-3 py-2.5 text-[12.5px] leading-relaxed text-text-2">
                      {event.body}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-[12.5px] text-text-3">
              No activity recorded yet.
            </p>
          )}
        </DesignCard>

        <div className="flex flex-col gap-3">
          <DesignCard className="p-5">
            <PanelHeading title="Details" />
            {view.meta.length > 0 ? (
              <dl className="flex flex-col">
                {view.meta.map((row) => (
                  <div
                    key={`${row.key}-${row.value}`}
                    className="flex items-center justify-between gap-4 border-t border-border py-2.5 text-[12.5px] first:border-t-0"
                  >
                    <dt className="font-mono text-[11.5px] text-text-3">
                      {row.key}
                    </dt>
                    <dd className="min-w-0 truncate text-right font-medium text-text">
                      {row.href ? (
                        <a
                          href={row.href}
                          target={row.external ? "_blank" : undefined}
                          rel={
                            row.external ? "noopener noreferrer" : undefined
                          }
                          className="inline-flex items-center gap-1 text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          {row.value}
                          {row.external ? (
                            <ArrowUpRight className="size-3.5" />
                          ) : null}
                        </a>
                      ) : (
                        row.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-[12.5px] text-text-3">No details recorded.</p>
            )}
          </DesignCard>

          <DesignCard className="p-5">
            <PanelHeading
              title="Next action"
              action={
                <Link
                  href="/reminders"
                  className="rounded-xs font-mono text-[11px] text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  All reminders →
                </Link>
              }
            />
            {view.nextAction ? (
              <div className="flex flex-col gap-1.5">
                <p className="text-[13.5px] font-medium text-text">
                  {view.nextAction.title}
                </p>
                <p
                  className={cn(
                    "font-mono text-[12px]",
                    view.nextAction.overdue ? "text-warning" : "text-text-3",
                  )}
                >
                  {view.nextAction.due}
                </p>
              </div>
            ) : (
              <p className="text-[12.5px] text-text-3">
                No upcoming reminders for this application.
              </p>
            )}
          </DesignCard>

          <DesignCard className="p-5">
            <PanelHeading title="Notes" />
            {view.notes ? (
              <p className="whitespace-pre-line text-[12.5px] leading-relaxed text-text-2">
                {view.notes}
              </p>
            ) : (
              <p className="text-[12.5px] text-text-3">No notes yet.</p>
            )}
          </DesignCard>
        </div>
      </div>
    </div>
  );
}
