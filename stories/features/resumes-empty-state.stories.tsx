import type { Meta, StoryObj } from "@storybook/react";

import { ResumesEmptyState } from "@/features/resumes/components/resumes-empty-state";

const meta = {
  title: "Features/ResumesEmptyState",
  component: ResumesEmptyState,
  args: {
    canUpload: true,
  },
} satisfies Meta<typeof ResumesEmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const CanUpload: Story = {};

export const LimitReached: Story = {
  args: {
    canUpload: false,
  },
};
