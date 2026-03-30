import type { Meta, StoryObj } from "@storybook/react";

import { ApplicationFormModalPresenter } from "@/features/applications/components/application-form-modal-presenter";
import {
  createApplicationDefaultValues,
  getCreateApplicationInitialState,
} from "@/features/applications/create-application-form";

const meta = {
  title: "Features/Applications/ApplicationFormModalPresenter",
  component: ApplicationFormModalPresenter,
  args: {
    description:
      "Add a new application without leaving the current list and filters.",
    isOpen: true,
    onCancel: () => undefined,
    state: getCreateApplicationInitialState(createApplicationDefaultValues),
    submitLabel: "Create application",
    submittingLabel: "Saving...",
    title: "New application",
  },
} satisfies Meta<typeof ApplicationFormModalPresenter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValidationErrors: Story = {
  args: {
    state: {
      status: "error",
      values: {
        ...createApplicationDefaultValues,
        role: "Frontend Engineer",
      },
      fieldErrors: {
        company: "Enter a company name.",
        jobUrl: "Enter a valid URL.",
      },
      formError: "Fix the highlighted fields and try again.",
    },
  },
};
