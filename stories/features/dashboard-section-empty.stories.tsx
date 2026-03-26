import type { Meta, StoryObj } from "@storybook/react";

import { DashboardSectionEmpty } from "@/features/dashboard/components/dashboard-section-empty";

const meta = {
  title: "Features/DashboardSectionEmpty",
  component: DashboardSectionEmpty,
  args: {
    title: "No reminders scheduled",
    description: "Upcoming reminders will appear here once follow-ups are created.",
  },
} satisfies Meta<typeof DashboardSectionEmpty>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
