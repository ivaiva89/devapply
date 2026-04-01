import type { Meta, StoryObj } from "@storybook/react";

import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";

const meta = {
  title: "Features/DashboardEmptyState",
  component: DashboardEmptyState,
} satisfies Meta<typeof DashboardEmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
