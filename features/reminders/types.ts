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

export type DeleteReminderActionState = {
  status: "idle" | "error" | "success";
  error?: string;
};

export type ReminderFormValues = {
  title: string;
  remindAt: string;
  applicationId: string;
};

export type UpdateReminderActionState = {
  status: "idle" | "error" | "success";
  error?: string;
  values: ReminderFormValues;
};
