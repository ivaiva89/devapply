import type { Meta, StoryObj } from "@storybook/react";

import { UploadResumeFormPresenter } from "@/features/resumes/components/upload-resume-form-presenter";

const meta = {
  title: "Features/Resumes/UploadResumeFormPresenter",
  component: UploadResumeFormPresenter,
  args: {
    canUpload: true,
  },
} satisfies Meta<typeof UploadResumeFormPresenter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: "Upload a PDF, DOC, or DOCX resume file.",
  },
};

export const DisabledByPlan: Story = {
  args: {
    canUpload: false,
  },
};
