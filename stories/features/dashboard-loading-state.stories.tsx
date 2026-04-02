import type { Meta, StoryObj } from "@storybook/react";

import { DashboardLoadingState } from "@/widgets/dashboard/ui/dashboard-loading-state";

const meta = {
  title: "Features/Dashboard/DashboardLoadingState",
  component: DashboardLoadingState,
} satisfies Meta<typeof DashboardLoadingState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
