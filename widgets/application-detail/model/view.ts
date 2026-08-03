import type { InterviewResult, InterviewType } from "@prisma/client";

import type { ApplicationDetailRecord } from "@/features/applications/server/application-detail";
import {
  applicationSourceLabels,
  applicationStatusChipTones,
  applicationStatusLabels,
  pipelineStageValues,
  type ApplicationSourceValue,
  type ApplicationStatusValue,
} from "@/entities/application/model/config";
import type { ChipTone } from "@/shared/design/chip";

const DAY_MS = 86_400_000;

const interviewTypeLabels: Record<InterviewType, string> = {
  RECRUITER_SCREEN: "Recruiter screen",
  TECHNICAL_SCREEN: "Technical screen",
  TAKE_HOME: "Take-home",
  LIVE_CODING: "Live coding",
  ONSITE: "Onsite",
  FINAL_ROUND: "Final round",
  BEHAVIORAL: "Behavioral",
  OTHER: "Interview",
};

export type DetailStepState = "done" | "active" | "upcoming";

export type DetailStep = {
  label: string;
  state: DetailStepState;
};

export type DetailTimelineTone = "default" | "accent" | "success";

export type DetailTimelineEvent = {
  id: string;
  when: string;
  label: string;
  detail?: string;
  body?: string;
  tone: DetailTimelineTone;
};

export type DetailMetaRow = {
  key: string;
  value: string;
  href?: string;
  external?: boolean;
};

export type DetailNextAction = {
  id: string;
  title: string;
  due: string;
  overdue: boolean;
};

export type ApplicationDetailView = {
  id: string;
  company: string;
  role: string;
  initials: string;
  subline: string | null;
  statusTone: ChipTone;
  statusLabel: string;
  sourceLabel: string;
  metaTimestamp: string;
  isRejected: boolean;
  steps: DetailStep[];
  timeline: DetailTimelineEvent[];
  meta: DetailMetaRow[];
  nextAction: DetailNextAction | null;
  notes: string | null;
};

function initials(company: string): string {
  return company.slice(0, 2).toUpperCase();
}

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

