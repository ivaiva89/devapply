import type { Meta, StoryObj } from "@storybook/react";

import { RecentApplicationsSection } from "@/features/dashboard/components/recent-applications-section";
import { mockRecentApplications } from "@/lib/mocks/ui-fixtures";

const meta = {
  title: "Features/RecentApplicationsSection",
  component: RecentApplicationsSection,
  args: {
    items: mockRecentApplications,
  },
} satisfies Meta<typeof RecentApplicationsSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    items: [],
  },
};
