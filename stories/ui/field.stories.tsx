import type { Meta, StoryObj } from "@storybook/react";

import { FieldShell, FormErrorMessage } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";

const meta = {
  title: "UI/Field",
  component: FieldShell,
  parameters: {
    layout: "padded",
  },
  args: {
    htmlFor: "storybook-field",
    label: "Company",
    children: (
      <Input id="storybook-field" placeholder="Linear" defaultValue="Linear" />
    ),
  },
} satisfies Meta<typeof FieldShell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    description: "Optional helper text shown below the field.",
  },
};

export const WithError: Story = {
  args: {
    error: "This field is required.",
  },
};

export const FormLevelError: Story = {
  render: () => (
    <div className="max-w-md space-y-4">
      <FieldShell
        htmlFor="storybook-email"
        label="Email"
        error="Enter a valid email address."
      >
        <Input id="storybook-email" defaultValue="invalid-email" />
      </FieldShell>
      <FormErrorMessage>
        The form could not be submitted. Review the highlighted fields.
      </FormErrorMessage>
    </div>
  ),
};
