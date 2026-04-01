import type { Meta, StoryObj } from "@storybook/react";

import { ApplicationsEmptyState } from "@/features/applications/components/applications-empty-state";

const meta = {
  title: "Features/ApplicationsEmptyState",
  component: ApplicationsEmptyState,
  args: {
    hasFilters: false,
  },
} satisfies Meta<typeof ApplicationsEmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoApplications: Story = {};

export const NoResults: Story = {
  args: {
    hasFilters: true,
  },
};
