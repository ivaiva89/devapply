import type { Meta, StoryObj } from "@storybook/react";

import { CreateReminderFormPresenter } from "@/features/reminders/components/create-reminder-form-presenter";
import { mockReminderApplicationOptions } from "@/shared/mocks/ui-fixtures";

const meta = {
  title: "Features/Reminders/CreateReminderFormPresenter",
  component: CreateReminderFormPresenter,
  args: {
    applicationOptions: mockReminderApplicationOptions,
    canCreate: true,
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

export const DisabledByPlan: Story = {
  args: {
    canCreate: false,
  },
};
