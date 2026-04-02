import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/design/empty-state";

const meta = {
  title: "Design/EmptyState",
  component: EmptyState,
  args: {
    eyebrow: "Applications",
    title: "No applications yet.",
    description:
      "Once applications are created, they will appear here with search, status filtering, and sort controls.",
    action: <Button>New application</Button>,
  },
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
