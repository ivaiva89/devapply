import type { Meta, StoryObj } from "@storybook/react";

import { ApplicationCard } from "@/entities/application/ui/application-card";
import { mockApplicationCard } from "@/shared/mocks/ui-fixtures";

const meta = {
  title: "Features/ApplicationCard",
  component: ApplicationCard,
  args: {
    item: mockApplicationCard,
  },
} satisfies Meta<typeof ApplicationCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Draggable: Story = {
  args: {
    draggable: true,
  },
};
