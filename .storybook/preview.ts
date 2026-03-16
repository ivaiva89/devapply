import type { Preview } from "@storybook/nextjs-vite";
import { createElement } from "react";

import "../app/globals.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) =>
      createElement(
        "div",
        { className: "min-h-screen bg-background p-6 text-foreground" },
        createElement(Story),
      ),
  ],
};

export default preview;
