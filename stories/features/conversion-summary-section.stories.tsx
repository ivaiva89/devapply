import type { Meta, StoryObj } from "@storybook/react";

import { ConversionSummarySection } from "@/widgets/dashboard/ui/conversion-summary-section";
import { mockDashboardConversions } from "@/shared/mocks/ui-fixtures";

const meta = {
  title: "Features/ConversionSummarySection",
  component: ConversionSummarySection,
  args: {
    items: mockDashboardConversions,
    isEmpty: false,
  },
} satisfies Meta<typeof ConversionSummarySection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    items: [],
    isEmpty: true,
  },
};
