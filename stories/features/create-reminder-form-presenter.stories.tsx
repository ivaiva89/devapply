import type { Meta, StoryObj } from "@storybook/react";

import { CreateReminderFormPresenter } from "@/features/reminders/components/create-reminder-form-presenter";
import { mockReminderApplicationOptions } from "@/tests/fixtures/ui-fixtures";

const meta = {
  title: "Features/Reminders/CreateReminderFormPresenter",
  component: CreateReminderFormPresenter,
  args: {
    applicationOptions: mockReminderApplicationOptions,
  },
} satisfies Meta<typeof CreateReminderFormPresenter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: "Choose when to remind yourself.",
  },
};
