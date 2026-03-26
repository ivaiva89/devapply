import type { Meta, StoryObj } from "@storybook/react";

import { mockDashboardKpis } from "@/lib/mocks/ui-fixtures";
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";

const meta = {
  title: "Features/DashboardStats",
  component: DashboardStats,
  args: {
    items: mockDashboardKpis,
  },
} satisfies Meta<typeof DashboardStats>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
