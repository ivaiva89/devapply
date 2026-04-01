import type { Meta, StoryObj } from "@storybook/react";

import { AttachResumeFormPresenter } from "@/features/resumes/components/attach-resume-form-presenter";
import { mockResumeApplicationOptions } from "@/lib/mocks/ui-fixtures";

const meta = {
  title: "Features/Resumes/AttachResumeFormPresenter",
  component: AttachResumeFormPresenter,
  args: {
    applicationOptions: mockResumeApplicationOptions,
    resumeId: "resume-1",
  },
} satisfies Meta<typeof AttachResumeFormPresenter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: "Choose an application to attach this resume to.",
  },
};

export const WithoutOptions: Story = {
  args: {
    applicationOptions: [],
  },
};
