import type { Meta, StoryObj } from "@storybook/react";

import { compactControlClassName } from "@/shared/ui/form-controls";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

const options = [
  { value: "wishlist", label: "Wishlist" },
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
];

const meta = {
  title: "UI/Select",
  component: Select,
  parameters: {
    layout: "padded",
  },
  render: (args) => (
    <div className="w-72">
      <Select {...args}>
        <SelectTrigger>
          <SelectValue placeholder="Choose a status" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
  args: {
    items: options,
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    defaultValue: "interview",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "applied",
  },
};

export const Compact: Story = {
  render: (args) => (
    <div className="w-56">
      <Select {...args}>
        <SelectTrigger className={compactControlClassName}>
          <SelectValue placeholder="Choose a status" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
};
