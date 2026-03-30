import type { Meta, StoryObj } from "@storybook/react";

import { NewApplicationTrigger } from "@/features/applications/components/new-application-trigger";

const meta = {
  title: "Features/Applications/NewApplicationTrigger",
  component: NewApplicationTrigger,
} satisfies Meta<typeof NewApplicationTrigger>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
