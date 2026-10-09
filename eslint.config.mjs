import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    // The environment is read in shared/config and the root config files
    // only, so .env.example can be checked against what the code reads.
    ignores: ["shared/config/**", "*.config.{ts,mjs}", "**/*.test.{ts,tsx}"],
    rules: {
      "no-restricted-properties": [
        "error",
        {
          object: "process",
          property: "env",
          message:
            "Read the environment through shared/config, not process.env.",
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "next-env.d.ts",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    ".claude/worktrees/**",
    ".worktrees/**",
  ]),
]);

export default eslintConfig;
