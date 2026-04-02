import type { Meta, StoryObj } from "@storybook/react";

import { SectionHeader } from "@/shared/design/section-header";
import { Button } from "@/shared/ui/button";

const meta = {
  title: "Design/SectionHeader",
  component: SectionHeader,
  args: {
    eyebrow: "Dashboard",
    title: "Job search overview",
    description:
      "Track current pipeline volume, recent application activity, and follow-ups without leaving the authenticated workspace.",
    actions: <Button size="sm">Export</Button>,
  },
} satisfies Meta<typeof SectionHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
