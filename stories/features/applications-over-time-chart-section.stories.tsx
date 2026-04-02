import type { Meta, StoryObj } from "@storybook/react";

import { ApplicationsOverTimeChartSection } from "@/widgets/dashboard/ui/applications-over-time-chart-section";
import { mockApplicationsOverTime } from "@/shared/mocks/ui-fixtures";

const meta = {
  title: "Features/ApplicationsOverTimeChartSection",
  component: ApplicationsOverTimeChartSection,
  args: {
    items: mockApplicationsOverTime,
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
