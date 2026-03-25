import type { Meta, StoryObj } from "@storybook/react";

import { ApplicationsStatusChartSection } from "@/features/dashboard/components/applications-status-chart-section";

const meta = {
  title: "Features/ApplicationsStatusChartSection",
  component: ApplicationsStatusChartSection,
  args: {
    items: [
      { status: "WISHLIST", count: 8, percentage: 24 },
      { status: "APPLIED", count: 17, percentage: 50 },
      { status: "INTERVIEW", count: 6, percentage: 18 },
      { status: "OFFER", count: 2, percentage: 6 },
      { status: "REJECTED", count: 1, percentage: 2 },
    ],
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
