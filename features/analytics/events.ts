export const analyticsEventNames = [
  "signup",
  "application_created",
  "first_application_created",
  "reminder_created",
  "resume_uploaded",
  "upgrade_clicked",
  "checkout_started",
  "checkout_success",
] as const;

export type AnalyticsEventName = (typeof analyticsEventNames)[number];

export type AnalyticsEventProperties = Record<
  string,
  boolean | null | number | string | undefined
>;
