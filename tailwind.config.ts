import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        devapply: {
          primary: "#4F46E5",
          accent: "#14B8A6",
          success: "#10B981",
          warning: "#F59E0B",
          danger: "#EF4444",
        },
      },
    },
  },
} satisfies Config;
