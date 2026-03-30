import type { Meta, StoryObj } from "@storybook/react";

import { PipelineOverviewCard } from "@/features/dashboard/components/pipeline-overview-card";
import { mockApplicationsStatusDistribution } from "@/lib/mocks/ui-fixtures";

const meta = {
  title: "Features/Dashboard/PipelineOverviewCard",
  component: PipelineOverviewCard,
  args: {
    items: mockApplicationsStatusDistribution,
    isEmpty: false,
  },
} satisfies Meta<typeof PipelineOverviewCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    items: [],
    isEmpty: true,
  },
};
