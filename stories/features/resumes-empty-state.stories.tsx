import type { Meta, StoryObj } from "@storybook/react";

import { ResumesEmptyState } from "@/widgets/resumes-panel/ui/resumes-empty-state";

const meta = {
  title: "Features/ResumesEmptyState",
  component: ResumesEmptyState,
} satisfies Meta<typeof ResumesEmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
