import type { Plan } from "@prisma/client";

export type ReminderListItem = {
  id: string;
  title: string;
  remindAt: string;
  application: {
    id: string;
    company: string;
    role: string;
  } | null;
};

export type ReminderApplicationOption = {
  id: string;
  label: string;
};

export type RemindersPageData = {
  plan: Plan;
  activeReminderCount: number;
  canCreate: boolean;
  reminders: ReminderListItem[];
  applicationOptions: ReminderApplicationOption[];
};

export type CreateReminderActionState = {
  status: "idle" | "error" | "success";
  error?: string;
};
