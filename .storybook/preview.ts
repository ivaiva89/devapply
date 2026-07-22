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
        { className: "min-h-screen bg-canvas p-6 text-text" },
        createElement(Story),
      ),
  ],
};

export default preview;
