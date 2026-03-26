import type { Meta, StoryObj } from "@storybook/react";

import { ApplicationCard } from "@/features/applications/components/application-card";
import { mockApplicationCard } from "@/lib/mocks/ui-fixtures";

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
