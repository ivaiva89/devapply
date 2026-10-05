import { defineConfig } from "drizzle-kit";

import { env } from "./shared/config/env";

export default defineConfig({
  dialect: "postgresql",
  schema: "./shared/db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
