import type { Meta, StoryObj } from "@storybook/react";

import { ReminderEditDialogPresenter } from "@/features/reminders/components/reminder-edit-dialog-presenter";
import { mockReminderApplicationOptions } from "@/lib/mocks/ui-fixtures";

const meta = {
  title: "Features/Reminders/ReminderEditDialogPresenter",
  component: ReminderEditDialogPresenter,
  args: {
    applicationOptions: mockReminderApplicationOptions,
    isOpen: true,
    values: {
      applicationId: "app-1",
      remindAt: "2026-03-20T10:30",
      title: "Follow up after interview",
    },
  },
} satisfies Meta<typeof ReminderEditDialogPresenter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: "Choose a valid reminder date and time.",
  },
};

export const Pending: Story = {
  args: {
    isPending: true,
  },
};
