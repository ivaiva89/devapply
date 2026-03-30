import {
  applicationSourceLabels,
  type ApplicationSourceValue,
  type ApplicationStatusValue,
} from "@/features/applications/config";
import type { ApplicationCardData } from "@/features/applications/components/application-card";
import type { ApplicationTableRow } from "@/features/applications/components/applications-table";
import type { ReminderApplicationOption, ReminderListItem } from "@/features/reminders/types";
import type { ResumeApplicationOption, ResumeListItem } from "@/features/resumes/types";

type DashboardKpiItem = {
  label: string;
  value: number;
  helper: string;
};

type DashboardChartItem = {
  label: string;
  count: number;
};

type DashboardConversionItem = {
  label: string;
  value: string;
  helper: string;
};

type StatusDistributionItem = {
  status: ApplicationStatusValue;
  count: number;
  percentage: number;
};

type RecentApplicationItem = {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatusValue;
  updatedAt: string;
};

type UpcomingReminderItem = {
  id: string;
  title: string;
  dueAt: string;
  company: string | null;
};

type PipelineColumnFixture = {
  label: string;
  status: ApplicationStatusValue;
  items: ApplicationCardData[];
};

function createApplicationRow(input: {
  id: string;
  company: string;
  role: string;
  location: string;
  status: ApplicationStatusValue;
  appliedDate: string;
  source: ApplicationSourceValue;
  lastActivity: string;
}): ApplicationTableRow {
  return {
    ...input,
    sourceLabel: applicationSourceLabels[input.source],
  };
}

export const mockDashboardKpis: DashboardKpiItem[] = [
  { label: "Total applications", value: 42, helper: "All tracked applications" },
  {
    label: "Applications this month",
    value: 11,
    helper: "Created since the first of the month",
  },
  { label: "Interviews", value: 6, helper: "Current interview-stage roles" },
  { label: "Offers", value: 1, helper: "Active offer-stage roles" },
];

export const mockApplicationsOverTime: DashboardChartItem[] = [
  { label: "Oct", count: 3 },
  { label: "Nov", count: 5 },
  { label: "Dec", count: 7 },
  { label: "Jan", count: 9 },
  { label: "Feb", count: 11 },
  { label: "Mar", count: 7 },
];

export const mockApplicationsStatusDistribution: StatusDistributionItem[] = [
  { status: "WISHLIST", count: 8, percentage: 19 },
  { status: "APPLIED", count: 18, percentage: 43 },
  { status: "INTERVIEW", count: 10, percentage: 24 },
  { status: "OFFER", count: 3, percentage: 7 },
  { status: "REJECTED", count: 3, percentage: 7 },
];

export const mockDashboardConversions: DashboardConversionItem[] = [
  {
    label: "Response rate",
    value: "31%",
    helper: "Interview, offer, or rejected",
  },
  {
    label: "Interview conversion",
    value: "24%",
    helper: "Current interview and offer pipeline",
  },
  {
    label: "Offer conversion",
    value: "7%",
    helper: "Offers out of total applications",
  },
  {
    label: "Active pipeline",
    value: "86%",
    helper: "Wishlist, applied, and interview statuses",
  },
];

export const mockRecentApplications: RecentApplicationItem[] = [
  {
    id: "app-1",
    company: "Vercel",
    role: "Product Engineer",
    status: "INTERVIEW",
    updatedAt: "2026-03-18T12:00:00.000Z",
  },
  {
    id: "app-2",
    company: "Linear",
    role: "Frontend Engineer",
    status: "APPLIED",
    updatedAt: "2026-03-16T12:00:00.000Z",
  },
  {
    id: "app-3",
    company: "Ramp",
    role: "Software Engineer",
    status: "WISHLIST",
    updatedAt: "2026-03-15T12:00:00.000Z",
  },
];

export const mockUpcomingReminders: UpcomingReminderItem[] = [
  {
    id: "reminder-1",
    title: "Follow up with recruiter",
    dueAt: "2026-03-22T10:00:00.000Z",
    company: "Vercel",
  },
  {
    id: "reminder-2",
    title: "Send thank-you note",
    dueAt: "2026-03-24T14:00:00.000Z",
    company: "Linear",
  },
  {
    id: "reminder-3",
    title: "Check application status",
    dueAt: "2026-03-26T09:00:00.000Z",
    company: null,
  },
];

