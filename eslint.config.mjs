import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "storybook-static/**",
    "next-env.d.ts",
    // Git worktrees and their build artifacts:
    ".claude/worktrees/**",
    ".tools/**",
  ]),
  {
    files: [
      "stories/**/*.{js,jsx,ts,tsx}",
      "app/(v0)/preview/**/*.{js,jsx,ts,tsx}",
      "shared/mocks/**/*.{js,jsx,ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "server-only",
              message:
                "Storybook, preview, and mock fixtures must stay backend-agnostic.",
            },
            {
              name: "@prisma/client",
              message:
                "Storybook, preview, and mock fixtures must not import Prisma.",
            },
            {
              name: "@/shared/lib/prisma",
              message:
                "Storybook, preview, and mock fixtures must not import Prisma helpers.",
            },
            {
              name: "@clerk/nextjs",
              message:
                "Storybook, preview, and mock fixtures must not import Clerk client modules.",
            },
          ],
          patterns: [
            {
              group: ["@/features/*/server/*"],
              message:
                "Storybook, preview, and mock fixtures must not import feature server modules.",
            },
            {
              group: ["@/features/auth/server/*"],
              message:
                "Storybook, preview, and mock fixtures must not import auth server modules.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
