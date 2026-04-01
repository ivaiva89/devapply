import type { Meta, StoryObj } from "@storybook/react";

import { UpcomingRemindersCard } from "@/features/dashboard/components/upcoming-reminders-card";
import { mockUpcomingReminders } from "@/lib/mocks/ui-fixtures";

const meta = {
  title: "Features/Dashboard/UpcomingRemindersCard",
  component: UpcomingRemindersCard,
  args: {
    items: mockUpcomingReminders,
  },
} satisfies Meta<typeof UpcomingRemindersCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    items: [],
  },
};