export const mockApplicationTableRows: ApplicationTableRow[] = [
  createApplicationRow({
    id: "app-1",
    company: "Vercel",
    role: "Product Engineer",
    location: "Remote - US",
    status: "INTERVIEW",
    appliedDate: "Mar 10, 2026",
    source: "COMPANY_SITE",
    lastActivity: "Mar 18, 2026",
  }),
  createApplicationRow({
    id: "app-2",
    company: "Linear",
    role: "Frontend Engineer",
    location: "New York, NY",
    status: "APPLIED",
    appliedDate: "Mar 8, 2026",
    source: "REFERRAL",
    lastActivity: "Mar 16, 2026",
  }),
  createApplicationRow({
    id: "app-3",
    company: "Ramp",
    role: "Software Engineer",
    location: "Remote",
    status: "WISHLIST",
    appliedDate: "Mar 3, 2026",
    source: "LINKEDIN",
    lastActivity: "Mar 15, 2026",
  }),
  createApplicationRow({
    id: "app-4",
    company: "PostHog",
    role: "Fullstack Engineer",
    location: "Remote - EMEA",
    status: "OFFER",
    appliedDate: "Feb 27, 2026",
    source: "OTHER",
    lastActivity: "Mar 14, 2026",
  }),
];

export const mockApplicationCard: ApplicationCardData = {
  id: "card-1",
  company: "Vercel",
  role: "Product Engineer",
  appliedDate: "Mar 10, 2026",
  sourceLabel: "Company site",
  updatedAt: "Mar 18, 2026",
};

export const mockPipelineColumns: PipelineColumnFixture[] = [
  {
    label: "Wishlist",
    status: "WISHLIST",
    items: [
      {
        id: "wishlist-1",
        company: "Ramp",
        role: "Product Engineer",
        appliedDate: "Not applied",
        sourceLabel: "Referral",
        updatedAt: "Mar 15, 2026",
      },
    ],
  },
  {
    label: "Applied",
    status: "APPLIED",
    items: [
      {
        id: "applied-1",
        company: "Linear",
        role: "Frontend Engineer",
        appliedDate: "Mar 8, 2026",
        sourceLabel: "Company site",
        updatedAt: "Mar 16, 2026",
      },
      {
        id: "applied-2",
        company: "Figma",
        role: "Design Engineer",
        appliedDate: "Mar 6, 2026",
        sourceLabel: "LinkedIn",
        updatedAt: "Mar 13, 2026",
      },
    ],
  },
  {
    label: "Interview",
    status: "INTERVIEW",
    items: [
      {
        id: "interview-1",
        company: "Vercel",
        role: "Product Engineer",
        appliedDate: "Mar 10, 2026",
        sourceLabel: "Company site",
        updatedAt: "Mar 18, 2026",
      },
    ],
  },
  {
    label: "Offer",
    status: "OFFER",
    items: [
      {
        id: "offer-1",
        company: "PostHog",
        role: "Fullstack Engineer",
        appliedDate: "Feb 27, 2026",
        sourceLabel: "Other",
        updatedAt: "Mar 14, 2026",
      },
    ],
  },
  {
    label: "Rejected",
    status: "REJECTED",
    items: [],
  },
];

export const mockReminderListItems: ReminderListItem[] = [
  {
    id: "reminder-list-1",
    title: "Follow up after interview",
    remindAt: "2026-03-20T10:30:00.000Z",
    application: {
      id: "app-1",
      company: "Vercel",
      role: "Product Engineer",
    },
  },
  {
    id: "reminder-list-2",
    title: "Check in on referral",
    remindAt: "2026-03-24T14:00:00.000Z",
    application: null,
  },
];

export const mockReminderApplicationOptions: ReminderApplicationOption[] = [
  { id: "app-1", label: "Vercel - Product Engineer" },
  { id: "app-2", label: "Linear - Frontend Engineer" },
  { id: "app-3", label: "Ramp - Software Engineer" },
];

export const mockResumeApplicationOptions: ResumeApplicationOption[] = [
  { id: "app-1", label: "Vercel - Product Engineer" },
  { id: "app-2", label: "Linear - Frontend Engineer" },
  { id: "app-3", label: "Ramp - Product Engineer" },
];

export const mockResumeListItems: ResumeListItem[] = [
  {
    id: "resume-1",
    title: "Product engineering resume",
    fileName: "product-engineering-resume.pdf",
    fileUrl: "#resume-1",
    mimeType: "application/pdf",
    fileSizeBytes: 248000,
    uploadedAt: "2026-03-02T11:30:00.000Z",
    attachedApplications: [
      {
        id: "app-1",
        company: "Vercel",
        role: "Product Engineer",
      },
      {
        id: "app-2",
        company: "Linear",
        role: "Frontend Engineer",
      },
    ],
  },
  {
    id: "resume-2",
    title: "Fullstack systems resume",
    fileName: "fullstack-systems-resume.pdf",
    fileUrl: "#resume-2",
    mimeType: "application/pdf",
    fileSizeBytes: 312000,
    uploadedAt: "2026-02-18T16:15:00.000Z",
    attachedApplications: [],
  },
];
