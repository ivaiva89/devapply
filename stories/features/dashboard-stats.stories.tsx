import type { Meta, StoryObj } from "@storybook/react";

import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";

const meta = {
  title: "Features/DashboardStats",
  component: DashboardStats,
  args: {
    items: [
      { label: "Total applications", value: 42, helper: "All tracked applications" },
      { label: "Applications this month", value: 11, helper: "Created this month" },
      { label: "Interviews", value: 6, helper: "Interview status" },
      { label: "Offers", value: 1, helper: "Current offers" },
    ],
  },
} satisfies Meta<typeof DashboardStats>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
