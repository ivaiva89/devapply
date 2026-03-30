import type { Meta, StoryObj } from "@storybook/react";

import { ApplicationsFiltersPresenter } from "@/features/applications/components/applications-filters-presenter";

const meta = {
  title: "Features/Applications/ApplicationsFiltersPresenter",
  component: ApplicationsFiltersPresenter,
  args: {
    state: {
      query: "engineer",
      status: "INTERVIEW",
      sort: "updated-desc",
    },
  },
} satisfies Meta<typeof ApplicationsFiltersPresenter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Filtered: Story = {};

export const Default: Story = {
  args: {
    state: {
      query: "",
      status: "ALL",
      sort: "updated-desc",
    },
  },
};
