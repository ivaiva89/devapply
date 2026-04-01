import type { Meta, StoryObj } from "@storybook/react";

import { ResumeListPresenter } from "@/features/resumes/components/resume-list-presenter";
import { mockResumeListItems } from "@/lib/mocks/ui-fixtures";

const meta = {
  title: "Features/Resumes/ResumeListPresenter",
  component: ResumeListPresenter,
  args: {
    resumes: mockResumeListItems,
    renderAttachForm: () => (
      <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        Attach form preview
      </div>
    ),
  },
} satisfies Meta<typeof ResumeListPresenter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutAttachForm: Story = {
  args: {
    renderAttachForm: undefined,
  },
};
