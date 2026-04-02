import type { Meta, StoryObj } from "@storybook/react";

import { Input } from "@/shared/ui/input";

const meta = {
  title: "UI/Input",
  component: Input,
  args: {
    placeholder: "Search by company or role",
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    defaultValue: "Frontend engineer",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "Unavailable in this state",
  },
};
