import type { Config } from "tailwindcss";

export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./widgets/**/*.{ts,tsx}",
    "./shared/**/*.{ts,tsx}",
    "./entities/**/*.{ts,tsx}",
    "./stories/**/*.{ts,tsx}",
  ],
} satisfies Config;
