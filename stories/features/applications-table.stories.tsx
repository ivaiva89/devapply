import type { Meta, StoryObj } from "@storybook/react";

import { ApplicationsTable } from "@/features/applications/components/applications-table";
import { mockApplicationTableRows } from "@/lib/mocks/ui-fixtures";

const meta = {
  title: "Features/ApplicationsTable",
  component: ApplicationsTable,
  args: {
    applications: mockApplicationTableRows,
  },
} satisfies Meta<typeof ApplicationsTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    applications: [],
  },
};
