import type { DeleteReminderActionState } from "@/features/reminders/types";

export function getDeleteReminderInitialState(): DeleteReminderActionState {
  return {
    status: "idle",
  };
}
