import type { Meta, StoryObj } from "@storybook/react";

import { StatsGrid } from "@/widgets/dashboard/ui/stats-grid";
import { mockDashboardKpis } from "@/shared/mocks/ui-fixtures";

const meta = {
  title: "Features/Dashboard/StatsGrid",
  component: StatsGrid,
  args: {
    items: mockDashboardKpis,
  },
} satisfies Meta<typeof StatsGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