function relativeFromNow(value: Date, now: number): string {
  const days = Math.round((now - value.getTime()) / DAY_MS);
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  if (months === 1) return "1 month ago";
  if (months < 12) return `${months} months ago`;
  const years = Math.round(months / 12);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

function compactRelative(value: Date, now: number): string {
  const days = Math.max(0, Math.round((now - value.getTime()) / DAY_MS));
  if (days === 0) return "today";
  if (days < 30) return `${days}d`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo`;
  return `${Math.round(months / 12)}y`;
}

function dueLabel(due: Date, now: number): { text: string; overdue: boolean } {
  const days = Math.ceil((due.getTime() - now) / DAY_MS);
  const dateStr = formatDate(due);
  if (days < 0) {
    const overdueBy = Math.abs(days);
    return {
      text: `Overdue by ${overdueBy} ${overdueBy === 1 ? "day" : "days"} · ${dateStr}`,
      overdue: true,
    };
  }
  if (days === 0) return { text: `Due today · ${dateStr}`, overdue: false };
  if (days === 1) return { text: `Due tomorrow · ${dateStr}`, overdue: false };
  return { text: `Due in ${days} days · ${dateStr}`, overdue: false };
}

function formatSalary(
  min: number | null,
  max: number | null,
  currency: string,
): string | null {
  if (min == null && max == null) return null;
  const prefix = currency === "USD" ? "$" : `${currency} `;
  const compact = (n: number) =>
    n >= 1000 && n % 100 === 0 ? `${n / 1000}k` : n.toLocaleString("en-US");
  if (min != null && max != null) return `${prefix}${compact(min)}–${compact(max)}`;
  const single = (min ?? max) as number;
  return `${prefix}${compact(single)}`;
}

function resultEvent(
  typeLabel: string,
): Record<InterviewResult, { label: string; tone: DetailTimelineTone } | null> {
  return {
    PASSED: { label: `Passed ${typeLabel.toLowerCase()}`, tone: "success" },
    FAILED: { label: `${typeLabel} — did not advance`, tone: "default" },
    CANCELLED: { label: `${typeLabel} cancelled`, tone: "default" },
    PENDING: null,
  };
}

export function toApplicationDetailView(
  record: ApplicationDetailRecord,
): ApplicationDetailView {
  const now = Date.now();
  const status = record.status as ApplicationStatusValue;
  const source = record.source as ApplicationSourceValue;
  const isRejected = status === "REJECTED";

  const currentIndex = pipelineStageValues.indexOf(
    status as (typeof pipelineStageValues)[number],
  );
  const steps: DetailStep[] = pipelineStageValues.map((stage, index) => ({
    label: applicationStatusLabels[stage],
    state:
      currentIndex === -1
        ? "upcoming"
        : index < currentIndex
          ? "done"
          : index === currentIndex
            ? "active"
            : "upcoming",
  }));

  // Head timestamp — derived from real fields only.
  const metaParts: string[] = [];
  if (record.appliedDate) {
    metaParts.push(`Applied ${relativeFromNow(record.appliedDate, now)}`);
  }
  metaParts.push(`Updated ${compactRelative(record.updatedAt, now)}`);
  const metaTimestamp = metaParts.join(" · ");

  // Timeline — every event is a real record/timestamp.
  const dated: Array<{ date: Date; event: DetailTimelineEvent }> = [];

  dated.push({
    date: record.createdAt,
    event: {
      id: `created-${record.id}`,
      when: formatDate(record.createdAt),
      label: "Application added",
      detail: `${record.company} · ${record.role}`,
      tone: "default",
    },
  });

  if (record.appliedDate) {
    dated.push({
      date: record.appliedDate,
      event: {
        id: `applied-${record.id}`,
        when: formatDate(record.appliedDate),
        label: "Applied",
        detail: applicationSourceLabels[source],
        tone: "accent",
      },
    });
  }

  for (const interview of record.interviews) {
    const typeLabel = interviewTypeLabels[interview.type];
    dated.push({
      date: interview.scheduledAt,
      event: {
        id: `iv-sched-${interview.id}`,
        when: formatDate(interview.scheduledAt),
        label: `${typeLabel} scheduled`,
        detail: interview.interviewerName
          ? `with ${interview.interviewerName}`
          : interview.title,
        body: interview.notes ?? undefined,
        tone: "accent",
      },
    });
    if (interview.completedAt) {
      const outcome = resultEvent(typeLabel)[interview.result];
      if (outcome) {
        dated.push({
          date: interview.completedAt,
          event: {
            id: `iv-done-${interview.id}`,
            when: formatDate(interview.completedAt),
            label: outcome.label,
            tone: outcome.tone,
          },
        });
      }
    }
  }

  for (const reminder of record.reminders) {
    if (reminder.completedAt) {
      dated.push({
        date: reminder.completedAt,
        event: {
          id: `rem-done-${reminder.id}`,
          when: formatDate(reminder.completedAt),
          label: "Reminder completed",
          detail: reminder.title,
          tone: "success",
        },
      });
    }
  }

  const timeline = dated
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map((entry) => entry.event);

  // Details meta-list — only rows backed by real data.
  const meta: DetailMetaRow[] = [];
  if (record.location?.trim()) {
    meta.push({ key: "LOCATION", value: record.location.trim() });
  }
  const salary = formatSalary(record.salaryMin, record.salaryMax, record.currency);
  if (salary) meta.push({ key: "COMP", value: salary });
  meta.push({ key: "SOURCE", value: applicationSourceLabels[source] });
  if (record.appliedDate) {
    meta.push({ key: "APPLIED", value: formatDate(record.appliedDate) });
  }
  meta.push({ key: "CREATED", value: formatDate(record.createdAt) });
  if (record.jobUrl?.trim()) {
    let host = "View posting";
    try {
      host = new URL(record.jobUrl).hostname.replace(/^www\./, "");
    } catch {
      host = "View posting";
    }
    meta.push({
      key: "JOB POST",
      value: host,
      href: record.jobUrl,
      external: true,
    });
  }
  for (const attachment of record.attachments) {
    meta.push({ key: attachment.kind, value: attachment.label });
  }

  // Next action — soonest incomplete reminder (reminders arrive ordered by dueAt).
  const upcoming = record.reminders.find((reminder) => !reminder.completedAt);
  let nextAction: DetailNextAction | null = null;
  if (upcoming) {
    const label = dueLabel(upcoming.dueAt, now);
    nextAction = {
      id: upcoming.id,
      title: upcoming.title,
      due: label.text,
      overdue: label.overdue,
    };
  }

  return {
    id: record.id,
    company: record.company,
    role: record.role,
    initials: initials(record.company),
    subline: record.location?.trim() || null,
    statusTone: applicationStatusChipTones[status],
    statusLabel: applicationStatusLabels[status],
    sourceLabel: applicationSourceLabels[source],
    metaTimestamp,
    isRejected,
    steps,
    timeline,
    meta,
    nextAction,
    notes: record.notes?.trim() || null,
  };
}
