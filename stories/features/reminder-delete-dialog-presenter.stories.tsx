import type { Meta, StoryObj } from "@storybook/react";

import { ReminderDeleteDialogPresenter } from "@/features/reminders/components/reminder-delete-dialog-presenter";

const meta = {
  title: "Features/Reminders/ReminderDeleteDialogPresenter",
  component: ReminderDeleteDialogPresenter,
  args: {
    isOpen: true,
    title: "Follow up after interview",
  },
} satisfies Meta<typeof ReminderDeleteDialogPresenter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: "The reminder could not be deleted. Try again.",
  },
};

export const Pending: Story = {
  args: {
    isPending: true,
  },
};
