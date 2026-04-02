import type { Meta, StoryObj } from "@storybook/react";

import { RecentApplicationsCard } from "@/widgets/dashboard/ui/recent-applications-card";
import { mockRecentApplications } from "@/shared/mocks/ui-fixtures";

const meta = {
  title: "Features/Dashboard/RecentApplicationsCard",
  component: RecentApplicationsCard,
  args: {
    items: mockRecentApplications,
  },
} satisfies Meta<typeof RecentApplicationsCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    items: [],
  },
};
