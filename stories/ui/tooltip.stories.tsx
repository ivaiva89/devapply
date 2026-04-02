import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/shared/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

function DemoTooltip() {
  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex min-h-40 items-center justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>
            Upgrade prompts should feel helpful, not noisy.
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

const meta = {
  title: "UI/Tooltip",
  component: DemoTooltip,
} satisfies Meta<typeof DemoTooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
