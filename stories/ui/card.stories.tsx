import type { Meta, StoryObj } from "@storybook/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function DemoCard() {
  return (
    <Card className="w-[360px]">
      <CardHeader>
        <CardDescription>Applications</CardDescription>
        <CardTitle>Senior Frontend Engineer</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Track the current hiring stage, notes, and outreach history without
        leaving the workspace.
      </CardContent>
      <CardFooter className="justify-between text-xs text-muted-foreground">
        <span>Updated Mar 18</span>
        <span>Interview</span>
      </CardFooter>
    </Card>
  );
}

const meta = {
  title: "UI/Card",
  component: DemoCard,
} satisfies Meta<typeof DemoCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
