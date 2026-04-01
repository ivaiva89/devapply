import "dotenv/config";

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DIRECT_URL"),
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL
      ? env("SHADOW_DATABASE_URL")
      : undefined,
  },
  migrations: {
    seed: "node prisma/seed.mjs",
  },
});
