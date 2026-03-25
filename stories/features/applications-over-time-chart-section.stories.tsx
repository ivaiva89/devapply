import type { Meta, StoryObj } from "@storybook/react";

import { ApplicationsOverTimeChartSection } from "@/features/dashboard/components/applications-over-time-chart-section";

const meta = {
  title: "Features/ApplicationsOverTimeChartSection",
  component: ApplicationsOverTimeChartSection,
  args: {
    items: [
      { label: "Oct", count: 3 },
      { label: "Nov", count: 5 },
      { label: "Dec", count: 7 },
      { label: "Jan", count: 9 },
      { label: "Feb", count: 11 },
      { label: "Mar", count: 7 },
    ],
    isEmpty: false,
  },
} satisfies Meta<typeof ApplicationsOverTimeChartSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    items: [],
    isEmpty: true,
  },
};
