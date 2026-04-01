import type { Meta, StoryObj } from "@storybook/react";

import { RemindersEmptyState } from "@/features/reminders/components/reminders-empty-state";

const meta = {
  title: "Features/RemindersEmptyState",
  component: RemindersEmptyState,
  args: {
    canCreate: true,
  },
} satisfies Meta<typeof RemindersEmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const CanCreate: Story = {};

export const LimitReached: Story = {
  args: {
    canCreate: false,
  },
};
