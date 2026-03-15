export const analyticsEventNames = [
  "signup",
  "application_created",
  "reminder_created",
  "resume_uploaded",
  "upgrade_clicked",
  "checkout_started",
] as const;

export type AnalyticsEventName = (typeof analyticsEventNames)[number];

export type AnalyticsEventProperties = Record<
  string,
  boolean | null | number | string | undefined
>;
