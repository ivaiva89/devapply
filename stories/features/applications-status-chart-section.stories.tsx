import type { Meta, StoryObj } from "@storybook/react";

import { ApplicationsStatusChartSection } from "@/features/dashboard/components/applications-status-chart-section";
import { mockApplicationsStatusDistribution } from "@/lib/mocks/ui-fixtures";

const meta = {
  title: "Features/ApplicationsStatusChartSection",
  component: ApplicationsStatusChartSection,
  args: {
    items: mockApplicationsStatusDistribution,
    isEmpty: false,
  },
} satisfies Meta<typeof ApplicationsStatusChartSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    items: [],
    isEmpty: true,
  },
};
