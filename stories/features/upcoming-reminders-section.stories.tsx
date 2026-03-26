import type { Meta, StoryObj } from "@storybook/react";

import { UpcomingRemindersSection } from "@/features/dashboard/components/upcoming-reminders-section";
import { mockUpcomingReminders } from "@/lib/mocks/ui-fixtures";

const meta = {
  title: "Features/UpcomingRemindersSection",
  component: UpcomingRemindersSection,
  args: {
    items: mockUpcomingReminders,
  },
} satisfies Meta<typeof UpcomingRemindersSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    items: [],
  },
};
