import type { Meta, StoryObj } from "@storybook/react";

import { UploadResumeFormPresenter } from "@/features/resumes/components/upload-resume-form-presenter";

const meta = {
  title: "Features/Resumes/UploadResumeFormPresenter",
  component: UploadResumeFormPresenter,
} satisfies Meta<typeof UploadResumeFormPresenter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: "Upload a PDF, DOC, or DOCX resume file.",
  },
};
