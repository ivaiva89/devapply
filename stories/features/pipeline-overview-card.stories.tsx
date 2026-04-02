import type { Meta, StoryObj } from "@storybook/react";

import { PipelineOverviewCard } from "@/widgets/dashboard/ui/pipeline-overview-card";
import { mockApplicationsStatusDistribution } from "@/shared/mocks/ui-fixtures";

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
